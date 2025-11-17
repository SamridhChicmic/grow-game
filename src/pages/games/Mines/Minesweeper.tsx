import React, {
  ComponentProps,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import Minesweeper, { Cell, CellStatus } from "./Minesweeper.controller"; // Assuming you have Minesweeper class in Minesweeper.ts file
import { AnimateInOut, BetInput, Button, Select } from "@/components";
import clsx from "clsx";
import { GearIcon, ShieldIcon } from "@/assets/svgs";
import { SilverLockIcon } from "@/assets/icons";
import { Bets } from "@/pages/landing/components";
import socket from "@/utils/constants";
import ExplosionIcon from "./assets/explosion-icon.svg";
import FlagIcon from "./assets/flag-icon.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { toast } from "react-toastify";
import { updateBalance } from "@/store/slices/wallet";
import { GameType } from "@/game-types";
import api from "@/api/axios";
// import "./mines.css ";

const BOARD_SIZE = 5;
const NUMBER_OF_MINES = 5;

const initialBetState: Partial<Bet> = {
  gameType: GameType.MINES as Bet["gameType"],
  stake: 0,
  profit: 0,
};

let walletBalance = 0;
const Mines: React.FC = () => {
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.wallet);
  useEffect(() => {
    if (!balance) return;

    walletBalance = balance;
  }, [balance]);

  const [minesNum, setMinesNum] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameWin, setGameWin] = useState<boolean>(false); // Track game win
  const [message, setMessage] = useState("Game Over");
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState(
    new Minesweeper(BOARD_SIZE, minesNum || NUMBER_OF_MINES),
  );
  const [board, setBoard] = useState<Cell[][]>(game.board);
  const [bet, setBet] = useState<Partial<Bet & { socketId: string }>>({
    gameType: GameType.MINES as Bet["gameType"],
  });
  const [betId, setBetId] = useState("");

  const getMinesNum = (val) => {
    setMinesNum(+val);
  };

  useEffect(() => {
    console.log("GAME_CHANGED: ", { board: game.board });
    setBoard(game.board);
  }, [game]);

  const [gameOver, setGameOver] = useState(false);
  // const [board, setBoard] = useState<CellStatus[][] | null>([[]]);

  // function initializeBoard(): CellStatus[][] {
  //   const board: CellStatus[][] = [];
  //   for (let i = 0; i < BOARD_SIZE; i++) {
  //     board[i] = [];
  //     for (let j = 0; j < BOARD_SIZE; j++) {
  //       board[i][j] = CellStatus.Hidden;
  //     }
  //   }
  //   return board;
  // }

  function handleCellClick(row: number, col: number) {
    socket.emit("MINES:reveal_cell", row, col);
    if (game.isGameOver()) {
      setGameOver(true);
      setMessage("Game Over");
      return;
    }

    const gameOver = game.revealCell(row, col);
    const newBoard = [...board];
    console.log("PRE: ", newBoard[row][col]);
    newBoard[row][col].status = CellStatus.Revealed;
    console.log("POST: ", newBoard);
    setBoard(newBoard);

    if (gameOver || game.isGameOver()) {
      if (game.mines === game.remainingCells) {
        setMessage("You Win!");
        setGameWin(true);
      }
      setGameOver(true);
      endGame();
    }
  }

  function handleRightClick(
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
    row: number,
    col: number,
  ) {
    event.preventDefault(); // Prevent default right-click behavior

    if (game.isGameOver()) return;

    game.toggleFlag(row, col);
    const newBoard = [...board];
    newBoard[row][col].status =
      newBoard[row][col].status === CellStatus.Flagged
        ? CellStatus.Hidden
        : CellStatus.Flagged;
    setBoard(newBoard);
  }

  useEffect(() => {
    // startGame();

    socket.on("MINES:game_started", (initialBoard: Cell[][]) => {
      console.log("MINES_STARTED!");
      setBoard(initialBoard);
    });

    socket.on(
      "MINES:cell_revealed",
      ({ row, col, cell }: { row: number; col: number; cell: Cell }) => {
        const newBoard = [...board!];
        newBoard[row][col] = cell;
        setBoard(newBoard);
      },
    );

    socket.on(
      "MINES:flag_toggled",
      ({ row, col, cell }: { row: number; col: number; cell: Cell }) => {
        const newBoard = [...board!];
        newBoard[row][col] = cell;
        setBoard(newBoard);
      },
    );

    socket.on("MINES:game_over", () => {
      console.log("Game Over!");
    });

    return () => {
      socket.disconnect();
    };
  }, [board]);

  const placeBet = async () => {
    if (!bet.stake || isNaN(bet.stake) || bet.stake <= 0)
      return toast.error("Invalid input. Please enter a valid bet amount.");
    if (!minesNum) return toast.error("please select either head or tail");
    setLoading(true);

    try {
      console.log("PLACE_BET: ", bet, socket.id);
      setLoading(true);
      setGameRunning(true);

      const response = await api.post("/bet/quick", {
        ...bet,
        socketId: socket.id,
      });

      const data = response.data;
      console.log("BET_RESPONSE", data);

      if (response.status !== 201) return toast.error("Couldn't play game");

      socket.emit("MINES:join_game", {
        player: {
          user: { username: auth.user?.username, photo: auth.user?.photo },
        } as Player,
        socketId: socket.id,
      });

      setBetId(data.bet._id);
      dispatch(updateBalance(balance - bet.stake));

      toast.success("bet placed!");
      setGame(new Minesweeper(BOARD_SIZE, minesNum || NUMBER_OF_MINES));
      setLoading(false);
      setGameRunning(true);
    } catch (error) {
      toast.error("Could not place bet!");
      setLoading(false);
      setGameRunning(false);
    }
  };

  const endGame = async () => {
    console.log("END_GAME: ");
    try {
      const response = await api.post("/bet/result", {
        ...bet,
        id: betId,
      });
      const data = response.data;
      dispatch(updateBalance(balance + (gameWin ? bet.profit! : 0)));
    } catch (error) {
      console.error("END_GAME: ", { error });
    }
  };

  const resetGame = () => {
    setBet(initialBetState);
    setGameRunning(true);
    setGameOver(false);
    setLoading(false);
    setGame(new Minesweeper(BOARD_SIZE, minesNum || NUMBER_OF_MINES));
    console.log("RESET_GAME");
  };

  // function handleCellClick(row: number, col: number) {
  //   console.log("CELL_CLICKED");
  //   // if (board && board[row][col] === CellStatus.Hidden) {
  //   socket.emit("MINES:reveal_cell", row, col);

  //   console.log("CELL_CLICKED:after");
  //   // }
  // }

  // function handleRightClick(
  //   event:
  //     | React.MouseEvent<HTMLButtonElement>
  //     | React.TouchEvent<HTMLButtonElement>,
  //   row: number,
  //   col: number,
  // ) {
  //   console.log("RIGHT_CLICKED");
  //   event.preventDefault(); // Prevent default right-click behavior
  //   if (board) {
  //     socket.emit("toggle_flag", row, col);
  //   }
  // }

  // function startGame() {
  //   socket.emit("start_game");
  // }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="min-h-[50px] bg-dark-800 flex overflow-hidden flex-col-reverse w-full items-center rounded-t-md border-b border-gray-700" />
        <div className="flex flex-row w-full h-full max-md:flex-col-reverse">
          <div
            className={clsx(
              "bg-dark-800 flex justify-start flex-col max-md:w-full w-[400px]",
            )}
          >
            <form className="w-[94%] mx-auto p-3 flex flex-col gap-2 font-medium  text-sm">
              <fieldset>
                <label className="text-sm font-semibold capitalize">
                  bet amount
                </label>
                <BetInput
                  inputProps={{
                    onChange(e) {
                      setBet((prev) => ({
                        ...prev,
                        stake: parseFloat(e.target.value),
                      }));
                    },
                    value: bet.stake,
                  }}
                />
              </fieldset>
              <fieldset className="relative h-20 mt-2">
                <label className="text-sm font-semibold capitalize">
                  mines
                </label>
                <div className="absolute w-full bg-dark-800">
                  <Select
                    label="3"
                    getValue={getMinesNum}
                    options={Array(24)
                      .fill(0)
                      .map((_, i) => ({
                        label: (i + 1).toString(),
                        value: (i + 1).toString(),
                      }))}
                  />
                </div>
              </fieldset>
              <Button
                loading={loading}
                disabled={loading || gameRunning}
                onClick={() => placeBet()}
                type="button"
                className="w-full capitalize"
              >
                {!auth.isAuthenticated || !balance
                  ? "insufficient funds"
                  : "place bet"}
              </Button>
            </form>
          </div>
          <div className="overflow-hidden bg-dark-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
            <div className="relative flex items-center justify-center w-full">
              <AnimateInOut
                show={gameOver}
                initial={{ translateY: -100, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                exit={{ translateY: -100, opacity: 0 }}
                onClick={() => resetGame()}
                className="absolute z-10 flex flex-col items-center justify-center w-full h-full backdrop-blur-sm"
              >
                <div className="relative flex items-center justify-center">
                  <p className="absolute text-6xl font-extrabold animate-ping">
                    {message}
                  </p>
                  <p className="relative z-20 text-6xl font-extrabold">
                    {message}
                  </p>
                </div>
                <div>
                  <small className="text-center">Tap to continue</small>
                </div>
              </AnimateInOut>
              <div className="w-full grid grid-cols-[repeat(5,1fr)] max-w-[540px] max-sm:max-w-[300px] h-full max-sm:gap-1.5 gap-2.5">
                {board &&
                  board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const hasMine = game.board[rowIndex][colIndex].hasMine;
                      return (
                        <Box
                          disabled={!gameRunning || loading}
                          key={colIndex}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          onContextMenu={(event) =>
                            handleRightClick(event, rowIndex, colIndex)
                          }
                          onTouchStart={(event) =>
                            handleRightClick(event, rowIndex, colIndex)
                          }
                        >
                          {/* cell === CellStatus.Revealed */}
                          {/* {cell === CellStatus.Revealed &&
                            game.board[rowIndex][colIndex].adjacentMines >
                              0 && ( */}
                          {(cell.status === CellStatus.Revealed ||
                            ((gameWin || gameOver) && !gameRunning)) && (
                            <span className="text-sm">
                              <>
                                {hasMine ? (
                                  <img
                                    className="w-8 h-8"
                                    src={ExplosionIcon}
                                    alt=""
                                  />
                                ) : (
                                  game.board[rowIndex][colIndex].adjacentMines
                                )}
                              </>
                            </span>
                          )}
                          {cell.status === CellStatus.Flagged && (
                            <div>
                              <img className="w-6 h-6" src={FlagIcon} alt="" />
                            </div>
                          )}
                        </Box>
                      );
                    }),
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
          <div className="flex gap-3 items-center capitalize w-[98%] mx-auto">
            <button className="flex items-center gap-1 group">
              <ShieldIcon className="!stroke-gray-500 !fill-gray-500 group-hover:!fill-white group-hover:!stoke-white" />
              <span className="font-semibold text-gray-500 group-hover:text-white">
                provably fair
              </span>
            </button>
            <button className="flex items-center gap-1 group">
              <GearIcon className="!stroke-gray-500 !fill-gray-500 group-hover:!fill-white group-hover:!stoke-white" />
              <span className="font-semibold text-gray-500 group-hover:text-white">
                settings
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 mt-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Mines</span>
        <div className="flex flex-row gap-2 max-md:flex-col">
          <div className="flex flex-col min-w-[300px] max-md:w-full gap-2">
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">House Edge</span>
              <span className="flex items-center gap-1.5">4%</span>
            </div>
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">Max Bet</span>

              <span className="flex items-center gap-1.5">
                1,000.00
                <img
                  src={SilverLockIcon}
                  width="18"
                  height="18"
                  className="sc-x7t9ms-0 dnLnNz"
                />
              </span>
            </div>
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">Max Win</span>
              <span className="flex items-center gap-1.5">
                10,000.00
                <img
                  src={SilverLockIcon}
                  width="18"
                  height="18"
                  className="sc-x7t9ms-0 dnLnNz"
                />
              </span>
            </div>
          </div>
          <div className="bg-dark-750 rounded-md  p-2.5 text-sm font-medium w-full text-justify leading-5">
            <span>
              In this action-packed game, you'll be going up against the casino.
              <br />
              <br />
              Make sure to avoid the mines at all costs, as they will make it
              very difficult for you to reach the maximum win.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

function Box({
  children,
  ...buttonProps
}: PropsWithChildren<ComponentProps<typeof Button>>) {
  return (
    <button
      {...buttonProps}
      className="bg-dark-750 mines-tile cursor-pointer flex items-center justify-center hover:-translate-y-1 hover:brightness-95 active:translate-y-0.5 w-full h-full max-sm:max-h[55px] max-sm:max-w-[55px] max-h-[100px] max-w-[100px]  max-sm:p-2 transition-transform p-4 ease-out rounded-sm relative aspect-square text-gray-500 text-[1.1rem] max-sm:text-sm font-semibold"
    >
      {/* <span>1.09×</span> */}
      {children}
    </button>
  );
}

export default Mines;
