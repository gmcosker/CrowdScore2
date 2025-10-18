// Supabase Integration for CrowdScore2
// Gradual migration - keeps existing functionality while adding Supabase

// Using CDN version of Supabase
let createClient;
if (typeof supabase !== 'undefined') {
    createClient = supabase.createClient;
    console.log('✅ Supabase CDN loaded');
} else {
    console.warn('⚠️ Supabase CDN not loaded');
}

// Configuration
const SUPABASE_URL = 'https://afxrskzvziycdcimmamj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeHJza3p2eml5Y2RjaW1tYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mzg2NzcsImV4cCI6MjA3NjExNDY3N30.GO-Vv5hn2UuE6OTmF1PQwb_5UYvAW3DcFLN9MIr-kX8';

// Initialize Supabase client
let supabaseClient = null;
let supabaseConnected = false;
let connectionMethod = 'localStorage';

// Try to connect to Supabase
if (createClient) {
try {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseConnected = true;
        connectionMethod = 'supabase';
    console.log('✅ Supabase connected successfully');
} catch (error) {
        console.warn('⚠️ Supabase connection failed:', error);
    supabaseConnected = false;
        connectionMethod = 'localStorage';
    }
} else {
    console.log('📱 Using localStorage fallback - Supabase CDN not available');
}

// Make functions globally available
window.getConnectionStatus = function() {
    return { connected: supabaseConnected, method: connectionMethod };
};

// Authentication functions
window.signUpUser = async function(email, password, name) {
    if (supabaseConnected && supabaseClient) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { name: name }
                }
            });
            if (error) throw error;
            console.log('✅ Supabase signup successful');
            return { success: true, user: data.user, method: 'supabase' };
        } catch (error) {
            console.warn('⚠️ Supabase signup failed, falling back to localStorage:', error);
            return signUpLocalStorage(email, password, name);
        }
    } else {
        return signUpLocalStorage(email, password, name);
    }
};

window.signInUser = async function(email, password) {
    if (supabaseConnected && supabaseClient) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) throw error;
            console.log('✅ Supabase signin successful');
            return { success: true, user: data.user, method: 'supabase' };
        } catch (error) {
            console.warn('⚠️ Supabase signin failed, falling back to localStorage:', error);
            return signInLocalStorage(email, password);
        }
    } else {
        return signInLocalStorage(email, password);
    }
};

window.signOutUser = async function() {
    if (supabaseConnected && supabaseClient) {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            console.log('✅ Supabase signout successful');
            return { success: true, method: 'supabase' };
        } catch (error) {
            console.warn('⚠️ Supabase signout failed, falling back to localStorage:', error);
            return signOutLocalStorage();
        }
    } else {
        return signOutLocalStorage();
    }
};

window.signInWithGoogle = async function() {
    if (supabaseConnected && supabaseClient) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
            console.log('✅ Supabase Google signin initiated');
            return { success: true, data, method: 'supabase' };
        } catch (error) {
            console.warn('⚠️ Supabase Google signin failed:', error);
            return { success: false, error: error.message };
        }
    } else {
        console.log('📱 Supabase not connected, Google OAuth not available');
        return { success: false, error: 'Supabase not connected for Google OAuth' };
    }
};

// Database functions
window.saveScorecard = async function(scorecardData) {
    if (supabaseConnected && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('scorecards')
                .insert([scorecardData]);
            if (error) throw error;
            console.log('✅ Scorecard saved to Supabase');
            return { success: true, data, method: 'supabase' };
        } catch (error) {
            console.warn('⚠️ Failed to save scorecard to Supabase, falling back to localStorage:', error);
            return saveScorecardLocalStorage(scorecardData);
        }
    } else {
        return saveScorecardLocalStorage(scorecardData);
    }
};

window.getMyScorecards = async function() {
    if (supabaseConnected && supabaseClient) {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) {
                console.log('📱 No user logged in via Supabase, falling back to localStorage');
                return getMyScorecardsLocalStorage();
            }
            
            const { data, error } = await supabaseClient
                .from('scorecards')
                .select('*')
                .eq('user_id', user.id);
            if (error) throw error;
            console.log('✅ Fetched scorecards from Supabase');
            return { success: true, data, method: 'supabase' };
        } catch (error) {
            console.warn('⚠️ Failed to fetch scorecards from Supabase, falling back to localStorage:', error);
            return getMyScorecardsLocalStorage();
        }
    } else {
        return getMyScorecardsLocalStorage();
    }
};

