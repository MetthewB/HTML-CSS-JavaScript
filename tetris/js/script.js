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
  currentTetrominoType = nextTetrominoType; // Use the next tetromino type
  nextTetrominoType = getRandomTetrominoType(); // Generate a new next tetromino type
  updateNextPieceGrid(nextTetrominoType); // Update the next piece grid
  currentRotation = 0;
  currentTetromino = tetrominoes[currentTetrominoType][currentRotation];
  currentPosition = 3; // Reset position
  drawTetromino();
  showNextPiece(tetrominoes[nextTetrominoType][0]); // Show the next piece
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

let currentTetrominoType = 'L'; // Track the current tetromino type

// Function to check and adjust overflow
function adjustOverflow(translatedIndices, originalIndices) {
  const originalEndsWith = originalIndices.map(index => index % 10);
  const translatedEndsWith = translatedIndices.map(index => index % 10);

  // Check if any index ends with a digit from 6 to 9 and after rotation ends with a digit from 0 to 3
  if (originalEndsWith.some(digit => digit >= 6 && digit <= 9) && translatedEndsWith.some(digit => digit >= 0 && digit <= 3)) {
    while (translatedIndices.some(index => index % 10 >= 0 && index % 10 <= 3)) {
      translatedIndices = translatedIndices.map(index - 1);
      currentPosition -= 1; // Adjust the current position accordingly
    }
  }

  // Check if any index ends with a digit from 0 to 3 and after rotation ends with a digit from 6 to 9
  if (originalEndsWith.some(digit => digit >= 0 && digit <= 3) && translatedEndsWith.some(digit => digit >= 6 &&  digit <= 9)) {
    while (translatedIndices.some(index => index % 10 >= 6 && index % 10 <= 9)) {
      translatedIndices = translatedIndices.map(index + 1);
      currentPosition += 1; // Adjust the current position accordingly
    }
  }

  return translatedIndices;
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