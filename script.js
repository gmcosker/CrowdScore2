// VERSION 67 - SUPABASE INTEGRATION - Gradual Migration
// This version adds Supabase with localStorage fallback
// Created: October 14, 2025 - SUPABASE INTEGRATION

// Script loaded successfully

// FOR TESTING: Clear localStorage on each page load to test full flow
// Remove this line when you want to keep users logged in
localStorage.removeItem('crowdscore_user');
localStorage.removeItem('crowdscore_users');
console.log('🧹 Cleared localStorage for testing - you will need to log in');

// User authentication state
let currentUser = null;
let isLoggedIn = false;

// Supabase integration status
let supabaseStatus = null;

// Scorecard origin tracking
let scorecardOrigin = 'manual'; // 'manual' or 'live-event'
let preFilledFighter1Name = '';
let preFilledFighter2Name = '';
let currentFightRounds = 12; // Default to 12 rounds, will be updated from fight data

// Initialize Supabase integration
function initializeSupabase() {
  try {
    // Check if Supabase integration is available
    if (typeof getConnectionStatus === 'function') {
      supabaseStatus = getConnectionStatus();
      console.log('🔗 Supabase Status:', supabaseStatus);
      
      if (supabaseStatus.connected) {
        console.log('✅ Using Supabase for data storage');
      } else {
        console.log('📱 Using localStorage fallback');
      }
    } else {
      console.log('📱 Supabase integration not loaded, using localStorage');
      supabaseStatus = { connected: false, method: 'localStorage' };
    }
  } catch (error) {
    console.warn('⚠️ Supabase initialization failed:', error);
    supabaseStatus = { connected: false, method: 'localStorage' };
  }
}

function checkLoginStatus() {
  // Initialize Supabase first
  initializeSupabase();
  
  // Check if user is already logged in
  const savedUser = localStorage.getItem('crowdscore_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    isLoggedIn = true;
    showHomeScreen();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  const elements = [
    'login-overlay', 'main-app', 'home-screen', 'upcoming-fights-screen',
    'live-events-screen', 'scorecard-screen', 'my-scorecards-screen',
    'round-screen', 'final-score-screen', 'share-screen', 'admin-screen',
    'round-selection-screen', 'scorecard-details-screen', 'profile-screen'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      if (id === 'login-overlay') {
        element.style.display = 'flex';
      } else {
        element.style.display = 'none';
      }
    }
  });
}

function showMainApp() {
  console.log('showMainApp() called - switching to scoring interface');
  const loginOverlay = document.getElementById('login-overlay');
  const homeScreen = document.getElementById('home-screen');
  const upcomingFightsScreen = document.getElementById('upcoming-fights-screen');
  const mainApp = document.getElementById('main-app');
  
  console.log('Elements found:', {
    loginOverlay: !!loginOverlay,
    homeScreen: !!homeScreen,
    upcomingFightsScreen: !!upcomingFightsScreen,
    mainApp: !!mainApp
  });
  
  if (loginOverlay) loginOverlay.style.display = 'none';
  if (homeScreen) homeScreen.style.display = 'none';
  if (upcomingFightsScreen) upcomingFightsScreen.style.display = 'none';
  if (mainApp) {
    mainApp.style.display = 'block';
    mainApp.style.visibility = 'visible';
    mainApp.style.opacity = '1';
    mainApp.style.position = 'relative';
    mainApp.style.zIndex = '9999';
    console.log('Main app display set to block');
    console.log('Main app computed styles:', {
      display: window.getComputedStyle(mainApp).display,
      visibility: window.getComputedStyle(mainApp).visibility,
      opacity: window.getComputedStyle(mainApp).opacity,
      position: window.getComputedStyle(mainApp).position
    });
  }
  
  initializeMainApp();
  console.log('Main app should now be visible');
  
  // Test if main-app is actually visible
  setTimeout(() => {
    const mainAppElement = document.getElementById('main-app');
    if (mainAppElement) {
      const rect = mainAppElement.getBoundingClientRect();
      console.log('Main app bounding rect:', {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0
      });
    }
  }, 100);
}

function showHomeScreen() {
  console.log('🏠 showHomeScreen() called');
  console.log('🏠 Hiding all screens...');
  
  // Hide all screens with null checks
  const elements = [
    'login-overlay', 'main-app', 'upcoming-fights-screen', 
    'live-events-screen', 'my-scorecards-screen', 
    'scorecard-details-screen', 'profile-screen', 'round-selection-screen'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    } else {
      console.warn(`⚠️ Element not found: ${id}`);
    }
  });
  
  console.log('🏠 Showing home screen...');
  const homeScreen = document.getElementById('home-screen');
  if (homeScreen) {
    homeScreen.style.display = 'flex';
    homeScreen.style.visibility = 'visible';
    homeScreen.style.opacity = '1';
    homeScreen.style.zIndex = '1000'; // Reset z-index
    console.log('✅ Home screen displayed');
  } else {
    console.error('❌ Home screen not found!');
  }
  
  // Ensure event listeners are attached when home screen is shown
  console.log('🏠 Setting up home screen listeners...');
  setupHomeScreenListeners();
  console.log('🏠 Home screen setup complete');
}

function showRoundSelectionScreen() {
  console.log('🥊 showRoundSelectionScreen() called');
  console.log('🥊 Hiding all screens...');
  
  // Hide all screens with null checks
  const elements = [
    'login-overlay', 'main-app', 'home-screen', 'upcoming-fights-screen', 
    'live-events-screen', 'my-scorecards-screen', 
    'scorecard-details-screen', 'profile-screen', 'round-selection-screen'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    } else {
      console.warn(`⚠️ Element not found: ${id}`);
    }
  });
  
  console.log('🥊 Showing round selection screen...');
  const roundSelectionScreen = document.getElementById('round-selection-screen');
  if (roundSelectionScreen) {
    roundSelectionScreen.style.display = 'flex';
    roundSelectionScreen.style.visibility = 'visible';
    roundSelectionScreen.style.opacity = '1';
    roundSelectionScreen.style.zIndex = '1000';
    console.log('✅ Round selection screen displayed');
  } else {
    console.error('❌ Round selection screen not found!');
  }
  
  // Setup event listeners for round selection
  setupRoundSelectionListeners();
  console.log('🥊 Round selection screen setup complete');
}

function setupRoundSelectionListeners() {
  // Back to home button
  const backButton = document.getElementById('back-to-home-from-rounds');
  if (backButton) {
    backButton.removeEventListener('click', showHomeScreen);
    backButton.addEventListener('click', showHomeScreen);
    console.log('✅ Back to home button listener attached');
  } else {
    console.warn('⚠️ Back to home button not found');
  }
  
  // Round option buttons
  const roundOptions = document.querySelectorAll('.round-option');
  roundOptions.forEach(option => {
    option.removeEventListener('click', handleRoundSelection);
    option.addEventListener('click', handleRoundSelection);
  });
  console.log(`✅ ${roundOptions.length} round option listeners attached`);
}

function handleRoundSelection(event) {
  const selectedRounds = parseInt(event.target.getAttribute('data-rounds'));
  console.log('🥊 Round selected:', selectedRounds);
  
  // Set the selected rounds
  currentFightRounds = selectedRounds;
  
  // Set origin to manual (not from a live event)
  scorecardOrigin = 'manual';
  preFilledFighter1Name = '';
  preFilledFighter2Name = '';
  
  // Launch the scorecard with the selected rounds
  launchScorecardWithFighters('', '', selectedRounds);
}

function setupAuthListeners() {
  // Simple, working event listeners
  document.getElementById('login-button').addEventListener('click', handleLogin);
  document.getElementById('signup-button').addEventListener('click', handleSignup);
  
  // Sign Up / Sign In toggle links
  document.getElementById('show-signup').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
  });

  document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
  });

  // Back to home button
  const backButton = document.getElementById('back-to-home');
  if (backButton) {
    backButton.addEventListener('click', function() {
      showHomeScreen();
    });
  }
  
  // Back to home button from upcoming fights
  const backFromFightsButton = document.getElementById('back-to-home-from-fights');
  if (backFromFightsButton) {
    backFromFightsButton.addEventListener('click', function() {
      showHomeScreen();
    });
  }
  
  // Back to home button from live events
  const backFromLiveButton = document.getElementById('back-to-home-from-live');
  if (backFromLiveButton) {
    backFromLiveButton.addEventListener('click', function() {
      showHomeScreen();
    });
  }

  // Add Enter key support for all input fields
  ['login-email', 'login-password', 'signup-name', 'signup-email', 'signup-password', 'signup-confirm']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            if (id.startsWith('login')) {
              handleLogin();
            } else {
              handleSignup();
            }
          }
        });
      }
    });
}

function setupHomeScreenListeners() {
  // Home screen navigation - attach when home screen is shown
  const scoreButton = document.getElementById('score-my-own-fight');
  const upcomingFightsButton = document.getElementById('upcoming-fights');
  const liveEventsButton = document.getElementById('live-events');
  console.log('Setting up home screen listeners...');
  console.log('Score button found:', !!scoreButton);
  console.log('Upcoming fights button found:', !!upcomingFightsButton);
  console.log('Live events button found:', !!liveEventsButton);
  console.log('Live events button element:', liveEventsButton);
  
  // Setup menu dropdown
  setupMenuDropdown();
  
  if (scoreButton) {
    // Remove any existing listeners to avoid duplicates
    scoreButton.removeEventListener('click', handleScoreMyOwnFight);
    scoreButton.addEventListener('click', handleScoreMyOwnFight);
    console.log('Score button listener attached');
  } else {
    console.error('Score button not found!');
  }
  
  if (upcomingFightsButton) {
    upcomingFightsButton.removeEventListener('click', handleUpcomingFights);
    upcomingFightsButton.addEventListener('click', handleUpcomingFights);
    console.log('Upcoming fights button listener attached');
  } else {
    console.error('Upcoming fights button not found!');
  }
  
  if (liveEventsButton) {
    liveEventsButton.removeEventListener('click', handleLiveEvents);
    liveEventsButton.addEventListener('click', handleLiveEvents);
    console.log('Live events button listener attached');
  } else {
    console.error('Live events button not found!');
  }
}

// Setup menu dropdown functionality
function setupMenuDropdown() {
  console.log('🍔 Setting up menu dropdown...');
  
  const menuButton = document.getElementById('menu-button');
  const menuDropdown = document.getElementById('menu-dropdown');
  const myScorecardsMenu = document.getElementById('my-scorecards-menu');
  const profileMenu = document.getElementById('profile-menu');
  const signoutMenu = document.getElementById('signout-menu');
  
  if (!menuButton || !menuDropdown) {
    console.log('❌ Menu elements not found - skipping dropdown setup');
    return;
  }
  
  console.log('✅ Menu elements found, setting up listeners');
  
  // Remove any existing listeners first
  menuButton.removeEventListener('click', handleMenuToggle);
  document.removeEventListener('click', handleMenuClose);
  menuDropdown.removeEventListener('click', handleMenuStopPropagation);
  
  if (myScorecardsMenu) {
    myScorecardsMenu.removeEventListener('click', handleMyScorecardsClick);
  }
  if (profileMenu) {
    profileMenu.removeEventListener('click', handleProfileClick);
  }
  if (signoutMenu) {
    signoutMenu.removeEventListener('click', handleSignOutClick);
  }
  
  // Toggle dropdown on button click
  menuButton.addEventListener('click', handleMenuToggle);
  
  // Close dropdown when clicking outside
  document.addEventListener('click', handleMenuClose);
  
  // Prevent dropdown from closing when clicking inside it
  menuDropdown.addEventListener('click', handleMenuStopPropagation);
  
  // Menu item click handlers
  if (myScorecardsMenu) {
    myScorecardsMenu.addEventListener('click', handleMyScorecardsClick);
  }
  
  if (profileMenu) {
    profileMenu.addEventListener('click', handleProfileClick);
  }
  
  if (signoutMenu) {
    signoutMenu.addEventListener('click', handleSignOutClick);
  }
  
  console.log('✅ Menu dropdown setup complete');
}

// Separate handler functions for better cleanup
function handleMenuToggle(e) {
  e.stopPropagation();
  const menuDropdown = document.getElementById('menu-dropdown');
  const isVisible = menuDropdown.style.display === 'block';
  menuDropdown.style.display = isVisible ? 'none' : 'block';
  console.log('🍔 Menu toggled:', !isVisible ? 'opened' : 'closed');
}

function handleMenuClose() {
  const menuDropdown = document.getElementById('menu-dropdown');
  menuDropdown.style.display = 'none';
}

function handleMenuStopPropagation(e) {
  e.stopPropagation();
}

function handleMyScorecardsClick() {
  console.log('📋 My Scorecards clicked');
  const menuDropdown = document.getElementById('menu-dropdown');
  menuDropdown.style.display = 'none';
  showMyScorecardsScreen();
}

function handleProfileClick() {
  console.log('👤 Profile clicked');
  const menuDropdown = document.getElementById('menu-dropdown');
  menuDropdown.style.display = 'none';
  showProfileScreen();
}

