document.addEventListener('DOMContentLoaded', function() {
  const blueName = document.getElementById('blue-name');
  const redName = document.getElementById('red-name');
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

    // Create cells for all 12 rounds
    for (let i = 1; i <= 12; i++) {
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
    // Blue won button click
    blueWonButton.addEventListener('click', function() {
      handleWinnerButtonClick('blue');
    });

    // Red won button click
    redWonButton.addEventListener('click', function() {
      handleWinnerButtonClick('red');
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

  // Handle winner button click
  function handleWinnerButtonClick(winner) {
    const currentRound = getCurrentRound();
    if (currentRound <= 12) {
      const blueScoreCell = document.querySelector(`.blue-score[data-round="${currentRound}"]`);
      const redScoreCell = document.querySelector(`.red-score[data-round="${currentRound}"]`);

      if (winner === 'blue') {
        blueScoreCell.querySelector('.score-display').textContent = '10';
        redScoreCell.querySelector('.score-display').textContent = '9';
      } else {
        blueScoreCell.querySelector('.score-display').textContent = '9';
        redScoreCell.querySelector('.score-display').textContent = '10';
      }

      updateRunningTotals();
      updateRoundIndicator();

      // Check if all rounds are scored
      if (currentRound === 12) {
        showFinalScores();
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

  // Get current round
  function getCurrentRound() {
    const blueScores = document.querySelectorAll('.blue-score');
    for (let i = 0; i < blueScores.length; i++) {
      const scoreDisplay = blueScores[i].querySelector('.score-display');
      if (!scoreDisplay || scoreDisplay.textContent.trim() === '') {
        return i + 1;
      }
    }
    return 12; // Default to last round if all are filled
  }

  // Update running totals
  function updateRunningTotals() {
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

  // Update round indicator
  function updateRoundIndicator() {
    const currentRound = getCurrentRound();
    const roundText = document.querySelector('.round-text');
    if (roundText) {
      roundText.textContent = `Round ${currentRound} of 12`;
    }
  }

  // Show final scores overlay
  function showFinalScores() {
    finalCenterOverlay.style.display = 'flex';
  }

  // Start a new fight
  function startNewFight() {
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
    updateRunningTotals();
    
    // Reset round indicator
    updateRoundIndicator();
    
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
    
    // Create score items (10, 9, 8, 7)
    const scores = [10, 9, 8, 7];
    scores.forEach((score, index) => {
      const item = document.createElement('div');
      item.className = 'score-picker-inline-item';
      item.textContent = score;
      if (index === 0) item.classList.add('selected');
      picker.appendChild(item);
    });
    
    cell.appendChild(picker);
    
    // Add touch/mouse handlers
    addInlineTouchHandlers(cell, picker);
  }

  // Add touch and mouse handlers for inline picker
  function addInlineTouchHandlers(cell, picker) {
    let startY = 0;
    let currentIndex = 0;
    let isDragging = false;
    const items = picker.querySelectorAll('.score-picker-inline-item');
    
    function handleStart(e) {
      e.preventDefault();
      isDragging = true;
      startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    }
    
    function handleMove(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      const deltaY = startY - currentY;
      
      // Calculate new index based on scroll
      const itemHeight = 40; // Approximate item height
      const indexChange = Math.round(deltaY / itemHeight);
      const newIndex = Math.max(0, Math.min(3, currentIndex + indexChange));
      
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateInlineSelection(picker, currentIndex);
      }
    }
    
    function handleEnd() {
      isDragging = false;
    }
    
    // Touch events
    picker.addEventListener('touchstart', handleStart, { passive: false });
    picker.addEventListener('touchmove', handleMove, { passive: false });
    picker.addEventListener('touchend', handleEnd);
    
    // Mouse events - improved for laptop
    picker.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Add wheel support for laptop
    picker.addEventListener('wheel', function(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(3, currentIndex + delta));
      
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateInlineSelection(picker, currentIndex);
      }
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
    updateRunningTotals();
    
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
});