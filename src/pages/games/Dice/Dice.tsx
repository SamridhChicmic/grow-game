import { SilverLockIcon } from "@/assets/icons";
import DiceGame from "./DiceGame";
import { BetInput, Button, ProvablyFair } from "@/components";
import socket from "@/utils/constants";
import { toast } from "react-toastify";
import { updateBalance } from "@/store/slices/wallet";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { useCallback, useEffect, useState } from "react";
import { GameType } from "@/game-types";
import api from "@/api/axios";
import clsx from "clsx";
import { GamePhase, calculateMultiplier } from ".";

let walletBalance = 0;
export default function Dice() {
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector((state) => state.wallet);
  const auth = useAppSelector((state) => state.auth);

  // const [balance, dispatch(updateBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [gamePhase, setGamePhase] = useState(GamePhase.bet);
  // const [bet.stake, setStake] = useState(0);
  const [bet, setBet] = useState<
    Partial<Bet> & {
      direction: "over" | "under";
      rangeValue: number;
    }
  >({
    gameType: GameType.DICE as Bet["gameType"],
    multiplier: calculateMultiplier(50, "greater"),
    rangeValue: 50,
    direction: "over",
  });
  const [result, setResult] = useState(50);

  const setMultiplier = (value: number) => {
    setBet((prev) => ({ ...prev, multiplier: value }));
  };

  const setRange = (value: number) => {
    setBet((prev) => ({ ...prev, rangeValue: value }));
  };

  useEffect(() => {
    console.log("RANGE_VALUE: ", bet.rangeValue);
  }, [bet.rangeValue]);

  useEffect(() => {
    socket.on("DICE:result", (data) => {
      setLoading(false);
      console.log("DICE:result", data);
      setResult(data?.result);
      console.log("PROFIT: ", data.profit);
      setGamePhase(GamePhase.result);
      dispatch(updateBalance(walletBalance + data.profit));
    });

    socket.on("DICE:error", () => {
      setGamePhase(GamePhase.result);
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!balance) return;

    walletBalance = balance;
  }, [balance]);

  const switchDirection = useCallback(() => {
    setBet((prev) => ({
      ...prev,
      direction: prev.direction === "over" ? "under" : "over",
    }));
  }, []);

  const playGame = async () => {
    if (!bet.stake || isNaN(bet.stake) || bet.stake <= 0)
      return toast.error("Invalid input. Please enter a valid bet amount.");

    try {
      console.log("PLACE_BET: ", bet);
      setLoading(true);
      setGamePhase(GamePhase.running);

      const response = await api.post("/bet", { ...bet, socketId: socket.id });

      console.log("BET_RESPONSE", response.data);

      if (response.status !== 201) return toast.error("Couldn't play game");

      socket.emit("DICE:join_game", {
        player: {
          user: { username: auth.user?.username, photo: auth.user?.photo },
        } as Player,
        socketId: socket.id,
      });

      dispatch(updateBalance(balance - bet.stake));

      toast.success("bet placed!");
    } catch (error) {
      toast.error("Could not place bet!");
      setLoading(false);
      setGamePhase(GamePhase.result);
    }
  };

  const resetGame = () => {
    // setBet((prev) => ({ ...prev, stake: 0 }));
    setGamePhase(GamePhase.bet);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="min-h-[50px] bg-dark-800 flex overflow-hidden flex-col-reverse w-full items-center rounded-t-md border-b border-gray-700">
          <div className="w-full h-full flex gap-1.5 p-2 justify-start overflow-hidden relative shadow-dark-800 items-center">
            {/* <div
              className="w-[6px] bg-dark-800 h-full absolute right-0 top-0 z-[5]"
              style={{ boxShadow: "0 0 30px 40px var(--tw-shadow-color)" }}
            ></div> */}
          </div>
        </div>
        <div className="flex flex-row w-full h-full max-md:flex-col-reverse">
          <div className="bg-dark-800 flex justify-start flex-col max-md:w-full w-[400px]">
            <div className="text-sm font-medium">
              <div
                className={clsx(
                  "relative flex flex-col gap-2 p-3",
                  !auth.isAuthenticated && "opacity-40",
                )}
              >
                {(!auth.isAuthenticated ||
                  loading ||
                  gamePhase === GamePhase.running) && (
                  <div
                    onClick={() => {
                      !loading && resetGame();
                    }}
                    className="absolute top-0 left-0 z-10 w-full h-full bg-dark-800 opacity-70"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-white">
                    Bet Amount
                  </span>
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
                </div>
                <Button
                  disabled={loading || gamePhase === GamePhase.running}
                  aria-disabled="true"
                  className="text-sm w-full sc-1xm9mse-0 fzZXbl text-nowrap"
                  onClick={playGame}
                  loading={loading}
                >
                  Place Bet
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden bg-dark-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
            <DiceGame
              setMultiplier={setMultiplier}
              multiplier={bet.multiplier!}
              rangeValue={bet.rangeValue}
              setRange={setRange}
              roll={bet.direction}
              switchDirection={switchDirection}
              result={result}
              gamePhase={gamePhase}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
          <ProvablyFair />
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Dice</span>
        <div className="flex flex-row gap-2 max-md:flex-col">
          <div className="flex flex-col min-w-[300px] max-md:w-full gap-2">
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">House Edge</span>
              <span className="flex items-center gap-1.5">4.00%</span>
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
          <div className="bg-dark-750 rounded-md p-2.5 text-sm font-medium w-full text-justify leading-5">
            <span>
              Dice is a Grow Game game and is a simple game of chance with
              easy-to-understand betting mechanics for players to bet with.
              <br />
              <br />
              With betting games like dice, the concept is simple and the
              possibilities are endless with a variety of betting options
              available to players to help manage their bankroll and implement
              dice betting strategies to their gameplay.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