function handleSignOutClick() {
  console.log('🚪 Sign Out clicked');
  const menuDropdown = document.getElementById('menu-dropdown');
  menuDropdown.style.display = 'none';
  handleSignOut();
}

// Show My Scorecards Screen
function showMyScorecardsScreen() {
  console.log('📋 Showing My Scorecards screen');
  
  // Hide all other screens
  const elements = [
    'login-overlay', 'main-app', 'home-screen', 'upcoming-fights-screen',
    'live-events-screen', 'scorecard-screen', 'round-screen', 
    'final-score-screen', 'share-screen', 'admin-screen', 'profile-screen',
    'scorecard-details-screen'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Show my scorecards screen
  const myScorecardsScreen = document.getElementById('my-scorecards-screen');
  if (myScorecardsScreen) {
    myScorecardsScreen.style.display = 'flex';
    console.log('✅ My Scorecards screen displayed');
  } else {
    console.error('❌ My Scorecards screen not found!');
  }
  
  // Load and display user's scorecards
  loadUserScorecards();
  
  // Setup back button
  const backButton = document.getElementById('back-to-home-from-scorecards');
  if (backButton) {
    backButton.removeEventListener('click', showHomeScreen);
    backButton.addEventListener('click', showHomeScreen);
  }
}

// Load user's scorecards from database
async function loadUserScorecards() {
  console.log('📋 Loading user scorecards...');
  
  const scorecardsList = document.getElementById('scorecards-list');
  if (!scorecardsList) {
    console.error('Scorecards list element not found');
    return;
  }
  
  // Show loading state
  scorecardsList.innerHTML = '<div class="loading-message">Loading your scorecards...</div>';
  
  try {
    let scorecards = [];
    
    // Try Supabase first
    if (supabaseStatus && supabaseStatus.connected) {
      console.log('📋 Fetching scorecards from Supabase...');
      const result = await window.supabaseIntegration.getMyScorecards();
      
      if (result.success) {
        scorecards = result.data || [];
        console.log('📋 Loaded', scorecards.length, 'scorecards from Supabase');
      } else {
        console.error('📋 Supabase fetch failed:', result.error);
        // Fallback to localStorage
        scorecards = getScorecardsFromLocalStorage();
      }
    } else {
      console.log('📋 Using localStorage fallback');
      scorecards = getScorecardsFromLocalStorage();
    }
    
    // Display scorecards
    displayScorecards(scorecards);
    
  } catch (error) {
    console.error('📋 Error loading scorecards:', error);
    scorecardsList.innerHTML = '<div class="empty-scorecards"><div class="empty-scorecards-icon">❌</div><div class="empty-scorecards-title">Error Loading Scorecards</div><div class="empty-scorecards-text">There was a problem loading your scorecards. Please try again.</div></div>';
  }
}

// Get scorecards from localStorage (fallback)
function getScorecardsFromLocalStorage() {
  const savedScorecards = localStorage.getItem('crowdscore_scorecards');
  if (savedScorecards) {
    return JSON.parse(savedScorecards);
  }
  return [];
}

// Display scorecards in the UI
function displayScorecards(scorecards) {
  const scorecardsList = document.getElementById('scorecards-list');
  if (!scorecardsList) return;
  
  if (scorecards.length === 0) {
    scorecardsList.innerHTML = `
      <div class="empty-scorecards">
        <div class="empty-scorecards-icon">📋</div>
        <div class="empty-scorecards-title">No Scorecards Yet</div>
        <div class="empty-scorecards-text">You haven't scored any fights yet. Start scoring to see your history here!</div>
      </div>
    `;
    return;
  }
  
  // Sort scorecards by date (newest first)
  scorecards.sort((a, b) => new Date(b.fight_date) - new Date(a.fight_date));
  
  // Generate HTML for each scorecard
  const scorecardsHTML = scorecards.map((scorecard, index) => {
    const fightDate = new Date(scorecard.fight_date).toLocaleDateString();
    const fighter1Total = scorecard.fighter1_scores.reduce((sum, score) => sum + score, 0);
    const fighter2Total = scorecard.fighter2_scores.reduce((sum, score) => sum + score, 0);
    
    return `
      <div class="scorecard-item" data-scorecard-index="${index}">
        <div class="scorecard-item-header">
          <h3 class="scorecard-fight-title">${scorecard.fighter1_name} vs ${scorecard.fighter2_name}</h3>
          <span class="scorecard-date">${fightDate}</span>
        </div>
        
        <div class="scorecard-fighters">
          <div class="scorecard-fighter">
            <div class="scorecard-fighter-name">${scorecard.fighter1_name}</div>
            <div class="scorecard-fighter-score">${fighter1Total}</div>
          </div>
          <div class="scorecard-vs">VS</div>
          <div class="scorecard-fighter">
            <div class="scorecard-fighter-name">${scorecard.fighter2_name}</div>
            <div class="scorecard-fighter-score">${fighter2Total}</div>
          </div>
        </div>
        
        <div class="scorecard-summary">
          <span class="scorecard-origin">${scorecard.fight_origin === 'live-event' ? 'Live Event' : 'Manual Entry'}</span>
          <button class="scorecard-view-btn" onclick="viewScorecardDetails(${index})">View Details</button>
        </div>
      </div>
    `;
  }).join('');
  
  scorecardsList.innerHTML = scorecardsHTML;
}

// View individual scorecard details
function viewScorecardDetails(index) {
  console.log('📋 Viewing scorecard details for index:', index);
  
  // Get scorecards data
  let scorecards = [];
  if (supabaseStatus && supabaseStatus.connected) {
    // We'd need to fetch again or store in memory
    scorecards = getScorecardsFromLocalStorage(); // Fallback for now
  } else {
    scorecards = getScorecardsFromLocalStorage();
  }
  
  if (index >= 0 && index < scorecards.length) {
    const scorecard = scorecards[index];
    showScorecardDetailsScreen(scorecard);
  }
}

// Show scorecard details screen
function showScorecardDetailsScreen(scorecard) {
  console.log('📋 Showing scorecard details screen');
  
  // Hide all other screens
  const elements = [
    'login-overlay', 'main-app', 'home-screen', 'upcoming-fights-screen',
    'live-events-screen', 'scorecard-screen', 'round-screen', 
    'final-score-screen', 'share-screen', 'admin-screen', 'my-scorecards-screen'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Show scorecard details screen
  const detailsScreen = document.getElementById('scorecard-details-screen');
  if (detailsScreen) {
    detailsScreen.style.display = 'flex';
  }
  
  // Populate the details content
  populateScorecardDetails(scorecard);
  
  // Setup back button
  const backButton = document.getElementById('back-to-scorecards');
  if (backButton) {
    console.log('✅ Back to scorecards button found, setting up click handler');
    backButton.removeEventListener('click', handleBackToScorecards);
    backButton.addEventListener('click', handleBackToScorecards);
    
    // Also add onclick as backup
    backButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📋 Back to My Scorecards clicked (onclick)');
      showMyScorecardsScreen();
    };
  } else {
    console.error('❌ Back to scorecards button not found!');
  }
}

// Populate scorecard details content
function populateScorecardDetails(scorecard) {
  const content = document.getElementById('scorecard-details-content');
  if (!content) return;
  
  const fighter1Total = scorecard.fighter1_scores.reduce((sum, score) => sum + score, 0);
  const fighter2Total = scorecard.fighter2_scores.reduce((sum, score) => sum + score, 0);
  
  // Determine winner
  const fighter1Won = fighter1Total > fighter2Total;
  const fighter2Won = fighter2Total > fighter1Total;
  
  // Count actual rounds (non-zero scores)
  const actualRounds = Math.max(
    scorecard.fighter1_scores.filter(score => score > 0).length,
    scorecard.fighter2_scores.filter(score => score > 0).length
  );
  
  // Generate round-by-round HTML
  const roundsHTML = scorecard.fighter1_scores.slice(0, actualRounds).map((score, i) => `
    <div class="details-fighter-score-btn blue">${score}</div>
    <div class="details-round-number">${i + 1}</div>
    <div class="details-fighter-score-btn red">${scorecard.fighter2_scores[i]}</div>
  `).join('');
  
  content.innerHTML = `
    <div class="details-fight-title">${scorecard.fighter1_name} vs ${scorecard.fighter2_name}</div>
    
    <div class="details-summary">
      <div class="details-fighter-panel">
        <div class="details-fighter-name">${scorecard.fighter1_name}</div>
        <div class="details-fighter-result ${fighter1Won ? 'winner' : 'loser'}">
          ${fighter1Won ? 'WON' : 'LOST'}
        </div>
        <div class="details-fighter-score">${fighter1Total}</div>
      </div>
      
      <div class="details-fighter-panel">
        <div class="details-fighter-name">${scorecard.fighter2_name}</div>
        <div class="details-fighter-result ${fighter2Won ? 'winner' : 'loser'}">
          ${fighter2Won ? 'WON' : 'LOST'}
        </div>
        <div class="details-fighter-score">${fighter2Total}</div>
      </div>
    </div>
    
    <div class="details-rounds-section">
      <div class="details-rounds-title">Round-by-Round Scores</div>
      <div class="details-rounds-grid">
        <div class="details-rounds-header">${scorecard.fighter1_name}</div>
        <div class="details-rounds-header">Round</div>
        <div class="details-rounds-header">${scorecard.fighter2_name}</div>
        ${roundsHTML}
      </div>
    </div>
    
    <div class="details-total-section">
      <div class="details-total-title">Final Score</div>
      <div class="details-total-scores">
        <div class="details-total-fighter">
          <div class="details-total-fighter-name">${scorecard.fighter1_name}</div>
          <div class="details-total-fighter-score">${fighter1Total}</div>
        </div>
        <div class="details-total-vs">VS</div>
        <div class="details-total-fighter">
          <div class="details-total-fighter-name">${scorecard.fighter2_name}</div>
          <div class="details-total-fighter-score">${fighter2Total}</div>
        </div>
      </div>
      <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
        ROUND ${actualRounds} OF ${actualRounds}
      </div>
    </div>
  `;
}

// Show Profile Screen
function showProfileScreen() {
  console.log('👤 Showing Profile screen');
  
  // Hide all other screens
  const elements = [
    'login-overlay', 'main-app', 'home-screen', 'upcoming-fights-screen',
    'live-events-screen', 'scorecard-screen', 'round-screen', 
    'final-score-screen', 'share-screen', 'admin-screen', 'my-scorecards-screen',
    'scorecard-details-screen'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Show profile screen
  const profileScreen = document.getElementById('profile-screen');
  if (profileScreen) {
    profileScreen.style.display = 'flex';
    console.log('✅ Profile screen displayed');
  } else {
    console.error('❌ Profile screen not found!');
  }
  
  // Populate profile content
  populateProfileContent();
  
  // Setup back button with a small delay to ensure DOM is ready
  setTimeout(() => {
    const backButton = document.getElementById('back-to-home-from-profile');
    if (backButton) {
      console.log('✅ Back button found, setting up click handler');
      
      // Remove any existing listeners
      backButton.removeEventListener('click', handleBackToHome);
      backButton.onclick = null;
      
      // Add new listener
      backButton.addEventListener('click', handleBackToHome);
      
      // Test if button is clickable
      console.log('🔍 Button element:', backButton);
      console.log('🔍 Button style:', backButton.style);
      console.log('🔍 Button disabled:', backButton.disabled);
    } else {
      console.error('❌ Back button not found!');
    }
  }, 100);
}

// Separate function for back button handler
function handleBackToHome(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log('🏠 Back to Home clicked from profile');
  console.log('🏠 Calling showHomeScreen...');
  showHomeScreen();
}

// Populate profile content
async function populateProfileContent() {
  console.log('👤 Populating profile content...');
  
  const content = document.getElementById('profile-content');
  if (!content) {
    console.error('❌ Profile content element not found!');
    return;
  }
  
  // Get user data from multiple sources
  let userEmail = 'Not found';
  let joinDate = 'Recently';
  
  // Try to get from Supabase first if connected
  if (supabaseStatus && supabaseStatus.connected && currentUser) {
    try {
      console.log('👤 Fetching profile from Supabase...');
      const { data: profile, error } = await window.supabaseIntegration.supabaseClient
        .from('profiles')
        .select('email, created_at')
        .eq('id', currentUser.id)
        .single();
      
      if (profile && !error) {
        userEmail = profile.email || currentUser.email || 'Not found';
        joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently';
        console.log('👤 Found profile from Supabase:', userEmail, joinDate);
      } else {
        console.warn('⚠️ Profile not found in Supabase, using currentUser data');
        userEmail = currentUser.email || 'Not found';
        joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Recently';
      }
    } catch (error) {
      console.warn('⚠️ Error fetching profile from Supabase:', error);
      userEmail = currentUser.email || 'Not found';
      joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Recently';
    }
  } else if (currentUser && currentUser.email) {
    // Fallback to currentUser
    userEmail = currentUser.email;
    joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Recently';
    console.log('👤 Found email from currentUser:', userEmail);
  } else {
    // Try to get from localStorage
    const savedUser = localStorage.getItem('crowdscore_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        userEmail = userData.email || 'Not found';
        joinDate = userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Recently';
        console.log('👤 Found data from localStorage:', userEmail, joinDate);
      } catch (e) {
        console.error('❌ Error parsing saved user:', e);
      }
    }
  }
  
  console.log('👤 Final profile data:', {
    email: userEmail,
    joinDate: joinDate
  });
  
  // Simple, direct content
  content.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <div style="margin-bottom: 20px;">
        <div style="font-weight: bold; color: #1e3a8a; margin-bottom: 5px;">Email Address</div>
        <div style="color: #1e40af; font-size: 18px;">${userEmail}</div>
      </div>
      <div>
        <div style="font-weight: bold; color: #1e3a8a; margin-bottom: 5px;">Date Joined</div>
        <div style="color: #1e40af; font-size: 18px;">${joinDate}</div>
      </div>
    </div>
  `;
  
  console.log('✅ Profile content populated with simple layout');
}

// Handle back to scorecards button
function handleBackToScorecards(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log('📋 Back to My Scorecards clicked from details');
  showMyScorecardsScreen();
}

// Profile action functions (placeholder for future features)

// Handle user sign out
function handleSignOut() {
  console.log('🚪 Signing out user...');
  
  try {
    // Clear user data from localStorage
    localStorage.removeItem('crowdscore_user');
    localStorage.removeItem('crowdscore_users');
    
    // Reset global variables
    currentUser = null;
    isLoggedIn = false;
    
    // Try Supabase sign out if connected
    if (supabaseStatus && supabaseStatus.connected) {
      console.log('🚪 Signing out from Supabase...');
      window.supabaseIntegration.signOutUser()
        .then(() => {
          console.log('✅ Supabase sign out successful');
        })
        .catch((error) => {
          console.warn('⚠️ Supabase sign out failed:', error);
        })
        .finally(() => {
          // Always show login screen regardless of Supabase result
          showLoginScreen();
        });
    } else {
      // Just show login screen if not using Supabase
      showLoginScreen();
    }
    
    console.log('✅ User signed out successfully');
    
  } catch (error) {
    console.error('❌ Sign out error:', error);
    // Still show login screen even if there's an error
    showLoginScreen();
  }
}

// Save scorecard to localStorage (fallback)
function saveScorecardToLocalStorage(scorecardData) {
  try {
    console.log('💾 Saving scorecard to localStorage...');
    
    // Get existing scorecards
    const existingScorecards = JSON.parse(localStorage.getItem('crowdscore_scorecards') || '[]');
    
    // Add new scorecard
    existingScorecards.push(scorecardData);
    
    // Save back to localStorage
    localStorage.setItem('crowdscore_scorecards', JSON.stringify(existingScorecards));
    
    console.log('✅ Scorecard saved to localStorage successfully!');
    showSuccess('Scorecard saved successfully!');
  } catch (error) {
    console.error('❌ localStorage save failed:', error);
    showError('Failed to save scorecard. Please try again.');
  }
}

function handleScoreMyOwnFight() {
  console.log('Score My Own Fight clicked!'); // Debug log
  
  // Show the round selection screen instead of going directly to main app
  showRoundSelectionScreen();
}

function handleUpcomingFights() {
  console.log('Upcoming Fights clicked!'); // Debug log
  showUpcomingFightsScreen();
}

function handleLiveEvents() {
  console.log('🔥🔥🔥 Live Events clicked! 🔥🔥🔥');
  console.log('About to show live events screen...');
  showLiveEventsScreen();
  console.log('Live events screen function called!');
}

function showUpcomingFightsScreen() {
  console.log('Showing upcoming fights screen...');
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('upcoming-fights-screen').style.display = 'flex';
  document.getElementById('live-events-screen').style.display = 'none';
  
  // Load and display upcoming fight data
  loadUpcomingFights();
  console.log('Upcoming fights screen setup complete');
}

function showLiveEventsScreen() {
  console.log('🚀🚀🚀 Showing live events screen... 🚀🚀🚀');
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('upcoming-fights-screen').style.display = 'none';
  document.getElementById('live-events-screen').style.display = 'flex';
  console.log('✅ Live events screen should now be visible!');
  
  // Load and display live event data
  loadLiveEvents();
  console.log('Live events screen setup complete');
}

// ESPN Web Scraper Functions with Caching - Updated v58
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds (daily refresh)
const CACHE_KEY = 'crowdscore_espn_data';

async function fetchESPNBoxingSchedule() {
  try {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      console.log('Using cached ESPN data');
      return cachedData;
    }
    
    console.log('Fetching fresh ESPN boxing schedule...');
    
    // Focus on web scraping ESPN boxing schedule page
    const espnUrl = 'https://www.espn.com/boxing/story/_/id/12508267/boxing-schedule';
    
    // Try multiple CORS proxies for better reliability (mobile-friendly)
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    console.log('Scraping ESPN boxing schedule page...');
    
    for (let i = 0; i < proxies.length; i++) {
      try {
        const proxyUrl = proxies[i];
        console.log(`Trying proxy ${i + 1}/${proxies.length}: ${proxyUrl}`);
        
        // Use mobile-friendly user agent for mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const userAgent = isMobile 
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
          : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
        
        console.log(`🔧 Mobile detected: ${isMobile}, using User-Agent: ${userAgent}`);
        
        const response = await fetch(proxyUrl + encodeURIComponent(espnUrl), {
          headers: {
            'User-Agent': userAgent
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          console.log('🔧 DEBUGGING: Got HTML response, length:', html.length);
          const parsedData = parseESPNBoxingData(html);
          console.log('🔧 DEBUGGING: Parsed data:', parsedData);
          
          if (parsedData && parsedData.length > 0) {
            // Cache the successful result
            cacheData(parsedData);
            console.log('✅ ESPN data fetched and cached successfully, found', parsedData.length, 'fights');
            return parsedData;
          } else {
            console.log('❌ No fights found in parsed data');
          }
        } else {
          console.log('❌ Response not OK:', response.status);
        }
      } catch (proxyError) {
        console.warn(`Proxy ${i + 1} failed:`, proxyError.message);
        continue;
      }
    }
    
    throw new Error('All proxies failed');
    
  } catch (error) {
    console.error('Error fetching ESPN data:', error);
    return null;
  }
}

function getCachedData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (within 24 hours)
    if (now - timestamp < CACHE_DURATION) {
      return data;
    } else {
      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  } catch (error) {
    console.warn('Error reading cache:', error);
    return null;
  }
}

function cacheData(data) {
  try {
    const cacheData = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('Data cached successfully');
  } catch (error) {
    console.warn('Error caching data:', error);
  }
}

function parseESPNBoxingData(html) {
  try {
    console.log('🔍 DATA STRUCTURE ANALYSIS: Starting parseESPNBoxingData');
    console.log('🔍 HTML length:', html.length);
    console.log('🔍 HTML preview (first 500 chars):', html.substring(0, 500));
    
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Look for fight data in various possible locations
    const fightElements = doc.querySelectorAll('[data-module="ScoreCard"], .ScoreCell, .Table__TR, .Table__Row, .Scoreboard, .Event, .Table, .Schedule, .Matchup');
    
    console.log('🔍 Found', fightElements.length, 'potential fight elements');
    console.log('🔍 Fight elements details:', Array.from(fightElements).map(el => ({
      tagName: el.tagName,
      className: el.className,
      textContent: el.textContent?.substring(0, 100),
      innerHTML: el.innerHTML?.substring(0, 200)
    })));
    
    // Look for JSON data embedded in the page
    const scripts = doc.querySelectorAll('script');
    let jsonData = null;
    
    console.log('🔍 Found', scripts.length, 'script tags');
    
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const content = script.textContent;
      
      if (content.includes('boxing') || content.includes('schedule') || content.includes('events') || content.includes('fights')) {
        console.log(`🔍 Script ${i} contains boxing/schedule/events/fights keywords`);
        console.log(`🔍 Script ${i} content preview:`, content.substring(0, 300));
        try {
          // Try to extract JSON objects with various patterns
          const jsonPatterns = [
            /\{.*"events".*\}/s,
            /\{.*"schedule".*\}/s,
            /\{.*"fights".*\}/s,
            /window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/s,
            /window\.__APOLLO_STATE__\s*=\s*(\{.*?\});/s
          ];
          
          for (let pattern of jsonPatterns) {
            const jsonMatch = content.match(pattern);
            if (jsonMatch) {
              try {
                jsonData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
                console.log('🔍 Successfully parsed JSON data from script', i);
                console.log('🔍 JSON data type:', typeof jsonData);
                console.log('🔍 JSON data keys:', Object.keys(jsonData || {}));
                console.log('🔍 JSON data structure:', jsonData);
                break;
              } catch (e) {
                console.log('Failed to parse JSON from script');
              }
            }
          }
          if (jsonData) break;
        } catch (e) {
          console.log('Failed to parse JSON from script');
        }
      }
    }
    
    // Look for specific fight information in the HTML
    const fightText = doc.body.textContent.toLowerCase();
    const hasFightData = fightText.includes('vs') || fightText.includes('fight') || fightText.includes('boxing') || fightText.includes('schedule');
    
    console.log('HTML contains fight-related text:', hasFightData);
    console.log('Found JSON data:', !!jsonData);
    
    // Try to extract fight data from the page content
    const fights = extractFightsFromHTML(doc);
    
    if (fights.length > 0) {
      console.log(`Successfully extracted ${fights.length} fights from HTML`);
      return fights;
    }
    
    // If we found actual fight data, try to parse it
    if (jsonData && (jsonData.events || jsonData.schedule || jsonData.fights)) {
      console.log('Attempting to parse ESPN events data...');
      return parseESPNEvents(jsonData);
    }
    
    // If we found fight elements, try to parse them
    if (fightElements.length > 0) {
      console.log('Attempting to parse fight elements...');
      return parseFightElements(fightElements);
    }
    
    // If we found fight-related text but no structured data, the page might be loading dynamically
    if (hasFightData) {
      console.log('Found fight-related content but no structured data - likely loaded dynamically');
    }
    
    console.log('🔧 DEBUGGING: No parseable fight data found, using mock data');
    console.log('🔧 DEBUGGING: Fights found from HTML:', fights);
    return fights.length > 0 ? fights : getEnhancedMockData();
    
  } catch (error) {
    console.error('Error parsing ESPN data:', error);
    return null;
  }
}

function extractFightsFromHTML(doc) {
  const fights = [];
  
  try {
    // Look for fight data in the ESPN schedule structure
    const text = doc.body.textContent;
    console.log('🔍 DATA STRUCTURE ANALYSIS: extractFightsFromHTML starting');
    console.log('🔍 Document body text length:', text.length);
    
    // FIXED: Look for "Full schedule:" (lowercase s) as shown in the screenshot
    const fullScheduleIndex = text.indexOf('Full schedule:');
    if (fullScheduleIndex === -1) {
      console.log('🔍 Could not find "Full schedule:" marker, using full text');
      var scheduleText = text;
    } else {
      scheduleText = text.substring(fullScheduleIndex);
      console.log('🔍 Found "Full schedule:" at index', fullScheduleIndex);
      console.log('🔍 Using', scheduleText.length, 'characters after "Full schedule:"');
      console.log('🔍 Schedule text preview (first 1000 chars):', scheduleText.substring(0, 1000));
    }
    
    // CONTINUOUS SCANNING APPROACH: Process text sequentially, updating date context as we go
    // FIXED: Ultra-flexible regex to catch ALL possible date formats
    // Handles: "Oct. 12: Hollywood, Florida (DAZN)", "Oct. 17: London (DAZN)", "Oct. 20: Las Vegas, NV", etc.
    const dateVenuePattern = /(Oct\.|Nov\.|Dec\.)\s+(\d+):\s+([^,()]+?)(?:\s*,\s*([A-Za-z\s,]+?))?\s*(?:\(([^)]+)\))?/g;
    const fightPattern = /([A-Za-z\s"']+)\s+vs\.?\s+([A-Za-z\s"']+),?\s*(\d+)\s+rounds?,\s*([^,\n]+)/g;
    
    let currentDate = '';
    let currentVenue = '';
    let currentCity = '';
    let currentNetwork = '';
    let fightIndex = 0;
    
    // FIXED: Process continuous text without splitting into lines (ESPN text has no line breaks)
    let remainingText = scheduleText;
    let match;
    
    // Use global regex to find all date blocks and fights in the continuous text
    const allMatches = [];
    
    // Find all date/venue blocks - CREATE FRESH REGEX TO AVOID STATE ISSUES
    // FIXED: Ultra-flexible regex to catch ALL possible date formats
    const dateRegex = new RegExp(/(Oct\.|Nov\.|Dec\.)\s+(\d+):\s+([^,()]+?)(?:\s*,\s*([A-Za-z\s,]+?))?\s*(?:\(([^)]+)\))?/g);
    while ((match = dateRegex.exec(remainingText)) !== null) {
      allMatches.push({
        type: 'date',
        match: match,
        index: match.index
      });
    }
    
    // Find all fights - FIXED REGEX TO PREVENT OVERLAP AND SKIPPING
    const fightRegex = new RegExp(/([A-Za-z\s"']+?)\s+vs\.?\s+([A-Za-z\s"']+?),?\s*(\d+)\s+rounds?,\s*([^,\n]+?)(?=\s*[A-Za-z]|\s*Oct\.|\s*Nov\.|\s*Dec\.|$)/g);
    while ((match = fightRegex.exec(remainingText)) !== null) {
      allMatches.push({
        type: 'fight',
        match: match,
        index: match.index
      });
    }
    
    // Sort all matches by their position in the text
    allMatches.sort((a, b) => a.index - b.index);
    
    // Process matches in order
    for (const item of allMatches) {
      if (fightIndex >= 30) break;
      
      if (item.type === 'date') {
        const match = item.match;
        const month = match[1];
        const day = match[2];
        // FIXED: Handle flexible date format - venue might be in group 3 or 4, city might be in group 4 or 5
        currentVenue = match[3] ? match[3].trim() : '';
        currentCity = match[4] ? match[4].trim() : '';
        currentNetwork = match[5] ? match[5].trim() : '';
        
        // Create proper date string for 2025
        const year = 2025;
        const monthNum = month === 'Oct.' ? '10' : month === 'Nov.' ? '11' : '12';
        currentDate = `${year}-${monthNum.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        console.log(`🔍 Found NEW date/venue info: ${month} ${day} - ${currentVenue}, ${currentCity} (${currentNetwork})`);
        console.log(`🔍 Updated date string: ${currentDate}`);
        
      } else if (item.type === 'fight' && currentDate) {
        const match = item.match;
        const fighter1 = match[1].trim();
        const fighter2 = match[2].trim();
        const rounds = match[3];
        const weightClass = match[4].trim();
        
        console.log(`🔍 Found fight: ${fighter1} vs ${fighter2}, ${rounds} rounds, ${weightClass}`);
        console.log(`🔍 Applying date: ${currentDate} (${currentVenue}, ${currentCity})`);
        
        const fight = {
          id: `espn_full_schedule_${fightIndex}`,
          fighter1: {
            name: fighter1,
            record: '0-0-0',
            weight: weightClass,
            nickname: ''
          },
          fighter2: {
            name: fighter2,
            record: '0-0-0',
            weight: weightClass,
            nickname: ''
          },
          event: {
            title: 'Boxing Match',
            date: currentDate,
            time: 'TBD',
            venue: currentVenue,
            city: currentCity
          },
          broadcast: {
            network: currentNetwork,
            channel: currentNetwork
          },
          status: 'upcoming',
          weightClass: weightClass,
          rounds: parseInt(rounds)
        };
        
        fights.push(fight);
        fightIndex++;
        console.log(`✅ Added: ${fighter1} vs ${fighter2} on ${currentDate}`);
      }
    }
    
    console.log(`Extracted ${fights.length} fights from Full schedule section`);
    
  } catch (error) {
    console.error('Error extracting fights from HTML:', error);
  }
  
  return fights;
}

