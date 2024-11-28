// scoring.js

// Check and remove completed lines
function checkCompletedLines() {
    let linesCleared = 0;
  
    for (let row = 0; row < 20; row++) {
      const isComplete = Array.from({ length: 10 }, (_, col) => row * 10 + col)
        .every(index => cells[index].classList.contains('fixed'));
      if (isComplete) {
        linesCleared++;
        // Remove the completed line
        Array.from({ length: 10 }, (_, col) => row * 10 + col)
          .forEach(index => {
            cells[index].className = 'cell'; // Reset the cell
          });
        
        // Move all cells above the cleared line down by one row
        for (let r = row - 1; r >= 0; r--) {
          Array.from({ length: 10 }, (_, col) => r * 10 + col).forEach(index => {
            if (cells[index].classList.contains('fixed')) {
              const tetrominoClass = Array.from(cells[index].classList).find(cls => cls.startsWith('tetromino-'));
              cells[index].classList.remove('fixed', 'tetromino', tetrominoClass);
              cells[index + 10].classList.add('fixed', 'tetromino', tetrominoClass);
            }
          });
        }
      }
    }
  
    // Update score based on the number of lines cleared
    if (linesCleared > 0) {
      let points = 0;
      if (linesCleared === 1) points = 100;
      else if (linesCleared === 2) points = 200;
      else if (linesCleared === 3) points = 500;
      else if (linesCleared === 4) points = 1000;
      updateScore(points);
    }
  }
  
// Update scoring
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}

// Game over logic
function gameOver() {
    isGameOver = true;
    clearInterval(moveDownInterval); // Clear the interval when the game is over
    gameOverScreen.style.display = 'block'; // Show the game over screen
    finalScoreDisplay.textContent = score; // Display the final score
  }