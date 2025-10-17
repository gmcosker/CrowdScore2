// Supabase Configuration for CrowdScore2
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
  // Get these from your Supabase project settings
  url: 'https://afxrskzvziycdcimmamj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeHJza3p2eml5Y2RjaW1tYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mzg2NzcsImV4cCI6MjA3NjExNDY3N30.GO-Vv5hn2UuE6OTmF1PQwb_5UYvAW3DcFLN9MIr-kX8',
};

// Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Authentication functions
export const auth = {
  // Sign up new user
  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    return { data, error };
  },

  // Sign in existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database functions
export const db = {
  // Save a scorecard
  async saveScorecard(scorecardData) {
    const { data, error } = await supabase
      .from('scorecards')
      .insert([scorecardData])
      .select();
    return { data, error };
  },

  // Get user's scorecards
  async getUserScorecards(userId) {
    const { data, error } = await supabase
      .from('scorecards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get all fights
  async getFights() {
    const { data, error } = await supabase
      .from('fights')
      .select('*')
      .order('fight_date', { ascending: true });
    return { data, error };
  },

  // Get fight by ID
  async getFightById(fightId) {
    const { data, error } = await supabase
      .from('fights')
      .select('*')
      .eq('id', fightId)
      .single();
    return { data, error };
  },

  // Get round analytics for a fight
  async getRoundAnalytics(fightId) {
    const { data, error } = await supabase
      .from('round_analytics')
      .select('*')
      .eq('fight_id', fightId)
      .order('round_number', { ascending: true });
    return { data, error };
  },

  // Get all scorecards for a fight (for analytics)
  async getFightScorecards(fightId) {
    const { data, error } = await supabase
      .from('scorecards')
      .select('*')
      .eq('fight_id', fightId);
    return { data, error };
  },

  // Update user profile
  async updateProfile(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profileData.id)
      .select();
    return { data, error };
  },

  // Check if user is admin
  async isUserAdmin(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    return { data, error };
  }
};

// Admin functions (only accessible by admin users)
export const admin = {
  // Get all users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get all scorecards
  async getAllScorecards() {
    const { data, error } = await supabase
      .from('scorecards')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get analytics data
  async getAnalytics() {
    const { data, error } = await supabase
      .from('scorecards')
      .select('fight_id, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days
    return { data, error };
  },

  // Create a new fight
  async createFight(fightData) {
    const { data, error } = await supabase
      .from('fights')
      .insert([fightData])
      .select();
    return { data, error };
  }
};

export default supabase;