function parseESPNEvents(events) {
  console.log('Parsing ESPN events:', events.length);
  // This would parse the actual ESPN events data
  // For now, return mock data since we need to understand ESPN's data structure
  return getEnhancedMockData();
}

function parseFightElements(elements) {
  console.log('Parsing fight elements:', elements.length);
  // This would parse the HTML elements
  // For now, return mock data
  return getEnhancedMockData();
}

function parseESPNAPI(apiData) {
  try {
    console.log('Parsing ESPN API data...');
    
    // Handle different ESPN API response structures
    let events = [];
    if (apiData.events && Array.isArray(apiData.events)) {
      events = apiData.events;
    } else if (apiData.schedule && Array.isArray(apiData.schedule)) {
      events = apiData.schedule;
    } else if (apiData.items && Array.isArray(apiData.items)) {
      events = apiData.items;
    }
    
    if (events.length === 0) {
      console.log('No events found in API data');
      return getEnhancedMockData();
    }
    
    const fights = [];
    
    events.forEach((event, index) => {
      try {
        // Extract fight information from ESPN API structure
        const competition = event.competitions?.[0];
        if (!competition) return;
        
        const competitors = competition.competitors || [];
        if (competitors.length < 2) return;
        
        const fighter1 = competitors[0];
        const fighter2 = competitors[1];
        
        const fight = {
          id: `espn_fight_${index}`,
          fighter1: {
            name: fighter1.team?.displayName || 'Unknown Fighter',
            record: fighter1.records?.[0]?.summary || '0-0-0',
            weight: 'N/A',
            nickname: fighter1.team?.abbreviation || ''
          },
          fighter2: {
            name: fighter2.team?.displayName || 'Unknown Fighter',
            record: fighter2.records?.[0]?.summary || '0-0-0',
            weight: 'N/A',
            nickname: fighter2.team?.abbreviation || ''
          },
          event: {
            title: event.name || 'Boxing Match',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            time: event.date ? new Date(event.date).toLocaleTimeString() : 'TBD',
            venue: event.venue?.fullName || 'TBD',
            city: event.venue?.address?.city || 'TBD'
          },
          broadcast: {
            network: 'ESPN',
            channel: 'ESPN'
          },
          status: event.status?.type?.name === 'STATUS_IN_PROGRESS' ? 'live' : 'upcoming',
          weightClass: 'Boxing',
          rounds: 12
        };
        
        fights.push(fight);
        
      } catch (eventError) {
        console.warn('Error parsing event:', eventError);
      }
    });
    
    console.log(`Successfully parsed ${fights.length} fights from ESPN API`);
    
    // If we got real data, return it; otherwise fall back to mock
    return fights.length > 0 ? fights : getEnhancedMockData();
    
  } catch (error) {
    console.error('Error parsing ESPN API data:', error);
    return getEnhancedMockData();
  }
}

