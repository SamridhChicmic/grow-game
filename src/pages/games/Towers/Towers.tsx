import { SilverLockIcon } from "@/assets/icons";
import {
  AnimateInOut,
  BetInput,
  Button,
  ProvablyFair,
  Select,
} from "@/components";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import SkullImage from "./assets/skull.png";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import api from "@/api/axios";
import { GameType } from "@/game-types";
import socket from "@/utils/constants";
import { updateBalance } from "@/store/slices/wallet";
import { toast } from "react-toastify";

function PlayIcon() {
  return (
    <svg
      className="svg-icon"
      style={{
        width: "1em",
        height: "1em",
        verticalAlign: "middle",
        fill: "currentColor",
        overflow: "hidden",
      }}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z"
        fill="yellow"
      />
    </svg>
  );
}

enum Difficulty {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

type CellContent = { hasSkull: boolean; selected: boolean };

function getRandomIndices<T>(array: T[], count: number): number[] {
  const indices: number[] = [];

  while (indices.length < count) {
    const index = Math.floor(Math.random() * array.length);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }

  return indices;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let walletBalance = 0;
export default function Towers() {
  const [grid, setGrid] = useState<CellContent[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [currentRow, setCurrentRow] = useState<number>(9); // Start from the bottom row
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWin, setGameWin] = useState<boolean>(false); // Track game win
  const [multiplier, setMultiplier] = useState<number>(1); // Initial multiplier
  const [bet, setBet] = useState<Partial<Bet>>({
    stake: 0,
    gameType: GameType.TOWERS as Bet["gameType"],
    multiplier,
  });

  const auth = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.wallet);

  const dispatch = useAppDispatch();

  const loading = useState(false)[0];
  const [gameRunning, setGameRunning] = useState(false);
  const [message, setMessage] = useState("");
  // NOTE: remove
  const [betId, setBetId] = useState("");

  const endGame = useCallback(async () => {
    console.log("END_GAME: ");
    try {
      const response = await api.post("/bet/result", {
        ...bet,
        id: betId,
      });
      const data = response.data;
      console.log({ data });
      dispatch(updateBalance(balance + (gameWin ? bet.profit! : 0)));
    } catch (error) {
      console.error("END_GAME: ", { error });
    }
  }, [balance, bet, betId, dispatch, gameWin]);

  useEffect(() => {
    if (!balance) return;

    walletBalance = balance;
  }, [balance]);

  useEffect(() => {
    console.log({ gameOver, gameWin });
    if (!(gameOver || gameWin)) return;
    console.log("ENNND");
    endGame();
  }, [endGame, gameOver, gameWin]);

  const initializeGame = useCallback(() => {
    let numberOfColumns = 4;
    switch (difficulty) {
      case Difficulty.EASY:
        numberOfColumns = 4;
        break;
      case Difficulty.NORMAL:
        numberOfColumns = 3;
        break;
      case Difficulty.HARD:
        numberOfColumns = 2;
        break;
      default:
        numberOfColumns = 3;
        break;
    }

    const rows: CellContent[][] = Array(10)
      .fill(0)
      .map(() => {
        const columns: CellContent[] = Array(numberOfColumns)
          .fill(0)
          .map((_, i) => ({ hasSkull: false, selected: false, key: i }));

        const numberOfSkulls = 1;

        // Get random positions for the skulls in the columns
        const skullPositions = getRandomIndices(columns, numberOfSkulls);

        // Place skulls in the determined positions
        skullPositions.forEach((position) => {
          columns[position].hasSkull = true;
        });

        return columns;
      });
    setGrid(rows);
  }, [difficulty]);

  // NOTE
  // const takeProfit = () => {
  //   setBet((prev) => ({ ...prev, profit: 0 }));
  //   setGameOver(true); // End the game
  // };

  const resetGame = useCallback(() => {
    setCurrentRow(9);
    setGameOver(false);
    setGameWin(false);
    setMultiplier(1);
    setBet((prev) => ({ ...prev, profit: 0 }));
    initializeGame();
    setMessage("");
    setGameRunning(false);
  }, [initializeGame]);

  const placeBet = async () => {
    if (!bet.stake) return toast.error("Invalid bet amount");
    // await
    try {
      const response = await api.post("/bet/quick", {
        ...bet,
        socketId: socket.id,
      });

      const data = response.data;

      setBetId(data.bet._id);
      dispatch(updateBalance(balance - bet.stake!));

      initializeGame();
      setGameRunning(true);
      toast.success("Bet placed");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    resetGame();
  }, [difficulty, resetGame]);

  const Cell = ({
    cellContent,
    col,
    row,
  }: {
    cellContent: CellContent;
    row: number;
    col: number;
  }) => {
    const gridCopy = [...grid];
    const cell = gridCopy[row][col];

    const handleClick = () => {
      if (gameOver || gameWin || row !== currentRow || !gameRunning) return;

      gridCopy[row][col] = { ...cell, selected: true };
      setGrid(gridCopy);

      if (cell.hasSkull) {
        setGameOver(true);
        setMessage("Game over");
      } else {
        if (row > 0) {
          setCurrentRow(row - 1);
          setMultiplier((prev) => prev + 1); // Increase multiplier
        } else {
          setGameWin(true); // Game won when the top row is reached
          setMessage("You Win!");
        }
      }
    };

    return (
      <button
        onClick={handleClick}
        className={clsx(
          "w-full h-[45px] rounded-md transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md towers-default",
          {
            "bg-primary": row === currentRow && gameRunning,
            "bg-green-700": cellContent.selected && !cellContent.hasSkull,
            "bg-red-600": cellContent.selected && cellContent.hasSkull,
            "opacity-50 cursor-not-allowed":
              !gameRunning ||
              gameOver ||
              gameWin ||
              (row !== currentRow && currentRow > row),
          },
        )}
      >
        {(cellContent.selected || gameOver) &&
          (cellContent.hasSkull ? (
            <img src={SkullImage} className="w-7 object-cover animate-pulse" />
          ) : (
            <PlayIcon />
          ))}
      </button>
    );
  };

  const Multiplier = ({ index }: { index: number }) => {
    return (
      <div
        className={clsx(
          "border-2 snap-start transition-all w-full overflow-hidden flex justify-between px-2.5 gap-2.5 h-full  rounded items-center font-medium border-gray-700",
          // index === currentRow && "border-primary",
        )}
      >
        <span className="font-semibold text-white uppercase">
          Hit {index + 1}
        </span>
        <span className="text-sm font-semibold text-gray-400">
          {(multiplier * (index / 60))?.toFixed(2)}×
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className=" min-h-[50px] bg-dark-800 flex overflow-hidden flex-col-reverse w-full items-center rounded-t-md border-b border-gray-700">
          <div className="w-full h-full flex gap-1.5 p-2  justify-start overflow-hidden relative shadow-dark-800 items-center">
            <div
              className="w-[6px] bg-dark-800 h-full absolute right-0 top-0 z-[5] "
              style={{ boxShadow: "0 0 30px 40px var(--tw-shadow-color)" }}
            ></div>
          </div>
        </div>
        <div className="flex flex-row w-full h-full max-md:flex-col-reverse">
          <div className="bg-dark-800 flex justify-start flex-col max-md:w-full w-[400px]">
            <div className="flex relative flex-col gap-2 p-3 text-sm font-medium">
              {(!auth.isAuthenticated || loading || gameRunning) && (
                <div
                  onClick={() => {
                    !loading && resetGame();
                  }}
                  className="absolute top-0 left-0 z-10 w-full h-full cursor-not-allowed bg-dark-800 opacity-70"
                />
              )}
              <div className={clsx("relative flex h-full flex-col gap-2 p-3")}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-white">
                    Bet Amount
                  </span>
                  <BetInput
                    inputProps={{
                      value: bet.stake,
                      onChange(e) {
                        setBet((prev) => ({
                          ...prev,
                          stake: parseFloat(e.target.value),
                        }));
                      },
                    }}
                  />
                </div>
                <div className="flex flex-col text-white gap-[5px]">
                  <div className="relative flex flex-col justify-start gap-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      Difficulty
                    </span>
                    <Select
                      label="Difficulty"
                      options={Object.values(Difficulty).map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      value={difficulty}
                      getValue={(val) => {
                        setDifficulty(val);
                      }}
                    />
                  </div>
                </div>
                {/* <div className="absolute top-0 left-0 w-full h-full cursor-not-allowed z-5"></div> */}
              </div>
              <Button
                onClick={placeBet}
                aria-disabled="true"
                className="text-sm py-2 w-full rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap"
              >
                Place Bet
              </Button>
            </div>
          </div>
          <div className="overflow-hidden bg-red-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
            <AnimateInOut
              show={message !== ""}
              initial={{ translateY: -100, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: -100, opacity: 0 }}
              onClick={() => resetGame()}
              className="absolute z-50 flex flex-col items-center justify-center w-full h-full cursor-pointer backdrop-blur-sm_"
            >
              <div className="relative flex items-center justify-center">
                <p className="relative z-20 text-6xl font-extrabold">
                  {message}
                </p>
              </div>
            </AnimateInOut>
            <div className="!max-h-[600px] w-full">
              <div className="flex items-center justify-center w-full h-full p-2">
                <div className="w-[240px] gap-2 overflow-y-auto overflow-x-hidden flex flex-col h-full p-2 max-md:hidden">
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <Multiplier key={i} index={i} />
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex flex-col p-2 gap-1 rounded-md bg-dark-800 w-full max-w-[370px]">
                    {grid.map((rows, rowIndex) => (
                      <div
                        key={rowIndex}
                        className={clsx("flex w-full gap-2 rounded")}
                      >
                        {rows.map((cell, colIndex) => (
                          <Cell
                            key={colIndex}
                            cellContent={cell}
                            row={rowIndex}
                            col={colIndex}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
          <ProvablyFair />
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Towers</span>
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
              This game lets you get the highest multiplier possible by climbing
              the rows to the top of the tower.
              <br />
              <br />
              Make sure to avoid the Skulls at all costs, as they will make it
              very difficult for you to reach the tower's roof.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
