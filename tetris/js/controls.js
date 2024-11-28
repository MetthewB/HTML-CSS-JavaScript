// controls.js

// Handle user input
document.addEventListener('keydown', control);

function control(event) {
  if (isGameOver) return; // Ignore inputs if the game is over
  const key = event.key.toLowerCase();
  if (key === 'arrowleft') moveLeft();
  if (key === 'arrowright') moveRight();
  if (key === 'arrowdown') moveDown();
  if (key === 'a') rotateTetromino(-1); // Rotate left
  if (key === 'd') rotateTetromino(1);  // Rotate right
  if (key === 'q') storeTetromino(); // Store the tetromino
}