function getEnhancedMockData() {
  // Enhanced mock data based on current 2025 boxing schedule
  return [
    {
      id: 'fight_1',
      fighter1: {
        name: 'Tyson Fury',
        record: '33-1-1',
        weight: '270 lbs',
        nickname: 'The Gypsy King'
      },
      fighter2: {
        name: 'Oleksandr Usyk',
        record: '21-0-0',
        weight: '220 lbs',
        nickname: 'The Cat'
      },
      event: {
        title: 'Undisputed Heavyweight Championship',
        date: '2025-01-15',
        time: '5:00 PM ET',
        venue: 'Kingdom Arena',
        city: 'Riyadh, Saudi Arabia'
      },
      broadcast: {
        network: 'ESPN+',
        channel: 'ESPN+ PPV'
      },
      status: 'upcoming',
      weightClass: 'Heavyweight',
      rounds: 12,
      belt: 'WBC, WBA, IBF, WBO'
    },
    {
      id: 'fight_2',
      fighter1: {
        name: 'Deontay Wilder',
        record: '43-2-1',
        weight: '238 lbs',
        nickname: 'The Bronze Bomber'
      },
      fighter2: {
        name: 'Anthony Joshua',
        record: '26-3-0',
        weight: '250 lbs',
        nickname: 'AJ'
      },
      event: {
        title: 'Heavyweight Showdown',
        date: '2025-01-20',
        time: '2:00 PM ET',
        venue: 'Wembley Stadium',
        city: 'London, England'
      },
      broadcast: {
        network: 'DAZN',
        channel: 'DAZN PPV'
      },
      status: 'upcoming',
      weightClass: 'Heavyweight',
      rounds: 12
    },
    {
      id: 'fight_3',
      fighter1: {
        name: 'Canelo Alvarez',
        record: '60-2-2',
        weight: '168 lbs',
        nickname: 'Canelo'
      },
      fighter2: {
        name: 'Jermell Charlo',
        record: '35-1-1',
        weight: '168 lbs',
        nickname: 'Iron Man'
      },
      event: {
        title: 'Super Middleweight Championship',
        date: '2025-01-25',
        time: '8:00 PM ET',
        venue: 'T-Mobile Arena',
        city: 'Las Vegas, NV'
      },
      broadcast: {
        network: 'Showtime',
        channel: 'Showtime PPV'
      },
      status: 'live',
      weightClass: 'Super Middleweight',
      rounds: 12,
      belt: 'WBA, WBC, IBF, WBO'
    },
    {
      id: 'fight_4',
      fighter1: {
        name: 'Gervonta Davis',
        record: '29-0-0',
        weight: '135 lbs',
        nickname: 'Tank'
      },
      fighter2: {
        name: 'Ryan Garcia',
        record: '24-1-0',
        weight: '135 lbs',
        nickname: 'King Ry'
      },
      event: {
        title: 'Lightweight Championship',
        date: '2025-02-01',
        time: '9:00 PM ET',
        venue: 'MGM Grand Garden Arena',
        city: 'Las Vegas, NV'
      },
      broadcast: {
        network: 'Showtime',
        channel: 'Showtime PPV'
      },
      status: 'upcoming',
      weightClass: 'Lightweight',
      rounds: 12,
      belt: 'WBA'
    },
    {
      id: 'fight_5',
      fighter1: {
        name: 'Terence Crawford',
        record: '40-0-0',
        weight: '147 lbs',
        nickname: 'Bud'
      },
      fighter2: {
        name: 'Errol Spence Jr.',
        record: '28-1-0',
        weight: '147 lbs',
        nickname: 'The Truth'
      },
      event: {
        title: 'Welterweight Championship',
        date: '2025-02-08',
        time: '8:00 PM ET',
        venue: 'AT&T Stadium',
        city: 'Arlington, TX'
      },
      broadcast: {
        network: 'Showtime',
        channel: 'Showtime PPV'
      },
      status: 'upcoming',
      weightClass: 'Welterweight',
      rounds: 12,
      belt: 'WBA, WBC, IBF, WBO'
    }
  ];
}

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to parse fight date consistently
function parseFightDate(fight) {
  // Extract date from various possible formats
  let dateStr = fight.event?.date || fight.date || fight.month + ' ' + fight.day + ', ' + new Date().getFullYear();
  
  // If it's already in YYYY-MM-DD format, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Otherwise, try to parse it
  // This handles "October 11, 2025" format
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
}

// Filter fights by date
function filterFightsByDate(fights) {
  const currentDate = getCurrentDate();
  console.log('📅 Current date:', currentDate);
  
  const todayFights = [];
  const upcomingFights = [];
  
  fights.forEach((fight, index) => {
    const fightDate = parseFightDate(fight);
    console.log(`📅 Fight ${index}: Date ${fightDate}, Current ${currentDate}, Decision:`, fightDate === currentDate ? 'LIVE EVENTS' : fightDate > currentDate ? 'UPCOMING' : 'PAST (ignore)');
    
    if (fightDate) {
      if (fightDate === currentDate) {
        todayFights.push(fight);
      } else if (fightDate > currentDate) {
        upcomingFights.push(fight);
      }
      // If fightDate < currentDate, we ignore it (past fight)
    }
  });
  
  console.log('📅 Today fights:', todayFights.length);
  console.log('📅 Upcoming fights:', upcomingFights.length);
  
  return { todayFights, upcomingFights };
}

function loadUpcomingFights() {
  console.log('🔧 DEBUGGING: loadUpcomingFights called - USING REAL ESPN DATA');
  
  // Show loading state
  const fightsList = document.getElementById('fights-list');
  fightsList.innerHTML = '<div class="loading-message">Loading upcoming fights...</div>';
  
  // Try to fetch real ESPN data only
  fetchESPNBoxingSchedule().then(espnData => {
    console.log('🔧 DEBUGGING: fetchESPNBoxingSchedule completed, data:', espnData);
    if (espnData && espnData.length > 0) {
      console.log('Using ESPN data:', espnData.length, 'fights found');
      
      // Filter fights by date
      const { upcomingFights } = filterFightsByDate(espnData);
      displayFights(upcomingFights, 'upcoming');
    } else {
      console.log('ESPN data unavailable, showing no events message');
      displayFights([], 'upcoming');
    }
  }).catch(error => {
    console.error('Error loading fights:', error);
    displayFights([], 'upcoming');
  });
}

function loadLiveEvents() {
  console.log('🔧 DEBUGGING: loadLiveEvents called - USING REAL ESPN DATA');
  
  // Show loading state
  const liveFightsList = document.getElementById('live-fights-list');
  liveFightsList.innerHTML = '<div class="loading-message">Loading live events...</div>';
  
  // Try to fetch real ESPN data only
  fetchESPNBoxingSchedule().then(espnData => {
    console.log('🔧 DEBUGGING: fetchESPNBoxingSchedule completed for live events, data:', espnData);
    if (espnData && espnData.length > 0) {
      console.log('Using ESPN data:', espnData.length, 'fights found');
      
      // Filter fights by date
      const { todayFights } = filterFightsByDate(espnData);
      displayFights(todayFights, 'live');
    } else {
      console.log('ESPN data unavailable, showing no events message');
      displayFights([], 'live');
    }
  }).catch(error => {
    console.error('Error loading live events:', error);
    displayFights([], 'live');
  });
}

