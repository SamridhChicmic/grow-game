import { Heads, SilverLockIcon, Tails } from "@/assets/icons";
import { AnimateInOut, AnimatedList, BetInput, Button } from "@/components";
import "./coinflip.css";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { updateBalance } from "@/store/slices/wallet";
import { GameType } from "@/game-types";
import { toast } from "react-toastify";
import socket from "@/utils/constants";
import api from "@/api/axios";

enum GameState {
  over = "over",
  continue = "continue",
  flipping = "flipping",
  bet = "bet",
}

let walletBalance = 0;
export default function CoinFlip() {
  const auth = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.wallet);
  useEffect(() => {
    if (!balance) return;

    walletBalance = balance;
  }, [balance]);

  const dispatch = useAppDispatch();

  const [bet, setBet] = useState<
    Partial<Bet & { choice: "H" | "T"; socketId: string }>
  >({
    gameType: GameType.COINFLIP as Bet["gameType"],
  });
  const [loading, setLoading] = useState(false);
  const [, setMessage] = useState("");
  const [result, setResult] = useState<typeof bet.choice | null>(null);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.over);
  const [multipliers, setMultipliers] = useState<
    { value: number; revealed: boolean; choice: typeof bet.choice }[]
  >([]);
  const [currentMultiplier, setCurrentMultiplier] = useState<number | null>(
    null,
  );

  const [showProfit, setShowProfit] = useState<boolean | null>(null);

  const resetMultipliers = useCallback(() => {
    socket.emit("COINFLIP:get_multipliers");
  }, []);

  const handleCashOut = () => {
    continueFlip(false);
    if (bet.profit) dispatch(updateBalance(walletBalance + bet.profit));
    resetGame();
  };

  const updateMultipliers = (round) => {
    console.log({ round });
    setMultipliers((prevMultipliers) =>
      prevMultipliers.map((multiplier, index) =>
        round - 1 === index
          ? { ...multiplier, revealed: true, choice: bet.choice }
          : multiplier,
      ),
    );
  };

  const resetGame = useCallback(() => {
    // setBet((prev) => ({ ...prev, stake: 0, choice: undefined }));
    // setGameState(GameState.over);
    setShowProfit(null);
    resetMultipliers();
    setCurrentMultiplier(multipliers[0]?.value);
    setLoading(false);
    setMessage("");
    setRound(0);
  }, []);

  useEffect(() => {
    // if (gameState === GameState.over) {
    //   resetMultipliers();
    // }

    socket.on("COINFLIP:multipliers", (data) => {
      if (gameState !== GameState.over) return;
      const mtpliers: typeof multipliers = data.map((multiplier) => ({
        choice: "H",
        revealed: false,
        value: multiplier,
      }));
      console.log({ mtpliers });
      setMultipliers(mtpliers);
      setCurrentMultiplier(data[0]);
    });

    socket.on("COINFLIP:result", (data) => {
      if (!bet.choice) return;
      console.log("RESULT: ", { data, bet });
      setLoading(false);
      setResult(data.result);
      setRound(data.round);
      setBet((prev) => ({ ...prev, profit: data.profit }));
      setMessage(data.message);
      setCurrentMultiplier(data.currentMultiplier);
      updateMultipliers(data.round);

      if (data.result === bet.choice) {
        setGameState(GameState.continue);
      } else {
        setShowProfit(false);
        setGameState(GameState.bet);
      }
    });

    socket.on("COINFLIP:error", (data) => {
      setResult(data);
      setLoading(false);
      toast(data);
      setGameState(GameState.over);
    });
  }, [bet]);

  const continueFlip = (confirm: boolean) => {
    socket.emit("COINFLIP:continue_response", confirm, socket.id, bet.choice);
  };

  const initializeBet = () => {
    if (!bet.stake || bet.stake <= 0 || isNaN(bet.stake) || bet.stake <= 0)
      return toast.error("Invalid input. Please enter a valid bet amount.");
    if (bet.stake > balance) return toast.error("Insufficient Balance.");
    resetGame();
    setGameState(GameState.bet);
  };

  const placeBet = async (side: "H" | "T") => {
    if (!bet.stake || bet.stake <= 0 || isNaN(bet.stake) || bet.stake <= 0)
      return toast.error("Invalid input. Please enter a valid bet amount.");
    if (bet.stake > balance) return toast.error("Insufficient Balance.");
    if (!side) return toast.error("please select either head or tail");

    if (![GameState.bet, GameState.continue].includes(gameState))
      return toast.error("Place bet and amount first");

    setLoading(true);

    setBet((prev) => ({ ...prev, choice: side }));

    try {
      if (gameState === GameState.continue) {
        console.log("CONTINUE!");
        return continueFlip(true);
      }

      console.log("PLACE_BET: ", bet, socket.id);
      setLoading(true);
      setGameState(GameState.flipping);

      const response = await api.post("/bet", {
        ...bet,
        socketId: socket.id,
        choice: side,
      });

      console.log("BET_RESPONSE", response.data);

      if (response.status !== 201) return toast.error("Couldn't play game");

      socket.emit("COINFLIP:join_game", {
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
      setGameState(GameState.over);
    }
  };

  useEffect(() => {
    console.log({ round });
  }, [round]);

  return (
    <>
      <div className="flex_ flex-col_ w-full max-w-[80rem] mx-auto">
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
            <div className="p-3 text-sm font-medium">
              <div
                className={clsx(
                  "relative flex flex-col gap-2 text-sm",
                  (!auth.isAuthenticated || gameState === GameState.flipping) &&
                    "opacity-40",
                )}
              >
                {!auth.isAuthenticated ||
                  ((loading || gameState === GameState.flipping) && (
                    <div className="absolute top-0 left-0 w-full h-full cursor-not-allowed z-50" />
                  ))}

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
                <div className="flex flex-col w-full gap-1 ">
                  <span>Coin Side</span>
                  <div className="flex gap-2">
                    <Button
                      disabled={
                        showProfit === false
                          ? true
                          : loading ||
                            ![GameState.bet, GameState.continue].includes(
                              gameState,
                            )
                      }
                      type="button"
                      onClick={() => placeBet("H")}
                      aria-disabled="true"
                      className={clsx(
                        "sc-1xm9mse-0 fzZXbl text-sm rounded-sm text-nowrap w-full max-h-[40px]",
                        bet.choice === "T" && "opacity-40",
                      )}
                    >
                      <img
                        alt="Heads"
                        src={Heads}
                        draggable="false"
                        className="rendering-pixelated w-full max-w-[30px]"
                      />
                    </Button>
                    <Button
                      disabled={
                        showProfit === false
                          ? true
                          : loading ||
                            ![GameState.bet, GameState.continue].includes(
                              gameState,
                            )
                      }
                      type="button"
                      onClick={() => placeBet("T")}
                      aria-disabled="true"
                      className={clsx(
                        "sc-1xm9mse-0 fzZXbl text-sm rounded-sm text-nowrap w-full max-h-[40px]",
                        bet.choice === "H" && "opacity-40",
                      )}
                    >
                      <img
                        alt="Tails"
                        src={Tails}
                        draggable="false"
                        className="rendering-pixelated w-full max-w-[30px]"
                      />
                    </Button>
                  </div>
                  <AnimateInOut
                    show={
                      showProfit === false
                        ? false
                        : [
                            GameState.bet,
                            GameState.continue,
                            GameState.flipping,
                          ].includes(gameState)
                    }
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ type: "keyframes" }}
                    className="flex_ flex-col_ w-full pt-[5px] space-y-1 max-h-[15rem] overflow-auto rounded-b-lg px-1 bg-dark-700 py-1"
                  >
                    <p>Total Profit: {bet.profit?.toFixed(2)}</p>
                    <BetInput
                      inputProps={{
                        value: "",
                      }}
                      trailing={<></>}
                    />
                  </AnimateInOut>
                </div>
                <Button
                  loading={loading}
                  disabled={loading || gameState === GameState.flipping}
                  type="submit"
                  onClick={() => {
                    [GameState.bet, GameState.over].includes(gameState)
                      ? initializeBet()
                      : handleCashOut();
                  }}
                  aria-disabled="true"
                  className="w-full text-sm rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap"
                >
                  {[GameState.bet, GameState.over].includes(gameState)
                    ? "Place Bet"
                    : "Cash Out"}
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden bg-dark-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
            <div className="relative w-full h-[550px] max-sm:max-h-[375px] flex flex-col">
              <div className="flex flex-col justify-between flex-grow w-full h-full">
                <div className="relative flex justify-center flex-grow ">
                  <div className="flex items-center justify-center w-full max-md:justify-start">
                    <div
                      className="flex border-2 border-gray-700
                      max-md:rounded-r max-md:rounded-none max-md:border-l-0 max-md:max-w-[100px]
                      w-[200px] max-sm:max-w-[100px]
                       rounded-sm p-4 flex-col items-center gap-1.5 uppercase text-gray-500 font-semibold text-2xl"
                    >
                      <span className="text-3xl max-sm:text-[1rem] max-md:text-2xl">
                        {round}
                      </span>
                      <span className="max-md:text-xl max-sm:text-[0.75rem]">
                        HITS
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center w-full p-1">
                    <div className="w-full h-full absolute_ coinFlipCoin">
                      <div
                        className={clsx(
                          "coin !w-2/3 aspect-square",
                          loading ? "flip" : "nope",
                        )}
                      >
                        <img
                          src={result === "T" ? Tails : Heads}
                          alt="Heads"
                          className=""
                          style={{
                            imageRendering: "pixelated",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-full max-md:justify-end">
                    <div
                      className="flex border-2 border-gray-700
                      max-md:rounded-l max-md:rounded-none max-md:border-r-0 max-md:max-w-[150px]
         ax-sm:max-w-[100px]
                      w-[200px] rounded-sm p-4 flex-col items-center gap-1.5 uppercase text-gray-500 font-semibold text-2xl"
                    >
                      <span className="text-4xl max-md:text-2xl max-sm:text-[1rem]">
                        {currentMultiplier}×
                      </span>
                      <span className="max-md:text-xl max-sm:text-[0.75rem]">
                        Multiplier
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex w-full gap-3 px-3 pb-2 overflow-x-auto">
                    {multipliers.map((multiplier, i) => (
                      <Multiplier key={i} multiplier={multiplier} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
          <div className="flex justify-start w-full gap-3 p-3 text-gray-500">
            <button className="transition-colors hover:text-white font-semibold text-sm flex items-center gap-0.5">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM694.5 340.7L481.9 633.4a16.1 16.1 0 0 1-26 0l-126.4-174c-3.8-5.3 0-12.7 6.5-12.7h55.2c5.1 0 10 2.5 13 6.6l64.7 89 150.9-207.8c3-4.1 7.8-6.6 13-6.6H688c6.5.1 10.3 7.5 6.5 12.8z"></path>
              </svg>
              <span>Provably Fair</span>
            </button>
            <button className="text-sm flex gap-0.5 font-semibold">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 176a80 80 0 1080 80 80.24 80.24 0 00-80-80zm172.72 80a165.53 165.53 0 01-1.64 22.34l48.69 38.12a11.59 11.59 0 012.63 14.78l-46.06 79.52a11.64 11.64 0 01-14.14 4.93l-57.25-23a176.56 176.56 0 01-38.82 22.67l-8.56 60.78a11.93 11.93 0 01-11.51 9.86h-92.12a12 12 0 01-11.51-9.53l-8.56-60.78A169.3 169.3 0 01151.05 393L93.8 416a11.64 11.64 0 01-14.14-4.92L33.6 331.57a11.59 11.59 0 012.63-14.78l48.69-38.12A174.58 174.58 0 0183.28 256a165.53 165.53 0 011.64-22.34l-48.69-38.12a11.59 11.59 0 01-2.63-14.78l46.06-79.52a11.64 11.64 0 0114.14-4.93l57.25 23a176.56 176.56 0 0138.82-22.67l8.56-60.78A11.93 11.93 0 01209.94 26h92.12a12 12 0 0111.51 9.53l8.56 60.78A169.3 169.3 0 01361 119l57.2-23a11.64 11.64 0 0114.14 4.92l46.06 79.52a11.59 11.59 0 01-2.63 14.78l-48.69 38.12a174.58 174.58 0 011.64 22.66z"></path>
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Coin Flip</span>
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
              The mechanics of playing this game are simple, and you can toss a
              coin and choose between H or T.
              <br />
              <br />
              Once you've landed on a winning bet, you have the discretion to
              resume flipping the coin for extra rounds, which, in turn,
              translates to extra prizes and higher payouts.
              <br />
              <br />
              Not only that, but the multipliers also keep increasing as you
              keep winning throughout every coin flip.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Multiplier({
  multiplier,
}: {
  multiplier: {
    revealed: boolean;
    value: number;
    choice: "H" | "T" | undefined;
  };
}) {
  return (
    <div
      className={clsx(
        "min-w-[100px] max-w-[100px] relative select-none  rounded-full",
      )}
    >
      <img
        draggable="false"
        width="100"
        alt="Coin"
        style={{ imageRendering: "pixelated" }}
        className={clsx(
          "w-full h-auto rendering-pixelated",
          !multiplier.revealed ? "brightness-0 opacity-20" : "",
        )}
        src={multiplier.choice === "H" ? Heads : Tails}
      />
      <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500 font-semibold text-[1.15rem]">
        {!multiplier.revealed && `${multiplier.value}×`}
      </span>
    </div>
  );
}
