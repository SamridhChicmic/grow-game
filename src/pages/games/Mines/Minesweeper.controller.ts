export enum CellStatus {
  Hidden = "Hidden",
  Revealed = "Revealed",
  Flagged = "Flagged",
}

export interface Cell {
  hasMine: boolean;
  status: CellStatus;
  adjacentMines: number;
}

class Minesweeper {
  // COMEBACK: Make Private
  public board: Cell[][];
  private size: number;
  readonly mines: number;
  remainingCells: number;

  constructor(size: number, mines: number) {
    this.size = size;
    this.mines = mines;
    this.remainingCells = size * size;
    this.board = [];

    this.initializeBoard();
    this.placeMines();
    this.calculateAdjacentMines();
  }

  private initializeBoard() {
    for (let i = 0; i < this.size; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.board[i][j] = {
          hasMine: false,
          status: CellStatus.Hidden,
          adjacentMines: 0,
        };
      }
    }
  }

  private placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);
      if (!this.board[row][col].hasMine) {
        this.board[row][col].hasMine = true;
        minesPlaced++;
      }
    }
  }

  private calculateAdjacentMines() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.board[i][j].hasMine) {
          let count = 0;
          for (let x = i - 1; x <= i + 1; x++) {
            for (let y = j - 1; y <= j + 1; y++) {
              if (
                x >= 0 &&
                x < this.size &&
                y >= 0 &&
                y < this.size &&
                this.board[x][y].hasMine
              ) {
                count++;
              }
            }
          }
          this.board[i][j].adjacentMines = count;
        }
      }
    }
  }

  public revealCell(row: number, col: number): boolean {
    if (
      row < 0 ||
      row >= this.size ||
      col < 0 ||
      col >= this.size ||
      this.board[row][col].status !== CellStatus.Hidden
    ) {
      return false;
    }

    const cell = this.board[row][col];
    cell.status = CellStatus.Revealed;
    this.remainingCells--;
    console.log({ remainingCells: this.remainingCells });

    if (cell.hasMine) {
      return true;
    }

    if (cell.adjacentMines === 0) {
      for (let x = row - 1; x <= row + 1; x++) {
        for (let y = col - 1; y <= col + 1; y++) {
          this.revealCell(x, y);
        }
      }
    }

    return false;
  }

  public toggleFlag(row: number, col: number): boolean {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return false;
    }

    const cell = this.board[row][col];
    if (cell.status === CellStatus.Hidden) {
      cell.status = CellStatus.Flagged;
    } else if (cell.status === CellStatus.Flagged) {
      cell.status = CellStatus.Hidden;
    }

    return true;
  }

  public isGameOver(): boolean {
    console.log({ remainingCells: this.remainingCells, mines: this.mines });
    return this.remainingCells === this.mines || this.remainingCells === 0;
  }

  public printBoard() {
    for (let i = 0; i < this.size; i++) {
      let row = "";
      for (let j = 0; j < this.size; j++) {
        const cell = this.board[i][j];
        if (cell.status === CellStatus.Hidden) {
          row += "- ";
        } else if (cell.status === CellStatus.Revealed) {
          if (cell.hasMine) {
            row += "* ";
          } else if (cell.adjacentMines === 0) {
            row += "  ";
          } else {
            row += cell.adjacentMines + " ";
          }
        } else if (cell.status === CellStatus.Flagged) {
          row += "F ";
        }
      }
      console.log(row);
    }
  }
}

// Example usage
const game = new Minesweeper(5, 5); // 5x5 grid with 5 mines
game.printBoard();

export default Minesweeper;