// Add manual refresh functionality
// Refresh function removed - data refreshes automatically daily

// Simple and robust fighter name cleaning function
function cleanFighterName(name) {
  if (!name || typeof name !== 'string') return name;
  
  console.log('🧹 Cleaning fighter name:', name);
  
  // Convert to string and trim
  let cleaned = String(name).trim();
  
  // FIRST: Remove common title prefixes that start with capital letters
  cleaned = cleaned.replace(/^(.*?)(British\s+middleweight\s+title|title|championship|main\s+event|title\s+fight)(.*?)([A-Z][a-z]+)/, '$4');
  
  // SECOND: Find the first capital letter (where the actual name starts)
  // and remove everything before it (all the clutter)
  const match = cleaned.match(/[A-Z]/);
  if (match) {
    // Return everything from the first capital letter onward
    cleaned = cleaned.substring(match.index).trim();
  }
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  console.log('🧹 Cleaned result:', cleaned);
  return cleaned || name; // Return original if cleaning resulted in empty string
}

function displayFights(fights, pageType = 'upcoming') {
  console.log('🔍 DATA STRUCTURE ANALYSIS: displayFights called for', pageType);
  console.log('🔍 Fights parameter type:', typeof fights);
  console.log('🔍 Fights parameter length:', fights?.length);
  console.log('🔍 Fights parameter structure:', fights);
  console.log('🔍 Fights parameter keys:', Object.keys(fights || {}));
  
  // Determine which list to update
  const fightsList = pageType === 'live' 
    ? document.getElementById('live-fights-list') 
    : document.getElementById('fights-list');
    
  if (!fightsList) {
    console.error('🔍 Fights list element not found for pageType:', pageType);
    return;
  }
  
  fightsList.innerHTML = ''; // Clear existing content
  
  if (!fights || fights.length === 0) {
    console.log('🔍 No fights data, using fallback');
    const message = pageType === 'live' 
      ? '<div class="loading-message">No featured events today</div>' 
      : '<div class="loading-message">No upcoming fights found</div>';
    fightsList.innerHTML = message;
    return;
  }

  console.log('🔍 Processing', fights.length, 'fights from ESPN');
  
  // Log each individual fight item
  fights.forEach((fight, index) => {
    console.log(`🔍 Fight ${index} analysis:`);
    console.log(`🔍 Fight ${index} type:`, typeof fight);
    console.log(`🔍 Fight ${index} value:`, fight);
    console.log(`🔍 Fight ${index} keys:`, Object.keys(fight || {}));
    console.log(`🔍 Fight ${index} string representation:`, String(fight));
  });
  
  // Process each fight individually (not pairing them)
  fights.forEach((fight, index) => {
    console.log('🔧 DEBUGGING: Processing fight:', fight);
    console.log('🔧 DEBUGGING: Fight type:', typeof fight);
    console.log('🔧 DEBUGGING: Fight keys:', Object.keys(fight || {}));
    
    // Extract fighter names from the ESPN data structure
    let fighter1Name = 'Fighter 1';
    let fighter2Name = 'Fighter 2';
    
    // Handle different possible data structures
    if (typeof fight === 'string') {
      // If it's a string, try to extract names from it
      const vsIndex = fight.toLowerCase().indexOf(' vs ');
      if (vsIndex > -1) {
        fighter1Name = fight.substring(0, vsIndex).trim();
        fighter2Name = fight.substring(vsIndex + 4).trim();
      } else {
        fighter1Name = fight;
        fighter2Name = 'TBD';
      }
    } else if (fight.fighter1 && fight.fighter2) {
      // ESPN data structure: fighter1 and fighter2 are objects with name properties
      fighter1Name = fight.fighter1.name || fight.fighter1;
      fighter2Name = fight.fighter2.name || fight.fighter2;
    } else if (fight.fighter1 && fight.fighter1.name) {
      // Fallback: if they're objects with name properties
      fighter1Name = fight.fighter1.name;
      fighter2Name = fight.fighter2?.name || 'TBD';
    } else if (fight.name) {
      // If there's just a name field, it might be one fighter
      fighter1Name = fight.name;
      fighter2Name = 'TBD';
    }
    
    console.log('🔧 DEBUGGING: Extracted names:', fighter1Name, fighter2Name);
    console.log('🔧 DEBUGGING: fighter1Name type:', typeof fighter1Name);
    console.log('🔧 DEBUGGING: fighter2Name type:', typeof fighter2Name);
    
    // Aggressive post-processing cleanup: Remove all prefixes from fighter names
    fighter1Name = cleanFighterName(fighter1Name);
    fighter2Name = cleanFighterName(fighter2Name);
    
    console.log('🔧 DEBUGGING: Cleaned names:', fighter1Name, fighter2Name);
    
    // Create a proper fight object with real ESPN data
    const fightData = {
      id: fight.id || `fight_${index}`,
      fighter1: fighter1Name,
      fighter2: fighter2Name,
      date: formatDate(fight.event?.date || fight.date || `${fight.month} ${fight.day}, 2025`),
      venue: fight.event?.venue || fight.venue || 'TBD',
      weight: fight.weightClass || fight.weight || 'Boxing',
      network: fight.broadcast?.network || fight.network || 'TBD',
      rounds: fight.rounds || '12',
      records: {
        fighter1: fight.fighter1?.record || '0-0-0',
        fighter2: fight.fighter2?.record || '0-0-0'
      }
    };
    
    console.log('🔧 DEBUGGING: Created fight data:', fightData);
    console.log('🔧 DEBUGGING: fightData.fighter1:', fightData.fighter1);
    console.log('🔧 DEBUGGING: fightData.fighter2:', fightData.fighter2);
    console.log('🔧 DEBUGGING: fightData.fighter1 type:', typeof fightData.fighter1);
    console.log('🔧 DEBUGGING: fightData.fighter2 type:', typeof fightData.fighter2);
    
    // Pass isLiveEvent flag based on pageType
    const isLiveEvent = pageType === 'live';
    const fightCard = createSimpleFightCard(fightData, isLiveEvent);
    fightsList.appendChild(fightCard);
  });
  
  // Add click handlers for expandable functionality
  setTimeout(() => {
    setupFightCardListeners();
    setupScoreFightButtons(); // Add handler for "Score This Fight" buttons
  }, 100);
}


function createSimpleFightCard(fight, isLiveEvent = false) {
  console.log('🔧 DEBUGGING: createSimpleFightCard called with fight:', fight, 'isLiveEvent:', isLiveEvent);
  
  const fightCard = document.createElement('div');
  fightCard.className = 'fight-card';
  fightCard.dataset.fightId = fight.id;
  
  // Store fighter names as data attributes for pre-filling scorecard
  fightCard.dataset.fighter1 = fight.fighter1;
  fightCard.dataset.fighter2 = fight.fighter2;
  
  // Add "Score This Fight" button only for live events
  const scoreButtonHTML = isLiveEvent ? `
    <button class="score-fight-button" data-fighter1="${fight.fighter1}" data-fighter2="${fight.fighter2}" data-rounds="${fight.rounds || 12}">
      Score This Fight
    </button>
  ` : '';
  
  // Clean display with real ESPN data
  fightCard.innerHTML = `
    <div class="fight-status">UPCOMING</div>
    <div class="fight-main-info">
      <div class="fighters">
        <div class="fighter-names">${fight.fighter1}</div>
        <div class="fight-vs">vs</div>
        <div class="fighter-names">${fight.fighter2}</div>
      </div>
      <div class="fight-date">${fight.date}</div>
    </div>
    <div class="fight-extra-details">
      <div class="fight-event-title">Boxing Match</div>
      <div class="fight-time">TBD</div>
      <div class="fight-venue">${fight.venue}</div>
      <div class="fight-weight">${fight.weight}</div>
      <div class="fight-network">${fight.network}</div>
      <div class="fight-weight-full">${fight.weight} • ${fight.rounds} rounds</div>
      <div class="fighter-records">
        <div class="fighter-record-item">
          <span class="fighter-name">${fight.fighter1}</span>
          <span class="fighter-record">${fight.records.fighter1}</span>
        </div>
        <div class="fighter-record-item">
          <span class="fighter-name">${fight.fighter2}</span>
          <span class="fighter-record">${fight.records.fighter2}</span>
        </div>
      </div>
      ${scoreButtonHTML}
    </div>
  `;
  
  console.log('🔧 DEBUGGING: Created fight card HTML:', fightCard.innerHTML);
  return fightCard;
}

