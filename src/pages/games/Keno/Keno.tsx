import clsx from "clsx";
import "./keno.css";
import { SilverLockIcon } from "@/assets/icons";
import { Fragment, PropsWithChildren, useState } from "react";
import {
  AnimateInOut,
  AnimatedList,
  BetInput,
  Button,
  ProvablyFair,
  Select,
} from "@/components";
import { GameType } from "@/game-types";
import { toast } from "react-toastify";
import KenoBoard from "./KenoBoard";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { updateBalance } from "@/store/slices/wallet";
import { v4 as uuidv4 } from "uuid";
import socket from "@/utils/constants";
import api from "@/api/axios";

const payoutTables = {
  classic: {
    1: { 1: 2.5 },
    2: { 2: 5, 1: 0.5 },
    3: { 3: 50, 2: 5, 1: 1 },
    4: { 4: 150, 3: 15, 2: 2, 1: 1 },
    5: { 5: 500, 4: 50, 3: 5, 2: 2, 1: 1 },
    6: { 6: 1600, 5: 100, 4: 15, 3: 5, 2: 1 },
    7: { 7: 5000, 6: 500, 5: 50, 4: 10, 3: 2, 2: 1 },
    8: { 8: 15000, 7: 1500, 6: 100, 5: 25, 4: 5, 3: 2, 2: 1 },
    9: { 9: 25000, 8: 4000, 7: 500, 6: 50, 5: 10, 4: 5, 3: 2, 2: 1 },
    10: {
      10: 100000,
      9: 10000,
      8: 500,
      7: 100,
      6: 20,
      5: 10,
      4: 5,
      3: 2,
      2: 1,
      1: 0.5,
    },
  },
  low: {
    1: { 1: 1.5 },
    2: { 2: 3, 1: 0.25 },
    3: { 3: 30, 2: 3, 1: 0.5 },
    4: { 4: 100, 3: 10, 2: 1, 1: 0.5 },
    5: { 5: 300, 4: 30, 3: 3, 2: 1, 1: 0.5 },
    6: { 6: 1000, 5: 50, 4: 10, 3: 3, 2: 0.5 },
    7: { 7: 3000, 6: 300, 5: 30, 4: 5, 3: 1, 2: 0.5 },
    8: { 8: 10000, 7: 1000, 6: 50, 5: 15, 4: 3, 3: 1, 2: 0.5 },
    9: { 9: 20000, 8: 2000, 7: 300, 6: 30, 5: 5, 4: 3, 3: 1, 2: 0.5 },
    10: {
      10: 50000,
      9: 5000,
      8: 300,
      7: 50,
      6: 10,
      5: 5,
      4: 3,
      3: 1,
      2: 0.5,
      1: 0.25,
    },
  },
  medium: {
    1: { 1: 2 },
    2: { 2: 4, 1: 0.35 },
    3: { 3: 40, 2: 4, 1: 0.75 },
    4: { 4: 120, 3: 12, 2: 1.5, 1: 0.75 },
    5: { 5: 400, 4: 40, 3: 4, 2: 1.5, 1: 0.75 },
    6: { 6: 1400, 5: 70, 4: 12, 3: 4, 2: 1 },
    7: { 7: 4000, 6: 400, 5: 40, 4: 8, 3: 1.5, 2: 1 },
    8: { 8: 12000, 7: 1200, 6: 70, 5: 20, 4: 4, 3: 1.5, 2: 1 },
    9: { 9: 24000, 8: 2400, 7: 400, 6: 40, 5: 8, 4: 4, 3: 1.5, 2: 1 },
    10: {
      10: 60000,
      9: 6000,
      8: 400,
      7: 70,
      6: 15,
      5: 8,
      4: 4,
      3: 1.5,
      2: 1,
      1: 0.35,
    },
  },
  high: {
    1: { 1: 3 },
    2: { 2: 6, 1: 0.75 },
    3: { 3: 70, 2: 6, 1: 1.25 },
    4: { 4: 200, 3: 25, 2: 3, 1: 1.25 },
    5: { 5: 700, 4: 70, 3: 6, 2: 3, 1: 1.25 },
    6: { 6: 2000, 5: 150, 4: 25, 3: 6, 2: 2 },
    7: { 7: 7000, 6: 700, 5: 70, 4: 15, 3: 3, 2: 2 },
    8: { 8: 20000, 7: 2500, 6: 150, 5: 50, 4: 6, 3: 3, 2: 2 },
    9: { 9: 40000, 8: 5000, 7: 700, 6: 70, 5: 15, 4: 6, 3: 3, 2: 2 },
    10: {
      10: 100000,
      9: 10000,
      8: 700,
      7: 150,
      6: 30,
      5: 15,
      4: 6,
      3: 3,
      2: 2,
      1: 0.75,
    },
  },
};