// Admin functions
window.getAdminData = async function() {
    if (supabaseConnected && supabaseClient) {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();

            if (profileError || !profile.is_admin) {
                return { success: false, error: 'Access Denied - Not an admin' };
            }

            // Fetch all data
            const [usersResult, scorecardsResult, fightsResult, roundAnalyticsResult] = await Promise.all([
                supabaseClient.from('profiles').select('*'),
                supabaseClient.from('scorecards').select('*'),
                supabaseClient.from('fights').select('*'),
                supabaseClient.from('round_analytics').select('*')
            ]);

            return {
                success: true,
                data: {
                    users: usersResult.data,
                    scorecards: scorecardsResult.data,
                    fights: fightsResult.data,
                    roundAnalytics: roundAnalyticsResult.data
                },
                method: 'supabase'
            };
        } catch (error) {
            console.warn('⚠️ Failed to fetch admin data from Supabase:', error);
            return { success: false, error: error.message };
        }
    } else {
        return { success: false, error: 'Supabase not connected' };
    }
};

// LocalStorage fallback functions
function signUpLocalStorage(email, password, name) {
    console.log('📱 Using localStorage for signup');
    const newUser = { 
        email, 
        name, 
        id: 'local_' + Date.now(),
        created_at: new Date().toISOString()
    };
    localStorage.setItem('crowdscore_user', JSON.stringify(newUser));
    return { success: true, user: newUser, method: 'localStorage' };
}

function signInLocalStorage(email, password) {
    console.log('📱 Using localStorage for signin');
    const savedUser = JSON.parse(localStorage.getItem('crowdscore_user') || '{}');
    if (savedUser && savedUser.email === email) {
        return { success: true, user: savedUser, method: 'localStorage' };
    }
    return { success: false, error: 'User not found or password mismatch' };
}

function signOutLocalStorage() {
    console.log('📱 Using localStorage for signout');
    localStorage.removeItem('crowdscore_user');
    return { success: true, method: 'localStorage' };
}

function saveScorecardLocalStorage(scorecardData) {
    console.log('📱 Using localStorage for scorecard save');
    const existingScorecards = JSON.parse(localStorage.getItem('myScorecards') || '[]');
    existingScorecards.push(scorecardData);
    localStorage.setItem('myScorecards', JSON.stringify(existingScorecards));
    return { success: true, method: 'localStorage' };
}

function getMyScorecardsLocalStorage() {
    console.log('📱 Using localStorage for scorecard fetch');
    const localScorecards = JSON.parse(localStorage.getItem('myScorecards') || '[]');
    return { success: true, data: localScorecards, method: 'localStorage' };
}

