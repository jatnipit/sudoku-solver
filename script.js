let selectedCell = null;

document.addEventListener("DOMContentLoaded", function () {
  const gridSize = 9;
  const solveButton = document.getElementById("solve-btn");
  solveButton.addEventListener("click", solveSudoku);

  const clearButton = document.getElementById("clear-btn");
  clearButton.addEventListener("click", clearSudoku);

  const sudokuGrid = document.getElementById("sudoku-grid");
  for (let row = 0; row < gridSize; row++) {
    const newRow = document.createElement("tr");
    for (let col = 0; col < gridSize; col++) {
      const newCell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "9";
      input.className = "cell";
      input.id = `cell-${row}-${col}`;

      input.addEventListener("focus", function () {
        selectedCell = input;
      });

      input.addEventListener("input", function () {
        if (this.value < 1 || this.value > 9 || isNaN(this.value))
          this.value = ""; // Clear input if invalid number is entered
      });

      newCell.appendChild(input);
      newRow.appendChild(newCell);
    }
    sudokuGrid.appendChild(newRow);
  }

  document.querySelectorAll(".numpad-btn").forEach((button) => {
    button.addEventListener("click", function () {
      if (selectedCell) {
        selectedCell.value = this.innerText; // Insert numpad number into selected cell
      }
    });
  });
});

async function solveSudoku() {
  const gridSize = 9;
  const sudokuArray = [];

  for (let row = 0; row < gridSize; row++) {
    sudokuArray[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cellValue = document.getElementById(cellId).value;
      sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cell = document.getElementById(cellId);

      if (sudokuArray[row][col] !== 0) {
        cell.classList.add("user-input");
      }
    }
  }

  if (solveSudokuHelper(sudokuArray)) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (!cell.classList.contains("user-input")) {
          cell.value = sudokuArray[row][col];
          cell.classList.add("solved");
          await sleep(20);
        }
      }
    }
  } else {
    alert("No solution found for the given Sudoku puzzle.");
  }
}

function solveSudokuHelper(board) {
  const gridSize = 9;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 0) {
        // Find an empty cell
        for (let num = 1; num <= gridSize; num++) {
          // Try numbers 1-9
          if (isValid(board, row, col, num)) {
            // Check if valid
            board[row][col] = num; // Place number

            if (solveSudokuHelper(board)) return true; // Continue solving
            board[row][col] = 0; // Backtrack (reset if failed)
          }
        }
        return false; // No valid number found → Backtrack
      }
    }
  }

  return true; // All cells filled → Sudoku solved
}

function isValid(board, row, col, num) {
  const gridSize = 9;

  //Check row and column for conflicts
  for (let i = 0; i < gridSize; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  //Check 3x3 box for conflicts
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false; //Conflict found
    }
  }

  return true; //No conflicts found
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearSudoku() {
  const gridSize = 9;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cell = document.getElementById(cellId);
      cell.value = "";
      cell.classList.remove("user-input", "solved");
    }
  }
}
