-- CrowdScore2 Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fights table
CREATE TABLE IF NOT EXISTS public.fights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter1_name TEXT NOT NULL,
    fighter2_name TEXT NOT NULL,
    fight_date DATE NOT NULL,
    venue TEXT,
    network TEXT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
    total_scorecards INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scorecards table
CREATE TABLE IF NOT EXISTS public.scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    fight_id UUID REFERENCES public.fights(id) ON DELETE SET NULL,
    fighter1_name TEXT NOT NULL,
    fighter2_name TEXT NOT NULL,
    fighter1_scores INTEGER[] NOT NULL, -- Array of 12 scores
    fighter2_scores INTEGER[] NOT NULL, -- Array of 12 scores
    fight_date DATE NOT NULL,
    fight_origin TEXT DEFAULT 'manual' CHECK (fight_origin IN ('manual', 'live-event')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create round analytics table
CREATE TABLE IF NOT EXISTS public.round_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fight_id UUID NOT NULL REFERENCES public.fights(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number >= 1 AND round_number <= 12),
    fighter1_wins INTEGER DEFAULT 0,
    fighter2_wins INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(fight_id, round_number)
);

-- Create user email preferences table
CREATE TABLE IF NOT EXISTS public.user_email_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    wants_fight_results BOOLEAN DEFAULT TRUE,
    wants_round_breakdowns BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scorecards_user_id ON public.scorecards(user_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_fight_id ON public.scorecards(fight_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_fight_date ON public.scorecards(fight_date);
CREATE INDEX IF NOT EXISTS idx_fights_fight_date ON public.fights(fight_date);
CREATE INDEX IF NOT EXISTS idx_fights_status ON public.fights(status);
CREATE INDEX IF NOT EXISTS idx_round_analytics_fight_id ON public.round_analytics(fight_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.round_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_email_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Fights: Everyone can view fights
CREATE POLICY "Anyone can view fights" ON public.fights
    FOR SELECT USING (true);

-- Admins can manage fights
CREATE POLICY "Admins can manage fights" ON public.fights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Scorecards: Users can view and manage their own scorecards
CREATE POLICY "Users can view own scorecards" ON public.scorecards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scorecards" ON public.scorecards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scorecards" ON public.scorecards
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all scorecards
CREATE POLICY "Admins can view all scorecards" ON public.scorecards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Round analytics: Everyone can view
CREATE POLICY "Anyone can view round analytics" ON public.round_analytics
    FOR SELECT USING (true);

-- Admins can manage round analytics
CREATE POLICY "Admins can manage round analytics" ON public.round_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Email preferences: Users can manage their own
CREATE POLICY "Users can manage own email preferences" ON public.user_email_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update fight total_scorecards count
CREATE OR REPLACE FUNCTION public.update_fight_scorecard_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.fights 
        SET total_scorecards = (
            SELECT COUNT(*) 
            FROM public.scorecards 
            WHERE fight_id = NEW.fight_id
        )
        WHERE id = NEW.fight_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        UPDATE public.fights 
        SET total_scorecards = (
            SELECT COUNT(*) 
            FROM public.scorecards 
            WHERE fight_id = OLD.fight_id
        )
        WHERE id = OLD.fight_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for scorecard count updates
DROP TRIGGER IF EXISTS update_fight_count_on_scorecard_change ON public.scorecards;
CREATE TRIGGER update_fight_count_on_scorecard_change
    AFTER INSERT OR UPDATE OR DELETE ON public.scorecards
    FOR EACH ROW EXECUTE FUNCTION public.update_fight_scorecard_count();

-- Insert some sample fights for testing
INSERT INTO public.fights (fighter1_name, fighter2_name, fight_date, venue, network, status) VALUES
('Tyson Fury', 'Oleksandr Usyk', '2025-01-15', 'Kingdom Arena', 'ESPN+', 'upcoming'),
('Deontay Wilder', 'Anthony Joshua', '2025-01-20', 'MGM Grand', 'DAZN', 'upcoming'),
('Canelo Alvarez', 'David Benavidez', '2025-02-01', 'T-Mobile Arena', 'Showtime', 'upcoming');
