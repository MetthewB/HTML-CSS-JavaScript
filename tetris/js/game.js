// game.js

// Start the game
function startGame() {
    currentTetrominoType = getRandomTetrominoType(); // Set a random initial tetromino type
    nextTetrominoType = getRandomTetrominoType(); // Set the next tetromino type
    currentRotation = 0; // Reset rotation
    currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
    drawTetromino();
    showNextPiece(tetrominoes[nextTetrominoType][0]); // Show the next piece
    updateNextPieceGrid(nextTetrominoType); // Update the next piece grid
    moveDownInterval = setInterval(moveDown, 1000); // Move the tetromino down every second
  }
  
  // Restart the game
  restartButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none'; // Hide game over screen
    gameBoard.innerHTML = ''; // Clear the board
    nextPieceContainer.innerHTML = ''; // Clear the next piece preview
    storedPieceContainer.innerHTML = ''; // Clear the stored piece preview
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    storedTetrominoType = null; // Reset stored tetromino
    // Reinitialize the grid and game logic
    startGame();
  });
  
  // Start the game when the window loads
  window.onload = startGame;