// Select key elements
const gameBoard = document.getElementById('game-board');
const nextPieceContainer = document.getElementById('next-piece');
const storedPieceContainer = document.getElementById('stored-piece');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.querySelector('.game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Array of tetromino types
const tetrominoTypes = ['L', 'J', 'T', 'Z', 'S', 'O', 'I'];

// Function to get a random tetromino type
function getRandomTetrominoType() {
  const randomIndex = Math.floor(Math.random() * tetrominoTypes.length);
  return tetrominoTypes[randomIndex];
}

// Initialize game variables
let score = 0;
let isGameOver = false;
let currentPosition = 3; // Initial position for the tetromino
let nextTetrominoType = getRandomTetrominoType(); // Track the next tetromino type
let storedTetrominoType = null; // Track the stored tetromino type
let moveDownInterval; // Interval for moving the tetromino down

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

// Create the stored piece grid
for (let i = 0; i < 16; i++) { // 4x4 grid
  const cell = document.createElement('div');
  cell.classList.add('stored-piece-cell');
  storedPieceContainer.appendChild(cell);
}
const storedCells = Array.from(storedPieceContainer.querySelectorAll('.stored-piece-cell'));

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

// Translate 4x4 grid indices to 4x4 next piece grid
function translateToNextGrid(indices) {
  return indices.map(index => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return row * 4 + col;
  });
}

// Show the next piece
function showNextPiece(nextTetromino) {
  nextCells.forEach(cell => cell.classList.remove('tetromino')); // Clear the preview
  const nextTetrominoIndices = translateToNextGrid(nextTetromino);
  nextTetrominoIndices.forEach(index => {
    nextCells[index].classList.add('tetromino');
  });
}

// Show the stored piece
function showStoredPiece(storedTetromino) {
  storedCells.forEach(cell => cell.classList.remove('filled', 'tetromino-o', 'tetromino-i', 'tetromino-t', 'tetromino-s', 'tetromino-z', 'tetromino-j', 'tetromino-l')); // Clear the preview
  const storedTetrominoIndices = translateToNextGrid(storedTetromino);
  storedTetrominoIndices.forEach(index => {
    storedCells[index].classList.add('filled', `tetromino-${storedTetrominoType.toLowerCase()}`);
  });
}

// Draw the tetromino
const cells = Array.from(document.querySelectorAll('.cell'));

let currentTetrominoIndices = [];

// Draw the tetromino
function drawTetromino() {
  console.log('Drawing tetromino at position:', currentPosition);
  currentTetrominoIndices = translateToMainGrid(currentTetromino, currentPosition);
  currentTetrominoIndices.forEach(index => {
    console.log(`Drawing index: ${index}`); // Log the index
    cells[index].classList.add('tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`);
  });
}

function undrawTetromino() {
  currentTetrominoIndices.forEach(index => {
    cells[index].classList.remove('tetromino', `tetromino-${currentTetrominoType.toLowerCase()}`);
  });
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

// Update the next piece grid
function updateNextPieceGrid(nextTetrominoType) {
    // Clear the grid
    nextCells.forEach(cell => {
      cell.classList.remove('filled', 'tetromino-o', 'tetromino-i', 'tetromino-t', 'tetromino-s', 'tetromino-z', 'tetromino-j', 'tetromino-l');
    });
  
    // Get the initial orientation of the next tetromino
    const initialOrientation = tetrominoes[nextTetrominoType][0];
  
    // Fill the grid with the next tetromino
    initialOrientation.forEach(index => {
      nextCells[index].classList.add('filled', `tetromino-${nextTetrominoType.toLowerCase()}`);
    });
  }