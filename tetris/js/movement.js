// movement.js

// Check if the tetromino can move down
function canMoveDown() {
    const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
    return translatedIndices.every(index => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      const nextRow = row + 1;
      const nextIndex = nextRow * 10 + col;
      return nextRow < 20 && !cells[nextIndex].classList.contains('fixed');
    });
  }
  
  // Move the tetromino down
  function moveDown() {
    if (canMoveDown()) {
      undrawTetromino();
      currentPosition += 10; // Move down one row
      drawTetromino();
    } else {
      fixTetromino();
    }
  }
  
  // Move the tetromino left
  function moveLeft() {
    const canMoveLeft = currentTetrominoIndices.every(index => {
      const col = index % 10;
      return col > 0 && !cells[index - 1].classList.contains('fixed');
    });
  
    if (canMoveLeft) {
      undrawTetromino();
      currentPosition -= 1; // Move left
      drawTetromino();
    }
  }
  
  // Move the tetromino right
  function moveRight() {
    const canMoveRight = currentTetrominoIndices.every(index => {
      const col = index % 10;
      return col < 9 && !cells[index + 1].classList.contains('fixed');
    });
  
    if (canMoveRight) {
      undrawTetromino();
      currentPosition += 1; // Move right
      drawTetromino();
    }
  }

// Rotate the tetromino
function rotateTetromino(direction) {
  undrawTetromino();
  const originalIndices = translateToMainGrid(currentTetromino, currentPosition);
  currentRotation = (currentRotation + direction + 4) % 4;
  currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
  currentTetrominoIndices = adjustOverflow(translateToMainGrid(currentTetromino, currentPosition), originalIndices);
  drawTetromino();
}




// Fix the tetromino in place and generate a new one
function fixTetromino() {
  const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
  translatedIndices.forEach(index => {
    cells[index].classList.add('fixed');
  });
  checkCompletedLines();
  currentTetrominoType = nextTetrominoType; // Use the next tetromino type
  nextTetrominoType = getRandomTetrominoType(); // Generate a new next tetromino type
  updateNextPieceGrid(nextTetrominoType); // Update the next piece grid
  currentRotation = 0;
  currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
  currentPosition = 3; // Reset position
  drawTetromino();
  showNextPiece(tetrominoes[nextTetrominoType][0]); // Show the next piece
}

// Store the tetromino
function storeTetromino() {
  undrawTetromino();
  let newPosition = currentPosition;
  let canSwitch = true;

  if (storedTetrominoType === null) {
    storedTetrominoType = currentTetrominoType;
    currentTetrominoType = nextTetrominoType;
    nextTetrominoType = getRandomTetrominoType();
  } else {
    const storedTetrominoIndices = translateToMainGrid(tetrominoes[storedTetrominoType][0], currentPosition);
    canSwitch = storedTetrominoIndices.every(index => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      return row < 20 && col >= 0 && col < 10 && !cells[index].classList.contains('fixed');
    });

    if (canSwitch) {
      [storedTetrominoType, currentTetrominoType] = [currentTetrominoType, storedTetrominoType];
      // Calculate the row of the stored tetromino and set the new position
      const minRow = Math.min(...storedTetrominoIndices.map(index => Math.floor(index / 10)));
      newPosition = minRow * 10 + (currentPosition % 10);
    }
  }

  if (canSwitch) {
    currentRotation = 0;
    currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
    currentPosition = newPosition; // Set the new position
    drawTetromino();
    showStoredPiece(tetrominoes[storedTetrominoType][0]); // Show the stored piece
    updateNextPieceGrid(nextTetrominoType); // Update the next piece grid
  } else {
    drawTetromino(); // Redraw the current tetromino if switch is not possible
  }
}

// Rotate the tetromino
function rotateTetromino(direction) {
    undrawTetromino();
    const originalIndices = translateToMainGrid(currentTetromino, currentPosition);
    currentRotation = (currentRotation + direction + 4) % 4;
    currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
    currentTetrominoIndices = adjustOverflow(translateToMainGrid(currentTetromino, currentPosition), originalIndices);
    drawTetromino();
  }