let betID = "";
export default function Keno() {
  const auth = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.wallet);
  const [gameRunning, setGameRunning] = useState(false);

  const dispatch = useAppDispatch();

  // const [balance, dispatch(updateBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [bet, setBet] = useState<Partial<Bet>>({
    stake: 0,
    gameType: GameType.KENO as Bet["gameType"],
    multiplier: 10,
  });

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  // const [result, setResult] = useState<string>("");
  const [result, setResult] = useState<{
    hits: number;
    payout: number;
  } | null>(null);

  const [riskLevel, setRiskLevel] = useState<
    "classic" | "low" | "medium" | "high"
  >("classic");
  const maxSelection = 10;
  const [message, setMessage] = useState<string>("");
  const [betId, setBetId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [historyItems, setHistoryItems] = useState<
    { id: string; text: string }[]
  >([]);
  // const calculatePayout = (matches: number, bet: number) => {
  //   const selectedCount = selectedNumbers.length;
  //   // const payoutMultiplier = payoutTable[selectedCount]?.[matches] || 0;
  //   // return bet * payoutMultiplier;
  //   return bet;
  // };

  const randomPick = () => {
    const availableNumbers = Array.from({ length: 40 }, (_, i) => i + 1);
    const shuffled = availableNumbers.sort(() => 0.5 - Math.random());
    setSelectedNumbers(shuffled.slice(0, maxSelection));
  };

  const resetGame = () => {
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setResult({ hits: 0, payout: 0 });
  };

  const selectedCount = selectedNumbers.length;

  const handleNumberSelect = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleDrawNumbers = async () => {
    if (!bet.stake) return toast.error("Invalid bet amount");

    if (selectedNumbers.length === 0 || bet.stake <= 0 || balance < bet.stake)
      return;

    const newDrawnNumbers = Array.from(
      { length: 11 },
      () => Math.floor(Math.random() * 40) + 1,
    );
    setDrawnNumbers(newDrawnNumbers);

    const hits = selectedNumbers.filter((num) =>
      newDrawnNumbers.includes(num),
    ).length;
    const payoutTable = payoutTables[riskLevel][selectedNumbers.length];
    const payoutMultiplier = payoutTable[hits] || 0;
    const payout = bet.stake * payoutMultiplier;
    console.log({ hits, riskLevel, payoutTable, payoutMultiplier, payout });
    setBet((prev) => ({
      ...prev,
      profit: payout,
      multiplier: payoutMultiplier,
    }));

    console.log({ newDrawnNumbers, selectedNumbers });
    setResult({ hits, payout });
    setTimeout(() => {
      setShowResult(true);
    }, 2000);
    await endGame();
    dispatch(updateBalance(balance + payout - bet.stake));
    // alert(payout);
  };

  const addHistoryItem = (item: string) => {
    if (item.trim()) {
      setHistoryItems([{ id: uuidv4(), text: item }, ...historyItems]);
    }
  };

  const placeBet = async () => {
    if (!bet.stake) return toast.error("Invalid bet input");

    if (bet?.stake > balance) {
      setMessage("Insufficient balance");

      return toast.error("Insufficient balance");
    }
    try {
      const response = await api.post("/bet/quick", {
        ...bet,
        socketId: socket.id,
      });

      const data = response.data;

      if (!data.bet) return toast.error("Could not place bet");
      console.log("BET_ID: ", data.bet?._id);
      setBetId(data?.bet?._id);

      betID = data?.bet?._id;

      dispatch(updateBalance(balance - bet.stake!));

      handleDrawNumbers();
      setGameRunning(true);
      toast.success("Bet placed");
    } catch (error) {
      console.error("PLACE_BET:LIMBO", error);
      return toast.error("An error occurred");
    }
  };

  const endGame = async () => {
    console.log({ betId, profit: bet.profit });
    try {
      const response = await api.post("/bet/result", {
        ...bet,
        id: betID,
      });
      const data = response.data;
      console.log({ data });
      if (bet.multiplier) addHistoryItem(bet.multiplier.toString());
      // dispatch(updateBalance(balance + (gameWin ? bet.profit! : 0)));
      // resetGame();
    } catch (error) {
      console.error("END_GAME: ", { error });
    }
  };

  // const handleRiskLevelChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   setRiskLevel(event.target.value as "classic" | "low" | "medium" | "high");
  // };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="h-[50px] bg-dark-800 rounded-t-md border-b border-gray-700">
          <AnimatedList items={historyItems} />

          {/* <div className="w-full h-full flex gap-1.5 p-2  justify-start overflow-hidden relative shadow-dark-800 items-center">
            <div
              className="w-[6px] bg-dark-800 h-full absolute right-0 top-0 z-[5] "
              style={{ boxShadow: "0 0 30px 40px var(--tw-shadow-color)" }}
            ></div>
          </div> */}
        </div>
        <div className="flex flex-row w-full h-full max-md:flex-col-reverse">
          <div className="bg-dark-800flex justify-start flex-col max-md:w-full w-[400px]">
            <div className="flex flex-col gap-2 p-3 text-sm font-semibold">
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

              <Select
                label="Risk"
                options={[
                  { label: "classic", value: "classic" },
                  { label: "low", value: "low" },
                  { label: "medium", value: "medium" },
                  { label: "classic", value: "classic" },
                ]}
                getValue={(e) => setRiskLevel(e)}
                value={riskLevel}
              />
              <button
                onClick={randomPick}
                aria-disabled="false"
                className="text-sm rounded sc-1xm9mse-0 lfSLTO text-nowrap"
              >
                Pick Random
              </button>
              <button
                onClick={resetGame}
                aria-disabled="false"
                className="text-sm rounded sc-1xm9mse-0 lfSLTO text-nowrap"
              >
                Clear Table
              </button>
              <Button
                onClick={placeBet}
                aria-disabled="true"
                className="text-sm py-2 w-full rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap"
              >
                Place Bet
              </Button>
            </div>
          </div>
          <div className="overflow-hidden bg-dark-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
            <div className="flex p-3 items-center max-h-[550px] flex-col justify-between w-full relative  gap-1">
              <div className="grid grid-cols-[repeat(8,auto)] max-w-[600px] max-sm:gap-1 gap-2 p-0 w-full">
                <KenoBoard
                  selectedNumbers={selectedNumbers}
                  drawnNumbers={drawnNumbers}
                  onSelectNumber={handleNumberSelect}
                />
              </div>
              {selectedCount > 0 ? (
                <div className="grid grid-rows-[auto_auto] min-h-[100px] select-none w-full gap-1  font-semibold text-sm text-gray-200">
                  <div
                    className="grid gap-1 min-h-[40px]"
                    style={{
                      gridTemplateColumns: `repeat(${
                        Object.entries(payoutTables[riskLevel][selectedCount])
                          .length + 1
                      }, 1fr)`,
                    }}
                  >
                    <>
                      {selectedCount > 0 && (
                        <div className="flex drop-shadow-md max-sm:text-[0.5rem] transition-all flex-col gap-2 font-semibold text-sm bg-dark-750 justify-center items-center rounded-sm">
                          0.00×
                        </div>
                      )}
                      {selectedCount > 0 &&
                        Object.entries(
                          payoutTables[riskLevel][selectedCount],
                        ).map(([val, multiplier]) => (
                          <Fragment key={val}>
                            <div className="flex drop-shadow-md max-sm:text-[0.5rem] transition-all flex-col gap-2 font-semibold text-sm bg-dark-750 justify-center items-center rounded-sm">
                              {multiplier as any}×
                            </div>
                          </Fragment>
                        ))}
                    </>
                  </div>
                  <div
                    className="min-h-[40px] grid w-full font-semibold text-sm"
                    style={{
                      gridTemplateColumns: `repeat(${
                        Object.entries(payoutTables[riskLevel][selectedCount])
                          .length + 1
                      }, 1fr)`,
                    }}
                  >
                    <>
                      {selectedCount > 0 && (
                        <div className="flex drop-shadow-md max-sm:text-[0.5rem] transition-all flex-col gap-2 font-semibold text-sm bg-dark-750 justify-center items-center">
                          HIT 0
                        </div>
                      )}
                      {selectedCount > 0 &&
                        Object.entries(
                          payoutTables[riskLevel][selectedCount],
                        ).map(([hits, _]) => (
                          <Fragment key={hits}>
                            <div className="flex drop-shadow-md max-sm:text-[0.5rem] transition-all flex-col gap-2 font-semibold text-sm bg-dark-750 justify-center items-center">
                              HIT {hits}
                            </div>
                          </Fragment>
                        ))}
                    </>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center h-20 flex items-center">
                  <p className="text-xl font-semibold text-white">
                    Select 1 - 10 numbers to play
                  </p>
                </div>
              )}
            </div>
            <div className="flex absolute top-0 left-0 w-full h-full items-center justify-center">
              <div className="relative w-full h-full">
                <AnimateInOut
                  show={showResult}
                  onClick={() => setShowResult(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="cursor-pointer absolute z-10 top-0 left-0 w-full h-full items-center justify-center bg-dark-850/90"
                />
                <AnimateInOut
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  show={showResult}
                  className="bg-dark-800 z-50 relative cursor-default w-40 h-40 flex items-center justify-center border-8 border-game-green self-center"
                >
                  <div className="">
                    <div>{bet.multiplier}</div>
                    <div>{bet.profit}</div>
                  </div>
                </AnimateInOut>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
          <ProvablyFair />
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Keno</span>
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
              Enjoy the best fast-paced online keno game at Grow Game, that's
              easy to play and fun to win!
              <br />
              <br />
              In keno, you choose 1-10 numbers ranging from 1-40. After making
              your selection and placing your bets, 10 numbers are randomly
              selected, and if you've picked correctly, you will receive your
              winnings based on the pay table.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
