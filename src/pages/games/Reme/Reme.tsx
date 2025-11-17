import { SilverLockIcon } from "@/assets/icons";
import RemeGame from "./RemeCanvas";
import { BetInput, Button } from "@/components";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { updateBalance } from "@/store/slices/wallet";
import { toast } from "react-toastify";
import socket from "@/utils/constants";
import api from "@/api/axios";
import { GameType } from "@/game-types";

type Player = {
  user?: { username: string; photo: string };
  multiplier: number;
  bet: number;
  profit: number;
};

let walletBalance = 0;
export default function Reme() {
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector((state) => state.wallet);
  const auth = useAppSelector((state) => state.auth);

  // const [balance, dispatch(updateBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [message, setMessage] = useState<string | React.ReactNode>("");
  const [playerSpin, setPlayerSpin] = useState(0);
  const [houseSpin, setHouseSpin] = useState(0);
  // const [bet.stake, setStake] = useState(0);
  const [bet, setBet] = useState<Partial<Bet>>({
    gameType: GameType.REME as Bet["gameType"],
    multiplier: 1.2,
  });

  useEffect(() => {
    socket.on("REME:result", async (data) => {
      await new Promise((resolve) => {
        console.log("RUNNING-1");
        setMessage(
          <p>
            <span className="text-green-500">[{auth.user?.username}]</span> spun
            the wheel and got {data.playerSpin}
          </p>,
        );
        setPlayerSpin(data.playerSpin);
        setLoading(false);
        resolve(true);
      })
        .then(() => {
          return new Promise<void>((resolve) => {
            console.log("RUNNING-2");
            setLoading(true);
            setMessage(<p>Waiting for house spin...</p>);
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              console.log("WAITing H SPIN");
              setLoading(false);
              resolve();
            }, 1000);
          });
        })
        .then(() => {
          return new Promise<void>((resolve) => {
            console.log("RUNNING-3");
            setLoading(true);
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              setLoading(false);
              setMessage(
                <p>
                  <span className="text-red-500">[house]</span> spun the wheel
                  and got {data.houseSpin}
                </p>,
              );
              setHouseSpin(data.houseSpin);
              resolve();
            }, 3000);
          });
        })
        .then(() => {
          return new Promise<void>((resolve) => {
            console.log("RUNNING-4");
            const timeout = setTimeout(() => {
              clearTimeout(timeout);
              setLoading(false);

              setMessage(data.message);
              dispatch(updateBalance(walletBalance + data.profit));
              resolve();
            }, 2000);
          });
        })
        .finally(() => setLoading(false));
    });
  }, [auth.user?.username, dispatch]);

  useEffect(() => {
    if (!balance) return;

    walletBalance = balance;
  }, [balance]);

  const playGame = async () => {
    if (!bet.stake || isNaN(bet.stake) || bet.stake <= 0)
      return toast.error("Invalid input. Please enter a valid bet amount.");

    try {
      console.log("PLACE_BET: ", bet);
      setLoading(true);
      setMessage(<p>{auth.user?.username} is spinning...</p>);
      setGameRunning(true);

      const response = await api.post("/bet", { ...bet, socketId: socket.id });

      console.log("BET_RESPONSE", response.data);

      if (response.status !== 201) return toast.error("Couldn't play game");

      socket.emit("REME:join_game", {
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
      setGameRunning(false);
    }
  };

  const resetGame = () => {
    // setBet((prev) => ({ ...prev }));
    setGameRunning(false);
    setMessage("");
    setHouseSpin(0);
    setPlayerSpin(0);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className=" min-h-[50px] bg-dark-800 flex overflow-hidden_ flex-col-reverse w-full items-center rounded-t-md border-b border-gray-700">
          <div className="w-full h-full flex gap-1.5 p-2  justify-start overflow-hidden relative shadow-dark-800 items-center">
            <div
              className="w-[6px] bg-dark-800 h-full absolute right-0 top-0 z-[5] "
              style={{ boxShadow: "0 0 30px 40px var(--tw-shadow-color)" }}
            ></div>
          </div>
        </div>
        <div className="flex flex-row w-full h-full max-md:flex-col-reverse">
          <div className="bg-dark-800 flex justify-start flex-col max-md:w-full w-[400px]">
            <div className="text-sm font-medium">
              <div className="relative flex flex-col gap-2 p-3 text-sm font-medium text-white">
                {(!auth.isAuthenticated || loading || gameRunning) && (
                  <div
                    onClick={() => {
                      !loading && resetGame();
                    }}
                    className="absolute top-0 left-0 z-10 w-full h-full cursor-pointer bg-dark-800 opacity-70"
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
                {/* <button className="flex items-center gap-1.5 group">
                  <div className="flex items-center justify-center p-1 transition-all duration-300 border rounded-sm border-dark-600 group-hover:bg-dark-700 size-6 ease-smooth"></div>
                  <span className="text-sm font-medium">Skip Animations</span>
                </button> */}
                <Button
                  disabled={loading || gameRunning}
                  onClick={() => playGame()}
                  aria-disabled="false"
                  className="w-full text-sm rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap"
                >
                  {balance ? "play game" : "Insufficient funds"}
                </Button>
              </div>
            </div>
          </div>
          <RemeGame
            message={message}
            houseSpin={houseSpin}
            playerSpin={playerSpin}
            loading={loading}
            reset={resetGame}
          />
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
        <span className="text-2xl text-white">Reme</span>
        <div className="flex flex-row gap-2 max-md:flex-col">
          <div className="flex flex-col min-w-[300px] max-md:w-full gap-2">
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">House Edge</span>
              <span className="flex items-center gap-1.5">2.70%</span>
            </div>
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">Max Bet</span>
              <span className="flex items-center gap-1.5">
                2,000.00
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
              In this game both the house and you spin a roulette wheel.
              <br />
              <br />
              If it is a two digit number, we sum the digits (23 -&gt; 2 + 3 =
              5).
              <br />
              If the result is a two digit number (e.g 29 -&gt; 2 + 9 = 11),
              then we use the last digit of the number only, in this case 1.
              <br />
              <br />
              If your end result is bigger than the house's, you win double your
              bet. If your end result is 0 and it is not a tie, you win triple
              your bet.
              <br />
              <br />
              If the end result is a tie, or your result is smaller than the
              house's, you lose.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
