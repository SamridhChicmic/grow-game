import { SilverLockIcon } from "@/assets/icons";
import RouletteWheel from "./Wheel";
import { useCallback, useEffect, useState } from "react";
import socket from "@/utils/constants";
import { BetInput, Button } from "@/components";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import clsx from "clsx";
import { triggerNotification } from "@/store/slices/notification";
import { updateBalance } from "@/store/slices/wallet";
import { GameType } from "@/game-types";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import api from "@/api/axios";
import { UserIcon } from "@/assets/svgs";
import "./Roulette.css";

enum ColorChoice {
  red = "red",
  black = "black",
  green = "green",
}

type Player = {
  bet: string;
  user: { username: string; photo: string };
  multiplier: number;
  stake: number;
  profit?: number;
  socketId?: string;
};

type RoulettePlayer = Player & { choice: ColorChoice };
// NOTE
// type PlayersState = {
//   [K in ColorChoice]?: Player & { choice: K };
// };

export default function Roulette() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { balance } = useAppSelector((state) => state.wallet);
  const [outcome, setOutCome] = useState(5);
  const [players, setPlayers] = useState<RoulettePlayer[]>([]);
  const [rolling, setRolling] = useState(false);
  const [rollTime, setRollTime] = useState(9);
  const [bet, setBet] = useState<Partial<Bet>>({
    gameType: GameType.ROULETTE,
    multiplier: 1.2,
  });
  const [lastHundredRolls, setLastHundredRolls] = useState<ColorChoice[]>([]);

  const redPlayers = players.filter(
    (player) => player.choice === ColorChoice.red,
  );

  const greenPlayers = players.filter(
    (player) => player.choice === ColorChoice.green,
  );

  const blackPlayers = players.filter(
    (player) => player.choice === ColorChoice.black,
  );

  const showToast = useCallback((message: string, type: keyof typeof toast) => {
    if (typeof toast[type] === "function") {
      (toast[type] as any)(message);
    }
  }, []);

  useEffect(() => {
    socket.on("ROULETTE:start", (data) => {
      const outCome = data;
      console.log("ROULETTE-result: ", outCome);
      // setElements(data.elements);
      setOutCome(outCome);
    });

    socket.on("ROULETTE:rollTime", (data) => {
      setRollTime(data);
    });

    socket.on("ROULETTE:players", (data) => {
      setPlayers(data);
    });

    socket.on("ROULETTE:win", () => {
      showToast("You Won", "success");
    });

    socket.on("ROULETTE:history", (data) => {
      setLastHundredRolls(data);
    });

    return () => {
      socket.off();
    };
  }, [showToast]);

  const placeBet = async (choice: ColorChoice) => {
    if (!auth.user)
      return dispatch(
        triggerNotification({
          message: "Unauthorized! Please sign in",
          type: "warning",
          show: true,
        }),
      );

    console.log("PLACE_BET: ", bet);
    try {
      if (!bet.stake) return toast.error("please enter a valid bet amount");

      console.log({ BET: bet });
      const response = await api.post<
        "string",
        AxiosResponse,
        Partial<Bet> & { [key: string]: any }
      >("/bet", {
        ...bet,
        socketId: socket.id,
        choice,
      });

      console.log("BET_RESPONSE", response.data);

      if (response.status !== 201) return toast.error(response.data.message);

      dispatch(updateBalance(balance - bet.stake));

      toast.success("bet placed!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error({ error });
      toast.error(err.response?.data.message);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-[80rem] mx-auto">
        <div className="min-h-[50px] bg-dark-800 flex overflow-hidden flex-col-reverse w-full items-center rounded-t-md border-b border-gray-700"></div>
        <div className="flex flex-col-reverse w-full h-full">
          <div className="flex flex-col justify-start w-full bg-dark-800 max-md:w-full">
            <div
              className={clsx(
                "relative text-sm font-medium",
                (!auth.isAuthenticated || !auth.user) && "opacity-40",
              )}
            >
              <div>
                <div className="flex flex-col gap-3 p-3">
                  <div className="text-sm font-semibold">
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
                          placeholder: "Bet",
                          className:
                            "outline-none indent-5 border-none p-1 text-[0.9rem] flex-grow text-white font-medium",
                          type: "number",
                          value: (bet?.stake || 0.0)?.toFixed(2),
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 max-md:flex-col">
                    <div className="w-full rounded-md p-2.5 bg-dark-700 text-gray-400 text-sm gap-1.5 flex flex-col">
                      <div className="flex items-center justify-center gap-1 font-semibold text-white">
                        <RouletteMarble color={ColorChoice.red} />
                        <span>Win 2×</span>
                      </div>
                      <TotalBets players={redPlayers} />
                      <Button
                        aria-disabled="true"
                        className="text-sm rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap h-[38px] w-full"
                        onClick={() => placeBet(ColorChoice.red)}
                      >
                        Place Bet
                      </Button>
                      <div className="flex flex-col w-full">
                        <PlayerCountRow players={redPlayers} />
                        <div className="h-[200px] max-h-[200px] overflow-y-auto">
                          <table className="justify-between w-full">
                            <tbody>
                              {redPlayers.map((player) => (
                                <PlayerRow
                                  player={player}
                                  key={player.user.username}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="w-full rounded-md p-2.5 bg-dark-700 text-gray-400 text-sm gap-1.5 flex flex-col">
                      <div className="flex items-center justify-center gap-1 font-semibold text-white">
                        <RouletteMarble color={ColorChoice.green} />
                        <span>Win 14×</span>
                      </div>
                      <TotalBets players={greenPlayers} />
                      <Button
                        aria-disabled="true"
                        className="text-sm rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap h-[38px] w-full"
                        onClick={() => placeBet(ColorChoice.green)}
                      >
                        Place Bet
                      </Button>
                      <div className="flex flex-col w-full">
                        <PlayerCountRow players={greenPlayers} />
                        <div className="h-[200px] max-h-[200px] overflow-y-auto">
                          <table className="justify-between w-full">
                            <tbody>
                              {greenPlayers.map((player) => (
                                <PlayerRow
                                  player={player}
                                  key={player.user.username}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="w-full rounded-md p-2.5 bg-dark-700 text-gray-400 text-sm gap-1.5 flex flex-col">
                      <div className="flex items-center justify-center gap-1 font-semibold text-white">
                        <RouletteMarble color={ColorChoice.black} />
                        <span>Win 2×</span>
                      </div>
                      <TotalBets players={blackPlayers} />
                      <Button
                        aria-disabled="true"
                        className="text-sm rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap h-[38px] w-full"
                        onClick={() => placeBet(ColorChoice.black)}
                      >
                        Place Bet
                      </Button>
                      <div className="flex flex-col w-full">
                        <PlayerCountRow players={blackPlayers} />
                        <div className="h-[200px] max-h-[200px] overflow-y-auto">
                          <table className="justify-between w-full">
                            <tbody>
                              {blackPlayers.map((player) => (
                                <PlayerRow
                                  player={player}
                                  key={player.user.username}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(!auth.user || !auth.isAuthenticated) && (
                  <div className="absolute top-0 left-0 w-full h-full cursor-not-allowed z-5"></div>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-hidden bg-dark-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
            <div className="overflow-hidden">
              <div className="m-[1rem] overflow-hidden_ relative min-h-[460px] flex flex-col justify-center">
                <div className="absolute h-full w-[1px] left-[-1px] z-[2] shadow-dark-850 shadow-[1px_0_30px_60px_var(--tw-shadow)]" />
                <div className="absolute z-10 bottom-0 left-0 ">
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
                </div>
                <div className="absolute z-10 top-0 left-0 flex justify-between w-full gap-2 font-semibold max-sm:flex-col">
                  <div className="flex gap-1.5">
                    {lastHundredRolls.slice(0, 10).map((roll, i) => (
                      <RouletteMarble color={roll} key={i} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Last 100:</span>
                    <span className="flex items-center gap-1">
                      <RouletteMarble color={ColorChoice.red} />
                      {
                        lastHundredRolls.filter(
                          (roll) => roll === ColorChoice.red,
                        ).length
                      }
                    </span>
                    <span className="flex items-center gap-1">
                      <RouletteMarble color={ColorChoice.green} />
                      {
                        lastHundredRolls.filter(
                          (roll) => roll === ColorChoice.green,
                        ).length
                      }
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-[18px] h-[18px] rounded-full bg-zinc-950 shadow-gray-500/50 shadow-inner roulette-shadow flex items-center justify-center"></div>
                      {
                        lastHundredRolls.filter(
                          (roll) => roll === ColorChoice.black,
                        ).length
                      }
                    </span>
                  </div>
                </div>

                <div className="relative">
                  {!rolling && (
                    <p className="absolute -top-16 text-center w-full mx-auto text-2xl font-semibold mb-12">
                      Rolling in {Math.abs(rollTime)?.toFixed(1)}s
                    </p>
                  )}
                  <RouletteWheel outcome={outcome} setRolling={setRolling} />
                </div>
                {/* <Another /> */}
                <div className="absolute h-full w-[1px] right-[-1px] z-[2] shadow-dark-850 shadow-[1px_0_30px_60px_var(--tw-shadow)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
        <div className="flex justify-start w-full gap-3 p-3 text-gray-500">
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
      {/* </div> */}
      {/* <RouletteGame /> */}
      {/* NOTE: 2 */}
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Roulette</span>
        <div className="flex flex-row gap-2 max-md:flex-col">
          <div className="flex flex-col min-w-[300px] max-md:w-full gap-2">
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">House Edge</span>
              <span className="flex items-center gap-1.5">6%</span>
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
          </div>
          <div className="bg-dark-750 rounded-md  p-2.5 text-sm font-medium w-full text-justify leading-5">
            <span>
              Black, Red, Green. Pick a color you want to win on. The colors
              have different multipliers.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function RouletteMarble({ color }: { color: ColorChoice }) {
  return (
    <div
      className={clsx(
        `w-[18px] h-[18px] rounded-full roulette-shadow flex items-center justify-center`,
        color === ColorChoice.red
          ? "bg-red-600"
          : color === ColorChoice.black
            ? "bg-zinc-900"
            : "bg-green-500",
      )}
    />
  );
}

function PlayerRow({ player }: { player: RoulettePlayer }) {
  return (
    <tr className="text-gray-400 cursor-pointer">
      <td className="w-1/2 text-left">
        <span className="flex items-center gap-1 py-1 font-semibold">
          <div className="sc-1nayyv1-1 jXwOeI w-8 rounded-full cursor-pointer avatar overflow-clip">
            {player.user?.photo ? (
              <img
                draggable="false"
                src={player.user?.photo}
                alt="Picture"
                className="sc-1nayyv1-0 kedPqA"
              />
            ) : (
              <UserIcon className="w-full aspect-square p-2_s !stroke-white fill-white" />
            )}
          </div>
          {player.user.username}
        </span>
      </td>
      <td className="w-1/2 text-right">
        <span className="flex items-center justify-end gap-1 font-semibold">
          {player.stake}
          <img
            src={SilverLockIcon}
            width="18"
            height="18"
            className="sc-x7t9ms-0 dnLnNz"
          />
        </span>
      </td>
    </tr>
  );
}

function TotalBets({ players }: { players: RoulettePlayer[] }) {
  console.log({ players });
  return (
    <div className="flex justify-center items-center font-medium gap-1.5">
      <span>Total bet:</span>
      <span className="flex items-center gap-1">
        0.00
        <img
          src={SilverLockIcon}
          width="18"
          height="18"
          className="sc-x7t9ms-0 dnLnNz"
        />
      </span>
    </div>
  );
}

function PlayerCountRow({ players }: { players: RoulettePlayer[] }) {
  return (
    <div className="flex items-center justify-between w-full font-semibold text-gray-400">
      <span>
        <span className="online-circle"></span>
        {players.length} Player{players.length === 1 ? "" : "s"}
      </span>
      <span className="flex items-center gap-1">
        {players.reduce((sum, player) => sum + player.stake, 0)}
        <img
          src={SilverLockIcon}
          width="18"
          height="18"
          className="sc-x7t9ms-0 dnLnNz"
        />
      </span>
    </div>
  );
}
