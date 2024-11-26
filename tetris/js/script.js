// Select key elements
const gameBoard = document.getElementById('game-board');
const nextPieceContainer = document.getElementById('next-piece');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.querySelector('.game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Initialize game variables
let score = 0;
let isGameOver = false;
let currentPosition = 3; // Initial position for the tetromino

// Create game board
for (let i = 0; i < 200; i++) {
   const cell = document.createElement('div');
   cell.classList.add('cell');
   gameBoard.appendChild(cell);
}

// Create the next piece grid
for (let i = 0; i < 16; i++) { // 4x4 grid
  const cell = document.createElement('div');
  cell.classList.add('next-piece-cell');
  nextPieceContainer.appendChild(cell);
}
const nextCells = Array.from(nextPieceContainer.querySelectorAll('.next-piece-cell'));

const tetrominoes = {
  L: [
    [2, 4, 5, 6],  // Initial orientation
    [1, 5, 9, 10],  // 90 degrees
    [4, 5, 6, 8],  // 180 degrees
    [0, 1, 5, 9]   // 270 degrees
  ],
  J: [
    [0, 4, 5, 6],
    [1, 2, 5, 9],
    [4, 5, 6, 10],
    [1, 5, 8, 9]
  ],
  T: [
    [1, 4, 5, 6],
    [1, 5, 6, 9],
    [4, 5, 6, 9],
    [1, 4, 5, 9]
  ],
  Z: [
    [0, 1, 5, 6],
    [2, 5, 6, 9],
    [4, 5, 9, 10],
    [1, 4, 5, 8]
  ],
  S: [
    [1, 2, 4, 5],
    [1, 5, 6, 10],
    [5, 6, 8, 9],
    [0, 4, 5, 9]
  ],
  O: [
    [5, 6, 9, 10],
    [5, 6, 9, 10],
    [5, 6, 9, 10],
    [5, 6, 9, 10]
  ],
  I: [
    [4, 5, 6, 7],
    [2, 6, 10, 14],
    [8, 9, 10, 11],
    [1, 5, 9, 13]
  ]
};

let currentRotation = 0;

// Translate 4x4 grid indices to 20x10 grid
function translateToMainGrid(indices, position) {
  return indices.map(index => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return position + row * 10 + col;
  });
}

// Show the next piece
function showNextPiece(nextTetromino) {
  nextCells.forEach(cell => cell.classList.remove('tetromino')); // Clear the preview
  nextTetromino.forEach(index => {
    nextCells[index].classList.add('tetromino');
  });
}

// Array of tetromino types
const tetrominoTypes = ['L', 'J', 'T', 'Z', 'S', 'O', 'I'];

// Function to get a random tetromino type
function getRandomTetrominoType() {
  const randomIndex = Math.floor(Math.random() * tetrominoTypes.length);
  return tetrominoTypes[randomIndex];
}

// Draw the tetromino
const cells = Array.from(document.querySelectorAll('.cell'));

function drawTetromino() {
   console.log('Drawing tetromino at position:', currentPosition);
   const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
   translatedIndices.forEach(index => {
       console.log(`Drawing index: ${index}`); // Log the index
       cells[index].classList.add('tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`);
   });
}

function undrawTetromino() {
   const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
   translatedIndices.forEach(index => {
       cells[index].classList.remove('tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`);
   });
}
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

// Fix the tetromino in place and generate a new one
function fixTetromino() {
  const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
  translatedIndices.forEach(index => {
    cells[index].classList.add('fixed');
  });
  checkCompletedLines();
  currentTetrominoType = getRandomTetrominoType();
  currentRotation = 0;
  currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
  currentPosition = 3; // Reset position
  drawTetromino();
}

// Check and remove completed lines
function checkCompletedLines() {
  for (let row = 0; row < 20; row++) {
    const isComplete = Array.from({ length: 10 }, (_, col) => row * 10 + col)
      .every(index => cells[index].classList.contains('fixed'));
    if (isComplete) {
      Array.from({ length: 10 }, (_, col) => row * 10 + col)
        .forEach(index => cells[index].classList.remove('fixed', 'tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`));
      const fixedCells = Array.from(document.querySelectorAll('.fixed'));
      fixedCells.forEach(cell => cell.classList.remove('fixed', 'tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`));
      fixedCells.forEach(cell => gameBoard.appendChild(cell));
    }
  }
}

// Move the tetromino
function moveDown() {
  if (canMoveDown()) {
    undrawTetromino();
    currentPosition += 10; // Move down one row
    drawTetromino();
  } else {
    fixTetromino();
  }
}

function moveLeft() {
  const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
  const canMoveLeft = translatedIndices.every(index => {
    const col = index % 10;
    return col > 0 && !cells[index - 1].classList.contains('fixed');
  });

  if (canMoveLeft) {
    undrawTetromino();
    currentPosition -= 1; // Move left
    drawTetromino();
  }
}

function moveRight() {
  const translatedIndices = translateToMainGrid(currentTetromino, currentPosition);
  const canMoveRight = translatedIndices.every(index => {
    const col = index % 10;
    return col < 9 && !cells[index + 1].classList.contains('fixed');
  });

  if (canMoveRight) {
    undrawTetromino();
    currentPosition += 1; // Move right
    drawTetromino();
  }
}

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
}

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
          cells[index].classList.remove('fixed', 'tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`);
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
  gameOverScreen.style.display = 'block'; // Show the game over screen
  finalScoreDisplay.textContent = score; // Display the final score
}

let currentTetrominoType = 'L'; // Track the current tetromino type

// Rotate the tetromino
function rotateTetromino(direction) {
  console.log('Rotating tetromino:', direction);
  undrawTetromino();
  currentRotation = (currentRotation + direction + 4) % 4; // Ensure rotation stays within 0-3
  currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
  drawTetromino();
}

// Start the game
function startGame() {
  currentTetrominoType = getRandomTetrominoType(); // Set a random initial tetromino type
  currentRotation = 0; // Reset rotation
  currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
  drawTetromino();
  showNextPiece(tetrominoes[getRandomTetrominoType()][0]); // Example for next piece
}

// Restart the game
restartButton.addEventListener('click', () => {
  gameOverScreen.style.display = 'none'; // Hide game over screen
  gameBoard.innerHTML = ''; // Clear the board
  nextPieceContainer.innerHTML = ''; // Clear the next piece preview
  score = 0;
  scoreDisplay.textContent = score;
  isGameOver = false;
  // Reinitialize the grid and game logic
  startGame();
});

// Start the game when the window loads
window.onload = startGame;