// Global functions (formerly exports)
window.supabaseIntegration = {
    getConnectionStatus: getConnectionStatus,
    supabaseClient: supabaseClient, // Expose the client for direct access
    signUpUser: async (email, password, name) => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            name: name
                        }
                    }
                });
                
                if (error) {
                    console.error('Supabase signup error:', error);
                    return { success: false, error: error.message };
                }
                
                if (data.user) {
                console.log('✅ Supabase signup successful');
                    return { 
                        success: true, 
                        user: {
                            id: data.user.id,
                            name: name,
                            email: email,
                            created_at: data.user.created_at
                        }
                    };
                }
                
                return { success: false, error: 'Signup failed' };
            } catch (error) {
                console.error('Supabase signup error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, using localStorage fallback');
            return signUpLocalStorage(email, password, name);
        }
    },
    signInUser: async (email, password) => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) {
                    console.error('Supabase signin error:', error);
                    return { success: false, error: error.message };
                }
                
                if (data.user) {
                console.log('✅ Supabase signin successful');
                    return { 
                        success: true, 
                        user: {
                            id: data.user.id,
                            name: data.user.user_metadata?.name || 'User',
                            email: data.user.email,
                            created_at: data.user.created_at
                        }
                    };
                }
                
                return { success: false, error: 'Signin failed' };
            } catch (error) {
                console.error('Supabase signin error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, using localStorage fallback');
            return signInLocalStorage(email, password);
        }
    },
    signOutUser: async () => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    console.error('Supabase signout error:', error);
                    return { success: false, error: error.message };
                }
                console.log('✅ Supabase signout successful');
                return { success: true };
            } catch (error) {
                console.error('Supabase signout error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, using localStorage fallback');
            return signOutLocalStorage();
        }
    },
    signInWithGoogle: async () => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { data, error } = await supabaseClient.auth.signInWithOAuth({
                    provider: 'google'
                });
                
                if (error) {
                    console.error('Supabase Google OAuth error:', error);
                    return { success: false, error: error.message };
                }
                
                console.log('✅ Supabase Google OAuth initiated');
                return { success: true, data: data };
            } catch (error) {
                console.error('Supabase Google OAuth error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, Google OAuth not available');
            return { success: false, error: 'Google OAuth not available' };
        }
    },
    saveScorecard: async (scorecardData) => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('scorecards')
                    .insert([scorecardData]);
                
                if (error) {
                    console.error('Supabase scorecard save error:', error);
                    return { success: false, error: error.message };
                }
                
                console.log('✅ Supabase scorecard saved');
                return { success: true, data: data };
            } catch (error) {
                console.error('Supabase scorecard save error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, using localStorage fallback');
            return saveScorecardLocalStorage(scorecardData);
        }
    },
    getMyScorecards: async () => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (!user) {
                    return { success: false, error: 'Not authenticated' };
                }
                
                const { data, error } = await supabaseClient
                    .from('scorecards')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('Supabase scorecard fetch error:', error);
                    return { success: false, error: error.message };
                }
                
                console.log('✅ Supabase scorecards fetched');
                return { success: true, data: data };
            } catch (error) {
                console.error('Supabase scorecard fetch error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, using localStorage fallback');
            return getMyScorecardsLocalStorage();
        }
    },
    getAdminData: async () => {
        if (supabaseConnected && supabaseClient) {
            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (!user) {
                    return { success: false, error: 'Not authenticated' };
                }
                
                // Check if user is admin (you can implement your own admin check)
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('is_admin')
                    .eq('user_id', user.id)
                    .single();
                
                if (!profile?.is_admin) {
                    return { success: false, error: 'Not authorized' };
                }
                
                // Get admin data
                const { data: scorecards, error: scorecardsError } = await supabaseClient
                    .from('scorecards')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (scorecardsError) {
                    console.error('Supabase admin data fetch error:', scorecardsError);
                    return { success: false, error: scorecardsError.message };
                }
                
                console.log('✅ Supabase admin data fetched');
                return { success: true, data: scorecards };
            } catch (error) {
                console.error('Supabase admin data fetch error:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('📱 Supabase not connected, admin data not available');
            return { success: false, error: 'Admin data not available' };
        }
    },
    // LocalStorage fallbacks
    signUpLocalStorage: (email, password, name) => {
        const savedUsers = JSON.parse(localStorage.getItem('crowdscore_users') || '[]');
        if (savedUsers.find(u => u.email === email)) {
            return { success: false, error: 'User with this email already exists' };
        }
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        savedUsers.push(newUser);
        localStorage.setItem('crowdscore_users', JSON.stringify(savedUsers));
        
        return { success: true, user: newUser };
    },
    signInLocalStorage: (email, password) => {
        const savedUsers = JSON.parse(localStorage.getItem('crowdscore_users') || '[]');
        const user = savedUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            return { success: true, user: user };
        } else {
            return { success: false, error: 'Invalid email or password' };
        }
    },
    signOutLocalStorage: () => {
        localStorage.removeItem('crowdscore_user');
        return { success: true };
    },
    saveScorecardLocalStorage: (scorecardData) => {
        const myScorecards = JSON.parse(localStorage.getItem('myScorecards') || '[]');
        myScorecards.push(scorecardData);
        localStorage.setItem('myScorecards', JSON.stringify(myScorecards));
        return { success: true, data: scorecardData };
    },
    getMyScorecardsLocalStorage: () => {
        const localScorecards = JSON.parse(localStorage.getItem('myScorecards') || '[]');
        return { success: true, data: localScorecards };
    }
};

// Log connection status on load
console.log('🔗 Supabase Integration loaded:', getConnectionStatus());