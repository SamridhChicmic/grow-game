import React, { useState, useEffect } from "react";
import "./TowersGame.css"; // Style file

enum Difficulty {
  Easy = "Easy",
  Normal = "Normal",
  Hard = "Hard",
}

const numRows = 10;
const numCols = 3;
const skullChance = {
  Easy: 0.1,
  Normal: 0.2,
  Hard: 0.3,
};

const TowersGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Normal);
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    initializeGrid();
  }, [difficulty]);

  const initializeGrid = () => {
    const newGrid: boolean[][] = [];
    for (let row = 0; row < numRows; row++) {
      const rowCells: boolean[] = [];
      for (let col = 0; col < numCols; col++) {
        // Randomly assign skulls based on difficulty
        const hasSkull = Math.random() < skullChance[difficulty];
        rowCells.push(hasSkull);
      }
      newGrid.push(rowCells);
    }
    setGrid(newGrid);
    setGameOver(false);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameOver) {
      if (grid[row][col]) {
        // If clicked cell has skull, game over
        setGameOver(true);
      } else {
        // Move up the grid
        moveUp(row);
      }
    }
  };

  const moveUp = (row: number) => {
    if (row === 0) {
      // Reached the top row, game won
      setGameOver(true);
    } else {
      const newGrid = [...grid];
      newGrid[row - 1] = [...newGrid[row]];
      setGrid(newGrid);
    }
  };

  return (
    <div className="towers-game">
      <h1>Towers Game</h1>
      <div className="difficulty-buttons">
        <button onClick={() => handleDifficultyChange(Difficulty.Easy)}>
          Easy
        </button>
        <button onClick={() => handleDifficultyChange(Difficulty.Normal)}>
          Normal
        </button>
        <button onClick={() => handleDifficultyChange(Difficulty.Hard)}>
          Hard
        </button>
      </div>
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${cell ? "skull" : ""} ${gameOver ? "game-over" : ""}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TowersGame;
