// Supabase Integration for CrowdScore2
// Gradual migration - keeps existing functionality while adding Supabase

// Using CDN version of Supabase
const { createClient } = supabase;

// Configuration
const SUPABASE_URL = 'https://afxrskzvziycdcimmamj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeHJza3p2eml5Y2RjaW1tYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mzg2NzcsImV4cCI6MjA3NjExNDY3N30.GO-Vv5hn2UuE6OTmF1PQwb_5UYvAW3DcFLN9MIr-kX8';

// Initialize Supabase client
let supabase = null;
let supabaseConnected = false;

// Try to connect to Supabase
try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseConnected = true;
    console.log('✅ Supabase connected successfully');
} catch (error) {
    console.warn('⚠️ Supabase connection failed, using localStorage fallback:', error);
    supabaseConnected = false;
}

// Authentication with fallback
export const auth = {
    // Sign up with fallback
    async signUp(email, password, name) {
        if (supabaseConnected) {
            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { name: name }
                    }
                });
                
                if (error) throw error;
                
                console.log('✅ Supabase signup successful');
                return { data, error: null, method: 'supabase' };
            } catch (error) {
                console.warn('⚠️ Supabase signup failed, falling back to localStorage:', error);
                // Fall back to localStorage
                return this.signUpLocalStorage(email, password, name);
            }
        } else {
            return this.signUpLocalStorage(email, password, name);
        }
    },

    // Sign in with fallback
    async signIn(email, password) {
        if (supabaseConnected) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                
                if (error) throw error;
                
                console.log('✅ Supabase signin successful');
                return { data, error: null, method: 'supabase' };
            } catch (error) {
                console.warn('⚠️ Supabase signin failed, falling back to localStorage:', error);
                return this.signInLocalStorage(email, password);
            }
        } else {
            return this.signInLocalStorage(email, password);
        }
    },

    // Google sign in
    async signInWithGoogle() {
        if (supabaseConnected) {
            try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                return { data, error };
            } catch (error) {
                console.warn('⚠️ Google signin failed:', error);
                return { data: null, error };
            }
        } else {
            console.warn('⚠️ Supabase not connected, Google signin unavailable');
            return { data: null, error: new Error('Supabase not connected') };
        }
    },

    // Sign out
    async signOut() {
        if (supabaseConnected) {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                console.log('✅ Supabase signout successful');
            } catch (error) {
                console.warn('⚠️ Supabase signout failed:', error);
            }
        }
        
        // Always clear localStorage
        localStorage.removeItem('crowdscore_user');
        currentUser = null;
        isLoggedIn = false;
    },

    // Get current user
    async getCurrentUser() {
        if (supabaseConnected) {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                return { user, error: null, method: 'supabase' };
            } catch (error) {
                console.warn('⚠️ Supabase getCurrentUser failed, checking localStorage:', error);
            }
        }
        
        // Fall back to localStorage
        return this.getCurrentUserLocalStorage();
    },

    // Listen to auth changes
    onAuthStateChange(callback) {
        if (supabaseConnected) {
            return supabase.auth.onAuthStateChange(callback);
        } else {
            // Fallback: simulate auth state change for localStorage
            const checkLocalStorage = () => {
                const savedUser = localStorage.getItem('crowdscore_user');
                if (savedUser) {
                    callback('SIGNED_IN', { user: JSON.parse(savedUser) });
                } else {
                    callback('SIGNED_OUT', null);
                }
            };
            
            // Check immediately and set up interval
            checkLocalStorage();
            const interval = setInterval(checkLocalStorage, 1000);
            
            return {
                data: { subscription: { unsubscribe: () => clearInterval(interval) } }
            };
        }
    },

    // LOCALSTORAGE FALLBACK METHODS
    signUpLocalStorage(email, password, name) {
        console.log('📱 Using localStorage signup fallback');
        const user = {
            id: Date.now().toString(),
            email,
            name,
            created_at: new Date().toISOString()
        };
        
        localStorage.setItem('crowdscore_user', JSON.stringify(user));
        return { data: { user }, error: null, method: 'localStorage' };
    },

    signInLocalStorage(email, password) {
        console.log('📱 Using localStorage signin fallback');
        const savedUser = localStorage.getItem('crowdscore_user');
        
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user.email === email) {
                return { data: { user }, error: null, method: 'localStorage' };
            }
        }
        
        return { data: null, error: new Error('Invalid credentials') };
    },

    getCurrentUserLocalStorage() {
        console.log('📱 Using localStorage getCurrentUser fallback');
        const savedUser = localStorage.getItem('crowdscore_user');
        return { 
            user: savedUser ? JSON.parse(savedUser) : null, 
            error: null, 
            method: 'localStorage' 
        };
    }
};