function createFightCard(fight) {
  console.log('🔧 DEBUGGING: createFightCard called with fight:', fight);
  
  const fightCard = document.createElement('div');
  fightCard.className = 'fight-card';
  fightCard.dataset.fightId = fight.id;
  
  const statusClass = fight.status === 'live' ? 'live' : '';
  const statusText = fight.status === 'live' ? 'LIVE' : 'UPCOMING';
  
  // Handle both old mock data format and new scraped ESPN data format
  const fighter1Name = fight.fighter1?.name || fight.fighter1 || 'Fighter 1';
  const fighter2Name = fight.fighter2?.name || fight.fighter2 || 'Fighter 2';
  
  console.log('🔧 DEBUGGING: Fighter names:', fighter1Name, 'vs', fighter2Name);
  
  // Handle different data structures
  const eventDate = fight.event?.date || fight.date || new Date().toISOString().split('T')[0];
  const eventVenue = fight.event?.venue || fight.venue || 'TBD';
  const eventCity = fight.event?.city || fight.city || '';
  const eventTime = fight.event?.time || fight.time || 'TBD';
  const eventTitle = fight.event?.title || fight.title || 'Boxing Match';
  const weightClass = fight.weightClass || fight.weight || 'Boxing';
  const rounds = fight.rounds || 12;
  const network = fight.broadcast?.network || fight.network || 'TBD';
  const fighter1Record = fight.fighter1?.record || '0-0-0';
  const fighter2Record = fight.fighter2?.record || '0-0-0';
  
  // Format venue with city
  const venueDisplay = eventCity ? `${eventVenue}, ${eventCity}` : eventVenue;
  
  fightCard.innerHTML = `
    <div class="fight-status ${statusClass}">${statusText}</div>
    <div class="fight-main-info">
      <div class="fighters">
        <div class="fighter-names">${fighter1Name}</div>
        <div class="fight-vs">vs</div>
        <div class="fighter-names">${fighter2Name}</div>
      </div>
      <div class="fight-date">${formatDate(eventDate)}</div>
    </div>
    <div class="fight-details">
      <div class="fight-venue">${venueDisplay}</div>
      <div class="fight-weight">${weightClass}</div>
      <div class="fight-network">${network}</div>
      <div class="fight-extra-details">
        <div class="fight-event-title">${eventTitle}</div>
        <div class="fight-time">${eventTime}</div>
        <div class="fight-venue-full">${venueDisplay}</div>
        <div class="fight-weight-full">${weightClass} • ${rounds} rounds</div>
        <div class="fight-network-full">${network}</div>
        ${fight.belt ? `<div class="fight-belt">${fight.belt}</div>` : ''}
        <div class="fighter-records">
          <div class="fighter-record-item">
            <span class="fighter-name">${fighter1Name}</span>
            <span class="fighter-record">${fighter1Record}</span>
          </div>
          <div class="fighter-record-item">
            <span class="fighter-name">${fighter2Name}</span>
            <span class="fighter-record">${fighter2Record}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return fightCard;
}

function formatDate(dateString) {
  console.log('🎯 formatDate called with:', dateString);
  
  // Parse date without timezone conversion to avoid day shift
  const [year, month, day] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  console.log('🎯 Date object created (no timezone):', date);
  console.log('🎯 Date toString:', date.toString());
  console.log('🎯 Date toDateString:', date.toDateString());
  
  const options = { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  const formatted = date.toLocaleDateString('en-US', options);
  console.log('🎯 Final formatted date:', formatted);
  return formatted;
}

// Data validation function for fight data
function validateFightData(fight) {
  // Basic validation - just check for essential data
  if (!fight || !fight.id) {
    console.warn('Fight missing ID');
    return false;
  }
  
  // Check for fighter names (handle both old and new data formats)
  const fighter1Name = fight.fighter1?.name || fight.fighter1;
  const fighter2Name = fight.fighter2?.name || fight.fighter2;
  
  if (!fighter1Name || !fighter2Name) {
    console.warn(`Fight ${fight.id} missing fighter names`);
    return false;
  }
  
  // Check for basic event data
  const eventDate = fight.event?.date || fight.date;
  if (!eventDate) {
    console.warn(`Fight ${fight.id} missing event date`);
    return false;
  }
  
  return true;
}

function setupFightCardListeners() {
  const fightCards = document.querySelectorAll('.fight-card');
  let currentlyExpanded = null;
  
  console.log('🔧 DEBUGGING: Setting up listeners for', fightCards.length, 'fight cards');
  
  fightCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't interfere with button clicks
      if (e.target.classList.contains('score-fight-button')) {
        console.log('🔧 DEBUGGING: Button click detected, letting it handle the event');
        return;
      }
      
      e.stopPropagation(); // Prevent event bubbling
      
      const fightId = this.dataset.fightId;
      console.log('🔧 DEBUGGING: Fight card clicked:', fightId);
      console.log('🔧 DEBUGGING: Card element:', this);
      
      // If this card is already expanded, collapse it
      if (currentlyExpanded === this) {
        console.log('🔧 DEBUGGING: Card already expanded, collapsing');
        collapseCard(this);
        currentlyExpanded = null;
        return;
      }
      
      // Collapse any previously expanded card
      if (currentlyExpanded) {
        console.log('🔧 DEBUGGING: Collapsing previous card');
        collapseCard(currentlyExpanded);
      }
      
      // Expand this card
      console.log('🔧 DEBUGGING: Expanding new card');
      expandCard(this);
      currentlyExpanded = this;
    });
  });
  
  // Add click listener to the page to collapse expanded cards when clicking outside
  document.addEventListener('click', function(e) {
    // Check if click is outside any fight card
    if (!e.target.closest('.fight-card')) {
      if (currentlyExpanded) {
        collapseCard(currentlyExpanded);
        currentlyExpanded = null;
      }
    }
  });
}

function expandCard(card) {
  console.log('🔧 DEBUGGING: expandCard called');
  card.classList.add('expanded');
  console.log('🔧 DEBUGGING: expanded class added');
}

function collapseCard(card) {
  card.classList.remove('expanded');
}

function setupScoreFightButtons() {
  const scoreButtons = document.querySelectorAll('.score-fight-button');
  console.log('🥊 Setting up Score Fight buttons:', scoreButtons.length);
  
  scoreButtons.forEach((button, index) => {
    console.log(`🥊 Setting up button ${index}:`, button.dataset.fighter1, 'vs', button.dataset.fighter2);
    
    // Remove any existing listeners first
    button.removeEventListener('click', handleScoreFightClick);
    
    // Add new listener
    button.addEventListener('click', handleScoreFightClick);
  });
}

function handleScoreFightClick(e) {
  console.log('🥊🔥 BUTTON CLICK DETECTED! 🔥🥊');
  e.preventDefault();
      e.stopPropagation(); // Prevent card collapse
  e.stopImmediatePropagation(); // Prevent other event listeners on the same element
      
      const fighter1 = this.dataset.fighter1;
      const fighter2 = this.dataset.fighter2;
  const rounds = parseInt(this.dataset.rounds) || 12; // Get rounds from data attribute
      
  console.log('🥊 Score This Fight clicked:', fighter1, 'vs', fighter2, `(${rounds} rounds)`);
  console.log('🥊 Button dataset:', this.dataset);
  console.log('🥊 Parsed rounds:', rounds);
      console.log('🥊 About to launch scorecard...');
      
  // Set origin and store fighter names and rounds
      scorecardOrigin = 'live-event';
      preFilledFighter1Name = fighter1;
      preFilledFighter2Name = fighter2;
  currentFightRounds = rounds;
  
  console.log('🥊 Set currentFightRounds to:', currentFightRounds);
      
      // Navigate to scorecard and pre-fill names
  launchScorecardWithFighters(fighter1, fighter2, rounds);
      
      console.log('🥊 Scorecard launch completed');
}

function initializeScorecardScreen() {
  // Safety check for currentFightRounds
  if (typeof currentFightRounds === 'undefined' || currentFightRounds === null) {
    console.warn('⚠️ currentFightRounds not set, defaulting to 12');
    currentFightRounds = 12;
  }
  
  console.log('🥊 Initializing scorecard screen with', currentFightRounds, 'rounds');
  
  // Set up the scorecard interface
  const blueScoresContainer = document.querySelector('.blue-scores');
  const redScoresContainer = document.querySelector('.red-scores');
  const roundNumbersContainer = document.querySelector('.round-numbers');
  
  if (!blueScoresContainer || !redScoresContainer || !roundNumbersContainer) {
    console.error('❌ Scorecard containers not found!');
    return;
  }
  
  // Clear existing content
  blueScoresContainer.innerHTML = '';
  redScoresContainer.innerHTML = '';
  roundNumbersContainer.innerHTML = '';

  // Create cells for all rounds (dynamic based on currentFightRounds)
  console.log('🥊 Creating scorecard with', currentFightRounds, 'rounds');
  for (let i = 1; i <= currentFightRounds; i++) {
    // Create round number
    const roundNumber = document.createElement('div');
    roundNumber.className = 'round-number';
    roundNumber.textContent = i;
    roundNumbersContainer.appendChild(roundNumber);

    // Create blue score cell
    const blueScoreCell = document.createElement('div');
    blueScoreCell.className = 'score-cell blue-score';
    blueScoreCell.dataset.round = i;
    blueScoreCell.innerHTML = '<div class="score-display"></div>';
    blueScoresContainer.appendChild(blueScoreCell);

    // Create red score cell
    const redScoreCell = document.createElement('div');
    redScoreCell.className = 'score-cell red-score';
    redScoreCell.dataset.round = i;
    redScoreCell.innerHTML = '<div class="score-display"></div>';
    redScoresContainer.appendChild(redScoreCell);
  }
  
  // Update the round indicator to show correct total rounds
  const roundText = document.querySelector('.round-text');
  if (roundText) {
    roundText.textContent = `Round 1 of ${currentFightRounds}`;
    console.log('🥊 Updated round indicator to:', roundText.textContent);
  }
  
  console.log('🥊 Scorecard screen initialized with', currentFightRounds, 'rounds');
}

function launchScorecardWithFighters(fighter1, fighter2, rounds = 12) {
  console.log('🥊 Launching scorecard with:', fighter1, 'vs', fighter2, `(${rounds} rounds)`);
  
  // Update global round count
  currentFightRounds = rounds;
  console.log('🥊 Set currentFightRounds to:', currentFightRounds);
  
  // Show the main app (scorecard) - ensure proper hiding/showing
  const loginOverlay = document.getElementById('login-overlay');
  const homeScreen = document.getElementById('home-screen');
  const upcomingFightsScreen = document.getElementById('upcoming-fights-screen');
  const liveEventsScreen = document.getElementById('live-events-screen');
  const mainApp = document.getElementById('main-app');
  
  // Hide all other screens
  if (loginOverlay) loginOverlay.style.display = 'none';
  if (homeScreen) {
    homeScreen.style.display = 'none';
    homeScreen.style.visibility = 'hidden';
    homeScreen.style.opacity = '0';
    homeScreen.style.zIndex = '-1'; // Move behind other elements
  }
  if (upcomingFightsScreen) upcomingFightsScreen.style.display = 'none';
  if (liveEventsScreen) liveEventsScreen.style.display = 'none';
  
  // Show main app
  if (mainApp) {
    mainApp.style.display = 'flex';
    mainApp.style.visibility = 'visible';
    mainApp.style.opacity = '1';
    mainApp.style.zIndex = '1001'; // Ensure it's above home screen
  }
  
  // Pre-fill fighter names
  document.getElementById('blue-name').value = fighter1;
  document.getElementById('red-name').value = fighter2;
  
  // Initialize the scorecard screen
  console.log('🥊 Initializing scorecard screen...');
  initializeScorecardScreen();
  
  // Initialize the main app (sets up scoring button event listeners)
  console.log('🥊 Initializing main app...');
  initializeMainApp();
  
  console.log('🥊 Scorecard launched with pre-filled names and', rounds, 'rounds');
  console.log('🥊 Main app display style:', document.getElementById('main-app').style.display);
  console.log('🥊 Home screen display style:', document.getElementById('home-screen').style.display);
  
  // Add a small delay to ensure the display changes take effect
  setTimeout(() => {
    console.log('🥊 After delay - Main app display style:', document.getElementById('main-app').style.display);
    console.log('🥊 After delay - Home screen display style:', document.getElementById('home-screen').style.display);
    
    // Check if scorecard elements are actually visible
    const mainApp = document.getElementById('main-app');
    const homeScreen = document.getElementById('home-screen');
    const mainAppComputed = window.getComputedStyle(mainApp);
    const homeScreenComputed = window.getComputedStyle(homeScreen);
    
    console.log('🥊 Main app computed display:', mainAppComputed.display);
    console.log('🥊 Main app computed visibility:', mainAppComputed.visibility);
    console.log('🥊 Main app computed opacity:', mainAppComputed.opacity);
    console.log('🥊 Main app computed z-index:', mainAppComputed.zIndex);
    
    console.log('🥊 Home screen computed display:', homeScreenComputed.display);
    console.log('🥊 Home screen computed visibility:', homeScreenComputed.visibility);
    console.log('🥊 Home screen computed opacity:', homeScreenComputed.opacity);
    console.log('🥊 Home screen computed z-index:', homeScreenComputed.zIndex);
  }, 100);
  
  // Check if scorecard elements exist
  const scorecardElements = {
    'main-app': document.getElementById('main-app'),
    'home-screen': document.getElementById('home-screen'),
    'blue-name': document.getElementById('blue-name'),
    'red-name': document.getElementById('red-name')
  };
  
  console.log('🥊 Scorecard elements check:', scorecardElements);
  
  // Force a small delay and check again
  setTimeout(() => {
    console.log('🥊 After 100ms - Main app display:', document.getElementById('main-app').style.display);
    console.log('🥊 After 100ms - Home screen display:', document.getElementById('home-screen').style.display);
  }, 100);
}

function handleFightCardClick(fightId) {
  console.log('Fight card clicked:', fightId);
  // For now, just show an alert. Later this will navigate to the scoring interface
  // with pre-populated fighter names and themed background
  alert(`Fight ${fightId} selected! This will open the scoring interface with pre-populated data.`);
  
  // TODO: In future iterations, this will:
  // 1. Navigate to the main scoring app
  // 2. Pre-populate fighter names
  // 3. Apply themed background based on the fight
  // 4. Set up live scoring if the fight is currently live
}

async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showError('Please fill in all fields');
    return;
  }

  try {
    // Try Supabase first
    if (supabaseStatus && supabaseStatus.connected) {
      console.log('🔐 Attempting Supabase login...');
      const result = await window.supabaseIntegration.signInUser(email, password);
      
      if (result.success) {
        currentUser = result.user;
        isLoggedIn = true;
        showHomeScreen();
        showSuccess('Welcome back, ' + result.user.name + '!');
        return;
      } else {
        showError(result.error || 'Login failed');
        return;
      }
    } else {
      // Fallback to localStorage
      console.log('📱 Using localStorage fallback for login');
  const savedUsers = JSON.parse(localStorage.getItem('crowdscore_users') || '[]');
  const user = savedUsers.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    isLoggedIn = true;
    localStorage.setItem('crowdscore_user', JSON.stringify(user));
    showHomeScreen();
    showSuccess('Welcome back, ' + user.name + '!');
  } else {
    showError('Invalid email or password');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Login failed. Please try again.');
  }
}

async function handleSignup() {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (!name || !email || !password || !confirm) {
    showError('Please fill in all fields');
    return;
  }

  if (password !== confirm) {
    showError('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }

  try {
    // Try Supabase first
    if (supabaseStatus && supabaseStatus.connected) {
      console.log('🔐 Attempting Supabase signup...');
      const result = await window.supabaseIntegration.signUpUser(email, password, name);
      
      if (result.success) {
        currentUser = result.user;
        isLoggedIn = true;
        showHomeScreen();
        showSuccess('Account created successfully! Welcome, ' + name + '!');
        return;
      } else {
        showError(result.error || 'Signup failed');
        return;
      }
    } else {
      // Fallback to localStorage
      console.log('📱 Using localStorage fallback for signup');
  const savedUsers = JSON.parse(localStorage.getItem('crowdscore_users') || '[]');
  if (savedUsers.find(u => u.email === email)) {
    showError('User with this email already exists');
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  };

  savedUsers.push(newUser);
  localStorage.setItem('crowdscore_users', JSON.stringify(savedUsers));

  currentUser = newUser;
  isLoggedIn = true;
  localStorage.setItem('crowdscore_user', JSON.stringify(newUser));

  showHomeScreen();
  showSuccess('Account created successfully! Welcome, ' + name + '!');
    }
  } catch (error) {
    console.error('Signup error:', error);
    showError('Signup failed. Please try again.');
  }
}

function showError(message) {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  const currentForm = document.getElementById('login-form').style.display !== 'none' ? 
    document.getElementById('login-form') : document.getElementById('signup-form');
  currentForm.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

function showSuccess(message) {
  document.querySelectorAll('.success-message').forEach(el => el.remove());
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.display = 'block';

  const currentForm = document.getElementById('login-form').style.display !== 'none' ? 
    document.getElementById('login-form') : document.getElementById('signup-form');
  currentForm.appendChild(successDiv);

  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Initialize app with auth
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing app...');
  setupAuthListeners();
  checkLoginStatus();
  console.log('App initialization complete');
  
  // Test if button exists on page load
  const testButton = document.getElementById('score-my-own-fight');
  console.log('Button exists on page load:', !!testButton);
});

// Your existing app code goes here, wrapped in initializeMainApp function
let isMainAppInitialized = false;

function initializeMainApp() {
  if (isMainAppInitialized) {
    console.log('Main app already initialized, skipping...');
    return;
  }
  
  console.log('initializeMainApp() called - setting up scoring interface');
  const blueName = document.getElementById('blue-name');
  const redName = document.getElementById('red-name');
  console.log('Blue name element found:', !!blueName);
  console.log('Red name element found:', !!redName);
  const blueWonButton = document.querySelector('.blue-won');
  const redWonButton = document.querySelector('.red-won');
  const blueScoresContainer = document.querySelector('.blue-scores');
  const redScoresContainer = document.querySelector('.red-scores');
  const roundNumbersContainer = document.querySelector('.round-numbers');
  const blueRunningTotal = document.querySelector('.boxer-info.blue .running-total-value');
  const redRunningTotal = document.querySelector('.boxer-info.red .running-total-value');
  const finalCenterOverlay = document.querySelector('.final-center-overlay');
  const blueFinalName = document.querySelectorAll('.blue-final-name');
  const redFinalName = document.querySelectorAll('.red-final-name');
  const blueFinal = document.querySelectorAll('.blue-final');
  const redFinal = document.querySelectorAll('.red-final');
  
  // Theme functions
  const toggleThemeButton = document.getElementById('toggle-theme');
  const resetThemeButton = document.getElementById('reset-theme');
  const newFightButton = document.getElementById('new-fight');
  
  // Theme definitions
  const themes = {
    default: {
      primaryColor: '#f5f5f5',
      phoneBackground: 'white',
      boxShadowColor: 'rgba(0, 0, 0, 0.2)',
      blueBoxColor: '#e6f0ff',
      redBoxColor: '#ffe6e6',
      blueButtonColor: '#0066cc',
      redButtonColor: '#cc0000',
      borderColor: '#ddd',
      roundBackgroundColor: '#f0f0f0',
      overlayBackground: 'rgba(255, 255, 255, 0.9)',
      textColor: '#333'
    },
    canelovscrawford: {
      primaryColor: '#000000',
      phoneBackground: 'rgba(20, 20, 20, 0.9)',
      boxShadowColor: 'rgba(255, 0, 0, 0.3)',
      blueBoxColor: 'rgba(30, 30, 150, 0.8)',
      redBoxColor: 'rgba(150, 30, 30, 0.8)',
      blueButtonColor: '#0033cc',
      redButtonColor: '#cc0000',
      borderColor: '#555',
      roundBackgroundColor: '#333',
      overlayBackground: 'rgba(0, 0, 0, 0.9)',
      textColor: '#fff'
    }
  };
  
  // Current active theme
  let activeTheme = 'default';
  
  // Theme toggle event listener
  toggleThemeButton.addEventListener('click', function() {
    const newTheme = (activeTheme === 'default') ? 'canelovscrawford' : 'default';
    applyTheme(newTheme);
  });
  
  // Reset theme event listener
  resetThemeButton.addEventListener('click', function() {
    applyTheme('default');
  });
  
  // Apply theme function
  function applyTheme(themeName) {
    if (themes[themeName]) {
      activeTheme = themeName;
      const theme = themes[themeName];
      const root = document.documentElement;
      
      // Apply all theme variables
      Object.entries(theme).forEach(([property, value]) => {
        root.style.setProperty(`--${property}`, value);
      });
    }
  }

  // Create score cells for all rounds
  createScoreCells();

  // Initialize event listeners
  initializeEventListeners();

  // Create score cells for all rounds
  function createScoreCells() {
    // Clear existing content
    blueScoresContainer.innerHTML = '';
    redScoresContainer.innerHTML = '';
    roundNumbersContainer.innerHTML = '';

    // Create cells for all rounds (dynamic based on currentFightRounds)
    console.log('🥊 Creating scorecard with', currentFightRounds, 'rounds');
    for (let i = 1; i <= currentFightRounds; i++) {
      // Create round number
      const roundNumber = document.createElement('div');
      roundNumber.className = 'round-number';
      roundNumber.textContent = i;
      roundNumbersContainer.appendChild(roundNumber);

      // Create blue score cell
      const blueScoreCell = document.createElement('div');
      blueScoreCell.className = 'score-cell blue-score';
      blueScoreCell.dataset.round = i;
      
      // Add score display element
      const blueScoreDisplay = document.createElement('div');
      blueScoreDisplay.className = 'score-display';
      blueScoreCell.appendChild(blueScoreDisplay);
      
      blueScoresContainer.appendChild(blueScoreCell);

      // Create red score cell
      const redScoreCell = document.createElement('div');
      redScoreCell.className = 'score-cell red-score';
      redScoreCell.dataset.round = i;
      
      // Add score display element
      const redScoreDisplay = document.createElement('div');
      redScoreDisplay.className = 'score-display';
      redScoreCell.appendChild(redScoreDisplay);
      
      redScoresContainer.appendChild(redScoreCell);
    }
  }

  // Initialize event listeners
  function initializeEventListeners() {
    // Remove existing event listeners to prevent duplicates
    const newBlueWonButton = blueWonButton.cloneNode(true);
    blueWonButton.parentNode.replaceChild(newBlueWonButton, blueWonButton);
    const newRedWonButton = redWonButton.cloneNode(true);
    redWonButton.parentNode.replaceChild(newRedWonButton, redWonButton);
    
    // Blue won button click
    newBlueWonButton.addEventListener('click', function() {
      console.log('🔥 Blue Won button clicked!');
      window.handleWinnerButtonClick('blue');
    });

    // Red won button click
    newRedWonButton.addEventListener('click', function() {
      console.log('🔥 Red Won button clicked!');
      window.handleWinnerButtonClick('red');
    });

    // Boxer name input event
    blueName.addEventListener('input', function() {
      updateBoxerName('blue');
    });

    redName.addEventListener('input', function() {
      updateBoxerName('red');
    });

    // Initialize name displays
    updateBoxerName('blue');
    updateBoxerName('red');

    // Add click handlers to score cells
    addScoreCellClickHandlers();

    // New fight button click
    newFightButton.addEventListener('click', function() {
      startNewFight();
    });
  }

  // Handle winner button click - moved to global scope
  window.handleWinnerButtonClick = function(winner) {
    console.log('✅ handleWinnerButtonClick called with winner:', winner);
    const currentRound = window.getCurrentRound();
    console.log('✅ Current round:', currentRound);
    if (currentRound <= currentFightRounds) {
      const blueScoreCell = document.querySelector(`.blue-score[data-round="${currentRound}"]`);
      const redScoreCell = document.querySelector(`.red-score[data-round="${currentRound}"]`);

      if (winner === 'blue') {
        blueScoreCell.querySelector('.score-display').textContent = '10';
        redScoreCell.querySelector('.score-display').textContent = '9';
      } else {
        blueScoreCell.querySelector('.score-display').textContent = '9';
        redScoreCell.querySelector('.score-display').textContent = '10';
      }

      window.updateRunningTotals();
      window.updateRoundIndicator();

      // Check if all rounds are scored
      if (currentRound === currentFightRounds) {
        window.showFinalScores();
      }
    }
  }

  // Update boxer name display
  function updateBoxerName(color) {
    const nameInput = document.getElementById(`${color}-name`);
    const nameElements = document.querySelectorAll(`.${color}-final-name`);
    nameElements.forEach(element => {
      element.textContent = nameInput.value || (color === 'blue' ? 'Blue' : 'Red');
    });
  }

  // Get current round - moved to global scope
  window.getCurrentRound = function() {
    const blueScores = document.querySelectorAll('.blue-score');
    for (let i = 0; i < blueScores.length; i++) {
      const scoreDisplay = blueScores[i].querySelector('.score-display');
      if (!scoreDisplay || scoreDisplay.textContent.trim() === '') {
        return i + 1;
      }
    }
    return currentFightRounds; // Default to last round if all are filled
  }

  // Update running totals - moved to global scope
  window.updateRunningTotals = function() {
    let blueTotal = 0;
    let redTotal = 0;
    const blueScores = document.querySelectorAll('.blue-score');
    const redScores = document.querySelectorAll('.red-score');

    blueScores.forEach(cell => {
      const scoreDisplay = cell.querySelector('.score-display');
      if (scoreDisplay && scoreDisplay.textContent.trim() !== '') {
        blueTotal += parseInt(scoreDisplay.textContent);
      }
    });

    redScores.forEach(cell => {
      const scoreDisplay = cell.querySelector('.score-display');
      if (scoreDisplay && scoreDisplay.textContent.trim() !== '') {
        redTotal += parseInt(scoreDisplay.textContent);
      }
    });

    blueRunningTotal.textContent = blueTotal;
    redRunningTotal.textContent = redTotal;

    // Update final scores too (only in overlay now)
    blueFinal.forEach(element => {
      element.textContent = blueTotal;
    });

    redFinal.forEach(element => {
      element.textContent = redTotal;
    });
  }

  // Update round indicator - moved to global scope
  window.updateRoundIndicator = function() {
    const currentRound = window.getCurrentRound();
    const roundText = document.querySelector('.round-text');
    if (roundText) {
      roundText.textContent = `Round ${currentRound} of ${currentFightRounds}`;
    }
  }

  // Show final scores overlay - moved to global scope
  window.showFinalScores = function() {
    // Get all scores and names
    const blueScores = document.querySelectorAll('.blue-score .score-display');
    const redScores = document.querySelectorAll('.red-score .score-display');
    const blueName = document.getElementById('blue-name').value || 'Blue Corner';
    const redName = document.getElementById('red-name').value || 'Red Corner';

    // Get the scorecard body
    const scorecardBody = document.querySelector('.scorecard-body');
    scorecardBody.innerHTML = ''; // Clear existing content

    // Add rows for each round
    for (let i = 0; i < currentFightRounds; i++) {
      const blueScore = blueScores[i]?.textContent || '-';
      const redScore = redScores[i]?.textContent || '-';
      
      const roundRow = document.createElement('div');
      roundRow.className = 'round-row';
      roundRow.innerHTML = `
        <div class="round-cell">${i + 1}</div>
        <div class="names-cell">
          <div>${blueName}</div>
          <div>${redName}</div>
        </div>
        <div class="points-cell">
          <div>${blueScore}</div>
          <div>${redScore}</div>
        </div>
      `;
      
      scorecardBody.appendChild(roundRow);
    }

    // Update totals and names
    const blueTotal = document.querySelector('.boxer-info.blue .running-total-value').textContent;
    const redTotal = document.querySelector('.boxer-info.red .running-total-value').textContent;
    
    document.querySelectorAll('.blue-total').forEach(el => el.textContent = blueTotal);
    document.querySelectorAll('.red-total').forEach(el => el.textContent = redTotal);

    // Update corner labels with actual boxer names
    document.querySelector('.blue-corner-label').textContent = blueName;
    document.querySelector('.red-corner-label').textContent = redName;

    // Show the overlay
    finalCenterOverlay.style.display = 'flex';

    // Save scorecard to Supabase
    saveScorecardToDatabase();

    // Add share button functionality
    const shareButton = document.getElementById('share-scorecard');
    if (shareButton) {
    shareButton.addEventListener('click', shareScorecard);
    }
  }

  // Save scorecard to database
  async function saveScorecardToDatabase() {
    try {
      console.log('💾 Saving scorecard to database...');
      
      // Get all score data
      const blueScores = document.querySelectorAll('.blue-score .score-display');
      const redScores = document.querySelectorAll('.red-score .score-display');
      const blueName = document.getElementById('blue-name').value || 'Blue Corner';
      const redName = document.getElementById('red-name').value || 'Red Corner';
      
      // Build scores array
      const fighter1Scores = [];
      const fighter2Scores = [];
      for (let i = 0; i < currentFightRounds; i++) {
        fighter1Scores.push(parseInt(blueScores[i]?.textContent) || 0);
        fighter2Scores.push(parseInt(redScores[i]?.textContent) || 0);
      }
      
      // Calculate totals
      const blueTotal = fighter1Scores.reduce((sum, score) => sum + score, 0);
      const redTotal = fighter2Scores.reduce((sum, score) => sum + score, 0);
      
      // Build scorecard data to match database schema
      const scorecardData = {
        fighter1_name: blueName,
        fighter2_name: redName,
        fighter1_scores: fighter1Scores,
        fighter2_scores: fighter2Scores,
        fight_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        fight_origin: scorecardOrigin // 'manual' or 'live-event'
      };
      
      console.log('💾 Scorecard data:', scorecardData);
      
      // Try Supabase first
      if (supabaseStatus && supabaseStatus.connected) {
        console.log('💾 Attempting Supabase save...');
        // Add user_id to the scorecard data
        const { data: { user } } = await window.supabaseIntegration.supabaseClient.auth.getUser();
        if (user) {
          scorecardData.user_id = user.id;
          console.log('💾 Added user_id:', user.id);
        } else {
          console.error('💾 No authenticated user found');
        }
        const result = await window.supabaseIntegration.saveScorecard(scorecardData);
        
        if (result.success) {
          console.log('✅ Scorecard saved to Supabase successfully!');
          showSuccess('Scorecard saved successfully!');
        } else {
          console.error('❌ Supabase save failed:', result.error);
          // Fallback to localStorage
          saveScorecardToLocalStorage(scorecardData);
        }
      } else {
        console.log('📱 Supabase not connected, using localStorage fallback');
        saveScorecardToLocalStorage(scorecardData);
      }
      
    } catch (error) {
      console.error('💾 Error saving scorecard:', error);
      showError('Failed to save scorecard. Please try again.');
    }
  }
  
  // Fallback localStorage save
  function saveScorecardToLocalStorage(scorecardData) {
    try {
      const savedScorecards = JSON.parse(localStorage.getItem('crowdscore_scorecards') || '[]');
      scorecardData.id = Date.now();
      savedScorecards.push(scorecardData);
      localStorage.setItem('crowdscore_scorecards', JSON.stringify(savedScorecards));
      console.log('📱 Scorecard saved to localStorage');
      showSuccess('Scorecard saved locally!');
    } catch (error) {
      console.error('📱 localStorage save failed:', error);
      showError('Failed to save scorecard.');
    }
  }

  // Share scorecard functionality
  async function shareScorecard() {
    try {
      const scorecard = document.querySelector('.final-scorecard');
      
      // Use html2canvas to capture the scorecard (you'll need to add this library)
      const canvas = await html2canvas(scorecard, {
        backgroundColor: 'white',
        scale: 2, // Higher quality
        logging: false
      });
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        try {
          // Try native sharing first
          if (navigator.share && navigator.canShare({ files: [blob] })) {
            await navigator.share({
              files: [blob],
              title: 'Fight Scorecard',
              text: 'Check out my fight scorecard!'
            });
          } else {
            // Fallback to download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fight-scorecard.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error('Error sharing scorecard:', error);
          alert('Could not share scorecard. Try downloading instead.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error creating scorecard image:', error);
      alert('Could not create scorecard image.');
    }
  }

  // Start a new fight
  function startNewFight() {
    console.log('🥊 Start New Fight - Origin:', scorecardOrigin);
    
    // Check origin to determine behavior
    if (scorecardOrigin === 'live-event') {
      // Came from Live Events - return to Home
      console.log('🥊 Returning to Home (came from Live Events)');
      
      // Reset scorecard origin for next time
      scorecardOrigin = 'manual';
      preFilledFighter1Name = '';
      preFilledFighter2Name = '';
      
      // Clear the scorecard
      clearScorecard();
      
      // Navigate to Home screen
      showHomeScreen();
    } else {
      // Came from Score My Own Fight - reset scorecard for another fight
      console.log('🥊 Resetting scorecard (came from Score My Own Fight)');
      
      // Just clear the scorecard, stay on scorecard page
      clearScorecard();
    }
  }
  
  function clearScorecard() {
    // Hide the final overlay
    finalCenterOverlay.style.display = 'none';
    
    // Clear all scores
    const blueScores = document.querySelectorAll('.blue-score .score-display');
    const redScores = document.querySelectorAll('.red-score .score-display');
    
    blueScores.forEach(display => {
      display.textContent = '';
    });
    
    redScores.forEach(display => {
      display.textContent = '';
    });
    
    // Clear boxer names
    blueName.value = '';
    redName.value = '';
    updateBoxerName('blue');
    updateBoxerName('red');
    
    // Reset running totals
    window.updateRunningTotals();
    
    // Reset round indicator
    window.updateRoundIndicator();
    
    // Remove any modified score indicators
    const modifiedCells = document.querySelectorAll('.score-modified');
    modifiedCells.forEach(cell => {
      cell.classList.remove('score-modified');
    });
    
    // Close any open inline pickers
    closeAllInlinePickers();
  }

  // Add click handlers to score cells for inline picker
  function addScoreCellClickHandlers() {
    const scoreCells = document.querySelectorAll('.score-cell');
    scoreCells.forEach(cell => {
      cell.addEventListener('click', function(e) {
        // Only show inline picker if the cell has a score
        if (this.querySelector('.score-display').textContent.trim() !== '') {
          if (this.classList.contains('editing')) {
            // If already editing, save the picker
            saveInlinePicker(this);
          } else {
            // Start inline picker
            closeAllInlinePickers();
            startInlinePicker(this);
          }
          e.stopPropagation();
        }
      });
    });

    // Close pickers when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.score-cell')) {
        closeAllInlinePickers();
      }
    });
  }

  // Start inline picker for a cell
  function startInlinePicker(cell) {
    cell.classList.add('editing');
    
    // Create inline picker
    const picker = document.createElement('div');
    picker.className = 'score-picker-inline';
    
    // Get current index based on current score
    function getCurrentIndex() {
      const currentScore = parseInt(cell.querySelector('.score-display')?.textContent || cell.textContent) || 10;
      if (currentScore === 10) return 0;
      if (currentScore === 9) return 1;
      if (currentScore === 8) return 2;
      if (currentScore === 7) return 3;
      return 0;
    }
    
    let currentIndex = getCurrentIndex();
    
    // Create score items (10, 9, 8, 7)
    const scores = [10, 9, 8, 7];
    scores.forEach((score, index) => {
      const item = document.createElement('div');
      item.className = 'score-picker-inline-item';
      item.textContent = score;
      if (index === currentIndex) item.classList.add('selected');
      
      // Add tap/click handler for direct selection (only if not dragging)
      item.addEventListener('click', function(e) {
        if (picker.dataset.isDragging !== 'true') {
          e.stopPropagation();
          currentIndex = index;
          picker.dataset.currentIndex = currentIndex;
          updateInlineSelection(picker, currentIndex);
          saveInlinePicker(cell);
        }
      });
      
      item.addEventListener('touchend', function(e) {
        // Small delay to check if dragging happened
        setTimeout(() => {
          if (picker.dataset.isDragging !== 'true') {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = index;
            picker.dataset.currentIndex = currentIndex;
            updateInlineSelection(picker, currentIndex);
            saveInlinePicker(cell);
          }
        }, 50);
      });
      
      picker.appendChild(item);
    });
    
    // Store currentIndex on picker for drag handlers to access
    picker.dataset.currentIndex = currentIndex;
    picker.dataset.isDragging = 'false'; // Initialize dragging state
    
    cell.appendChild(picker);
    
    // Update visual selection to show current index
    updateInlineSelection(picker, currentIndex);
    
    // Add touch/mouse handlers
    addInlineTouchHandlers(cell, picker);
  }

  // Add touch and mouse handlers for inline picker
  function addInlineTouchHandlers(cell, picker) {
    let startY = 0;
    let isDragging = false;
    let cumulativeDelta = 0; // Track total movement for smooth scrolling
    let startIndex = 0; // Index when drag started
    const items = picker.querySelectorAll('.score-picker-inline-item');
    
    // Get current index based on current score
    function getCurrentIndex() {
      const scoreDisplay = cell.querySelector('.score-display');
      const currentScore = parseInt(scoreDisplay ? scoreDisplay.textContent : cell.textContent) || 10;
      if (currentScore === 10) return 0;
      if (currentScore === 9) return 1;
      if (currentScore === 8) return 2;
      if (currentScore === 7) return 3;
      return 0;
    }
    
    // Get initial index from picker dataset or calculate it
    let currentIndex = parseInt(picker.dataset.currentIndex) || getCurrentIndex();
    
    function handleStart(e) {
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      cumulativeDelta = 0; // Reset cumulative movement
      startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      // Store starting index
      startIndex = parseInt(picker.dataset.currentIndex) || getCurrentIndex();
      currentIndex = startIndex;
      
      // Prevent item click handlers from firing during drag
      picker.dataset.isDragging = 'true';
    }
    
    function handleMove(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - currentY;
      
      // Smooth wheel-like scrolling - track cumulative movement
      // Smaller itemHeight = more sensitive (numbers change faster)
      const itemHeight = 50; // Pixels needed to scroll one item (lower = more sensitive)
      cumulativeDelta = deltaY;
      
      // Calculate which index based on cumulative movement
      // Dragging up (deltaY positive) should show lower numbers (10->9->8->7) = higher index (0->1->2->3)
      // Dragging down (deltaY negative) should show higher numbers (7->8->9->10) = lower index (3->2->1->0)
      const indexOffset = Math.round(cumulativeDelta / itemHeight);
      // When dragging UP (positive deltaY), we want HIGHER index (lower number)
      let newIndex = startIndex + indexOffset;
      
      // Clamp to valid range
      newIndex = Math.max(0, Math.min(3, newIndex));
      
      // Update if index changed
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        picker.dataset.currentIndex = currentIndex;
        updateInlineSelection(picker, currentIndex);
        
        // Update the score display as you scroll
        const selectedValue = parseInt(items[currentIndex].textContent);
        const scoreDisplay = cell.querySelector('.score-display');
        if (scoreDisplay) {
          scoreDisplay.textContent = selectedValue;
        } else {
          cell.textContent = selectedValue;
        }
        cell.dataset.score = selectedValue;
      }
    }
    
    function handleEnd(e) {
      if (isDragging) {
        isDragging = false;
        
        // Save the final selection
        const finalScore = parseInt(items[currentIndex].textContent);
        const scoreDisplay = cell.querySelector('.score-display');
        if (scoreDisplay) {
          scoreDisplay.textContent = finalScore;
        }
        
        // Update running totals
        window.updateRunningTotals();
        
        // Clear dragging flag after a short delay to allow tap handlers to check
        setTimeout(() => {
          picker.dataset.isDragging = 'false';
        }, 100);
      }
    }
    
    // Touch events - attach to picker container
    picker.addEventListener('touchstart', handleStart, { passive: false });
    picker.addEventListener('touchmove', handleMove, { passive: false });
    picker.addEventListener('touchend', handleEnd, { passive: false });
    
    // Mouse events
    picker.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Add wheel support (for desktop, less sensitive)
    let wheelTimeout;
    picker.addEventListener('wheel', function(e) {
      e.preventDefault();
      
      // Debounce wheel events to make it less jumpy
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        // Require more scroll before changing (less sensitive)
        const scrollThreshold = 50;
        if (Math.abs(e.deltaY) < scrollThreshold) return;
        
        const delta = e.deltaY > 0 ? 1 : -1;
        const newIndex = Math.max(0, Math.min(3, currentIndex + delta));
        
        if (newIndex !== currentIndex) {
          currentIndex = newIndex;
          picker.dataset.currentIndex = currentIndex; // Update stored index
          updateInlineSelection(picker, currentIndex);
        }
      }, 50);
    });
  }

  // Update inline picker selection
  function updateInlineSelection(picker, index) {
    const items = picker.querySelectorAll('.score-picker-inline-item');
    items.forEach((item, i) => {
      item.classList.remove('selected', 'above', 'below');
      if (i === index) {
        item.classList.add('selected');
      } else if (i < index) {
        item.classList.add('above');
      } else {
        item.classList.add('below');
      }
    });
  }

  // Save inline picker selection
  function saveInlinePicker(cell) {
    const picker = cell.querySelector('.score-picker-inline');
    const selectedItem = picker.querySelector('.score-picker-inline-item.selected');
    const selectedScore = selectedItem.textContent;
    
    // Update the score display
    const scoreDisplay = cell.querySelector('.score-display');
    scoreDisplay.textContent = selectedScore;
    
    // Add visual indicator if score is not the standard 10/9
    const isBlueCell = cell.classList.contains('blue-score');
    const round = cell.dataset.round;
    const oppositeCell = isBlueCell ? 
      document.querySelector(`.red-score[data-round="${round}"]`) : 
      document.querySelector(`.blue-score[data-round="${round}"]`);

    const standardScore = (oppositeCell.querySelector('.score-display').textContent === '10') ? '9' : '10';

    if (selectedScore !== standardScore) {
      cell.classList.add('score-modified');
    } else {
      cell.classList.remove('score-modified');
    }

    // Update running totals
    window.updateRunningTotals();
    
    // Remove picker and editing state
    cell.classList.remove('editing');
    picker.remove();
  }

  // Close all inline pickers
  function closeAllInlinePickers() {
    const editingCells = document.querySelectorAll('.score-cell.editing');
    editingCells.forEach(cell => {
      cell.classList.remove('editing');
      const picker = cell.querySelector('.score-picker-inline');
      if (picker) picker.remove();
    });
  }
  
  // Mark as initialized to prevent duplicate event listeners
  isMainAppInitialized = true;
  console.log('Main app initialization complete');
}
