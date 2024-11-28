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