// Scorecard management with fallback
export const scorecards = {
    // Save scorecard with fallback
    async save(scorecardData) {
        if (supabaseConnected) {
            try {
                const { data, error } = await supabase
                    .from('scorecards')
                    .insert([scorecardData])
                    .select();
                
                if (error) throw error;
                
                console.log('✅ Scorecard saved to Supabase');
                return { data, error: null, method: 'supabase' };
            } catch (error) {
                console.warn('⚠️ Supabase save failed, falling back to localStorage:', error);
                return this.saveLocalStorage(scorecardData);
            }
        } else {
            return this.saveLocalStorage(scorecardData);
        }
    },

    // Get user's scorecards with fallback
    async getUserScorecards(userId) {
        if (supabaseConnected) {
            try {
                const { data, error } = await supabase
                    .from('scorecards')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                console.log('✅ Scorecards loaded from Supabase');
                return { data, error: null, method: 'supabase' };
            } catch (error) {
                console.warn('⚠️ Supabase load failed, falling back to localStorage:', error);
                return this.getUserScorecardsLocalStorage(userId);
            }
        } else {
            return this.getUserScorecardsLocalStorage(userId);
        }
    },

    // LOCALSTORAGE FALLBACK METHODS
    saveLocalStorage(scorecardData) {
        console.log('📱 Using localStorage save fallback');
        
        const savedScorecards = JSON.parse(localStorage.getItem('crowdscore_scorecards') || '[]');
        const newScorecard = {
            ...scorecardData,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
        };
        
        savedScorecards.push(newScorecard);
        localStorage.setItem('crowdscore_scorecards', JSON.stringify(savedScorecards));
        
        return { data: [newScorecard], error: null, method: 'localStorage' };
    },

    getUserScorecardsLocalStorage(userId) {
        console.log('📱 Using localStorage load fallback');
        
        const savedScorecards = JSON.parse(localStorage.getItem('crowdscore_scorecards') || '[]');
        const userScorecards = savedScorecards.filter(card => card.user_id === userId);
        
        return { data: userScorecards, error: null, method: 'localStorage' };
    }
};

// Fights management
export const fights = {
    // Get fights from Supabase (no fallback needed - this is new data)
    async getAll() {
        if (supabaseConnected) {
            try {
                const { data, error } = await supabase
                    .from('fights')
                    .select('*')
                    .order('fight_date', { ascending: true });
                
                if (error) throw error;
                
                console.log('✅ Fights loaded from Supabase');
                return { data, error: null };
            } catch (error) {
                console.warn('⚠️ Failed to load fights from Supabase:', error);
                return { data: [], error };
            }
        } else {
            console.warn('⚠️ Supabase not connected, using empty fights list');
            return { data: [], error: null };
        }
    }
};

// Connection status
export const getConnectionStatus = () => {
    return {
        connected: supabaseConnected,
        method: supabaseConnected ? 'supabase' : 'localStorage',
        url: SUPABASE_URL
    };
};

// Export supabase client for advanced usage
export { supabase, supabaseConnected };
export default { auth, scorecards, fights, getConnectionStatus };
