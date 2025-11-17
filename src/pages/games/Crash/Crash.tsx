import Chart from "./Chart";
import { useEffect, useState } from "react";
import socket from "@/utils/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { SilverLockIcon } from "@/assets/icons";
import { UserIcon, XClose } from "@/assets/svgs";
import clsx from "clsx";
import { BetInput, Button, Input, UserProfile } from "@/components";
import { toast } from "react-toastify";
import { triggerModal } from "@/store/slices/modal";
import api from "@/api/axios";
import { updateBalance } from "@/store/slices/wallet";
import { GameType } from "@/game-types";
import { ProvablyFair } from "@/components";
import { triggerNotification } from "@/store/slices/notification";
import { AxiosError } from "axios";
import { GamePhase } from ".";

type Player = {
  user?: { username: string; photo: string };
  multiplier: number;
  stake: number;
  profit: number;
};

export default function Crash() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.wallet);

  const [players, setPlayers] = useState<Player[]>([]);
  const [bet, setBet] = useState<Partial<Bet>>({
    gameType: GameType.CRASH,
    multiplier: 1.2,
  });

  const [player, setPlayer] = useState<Player>({
    stake: 0,
    multiplier: 1.2,
    profit: 0,
    user: auth.user
      ? { username: auth.user?.username, photo: auth.user?.photo }
      : undefined,
  });

  const [history, setHistory] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState(GamePhase.bet);

  const totalBets = players
    .map((player) => player.stake)
    .reduce((acc, curr) => acc + curr, 0);

  console.log({ totalBets, bets: players.map((player) => player.stake) });

  const joinGame = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!auth.user && player.user)
      return dispatch(
        triggerNotification({
          message: "Unauthorized! Please sign in",
          type: "warning",
          show: true,
        }),
      );

    console.log("PLACE_BET: ", bet);
    try {
      if (!(player.stake && bet.stake))
        return toast.error("please enter a valid bet amount");

      console.log({ BET: bet });
      const response = await api.post("/bet", bet);

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

  useEffect(() => {
    socket.emit("CRASH:get_players");
    socket.emit("CRASH:get_history");

    socket.on("CRASH:players", (players: Player[]) => {
      console.log("CRASH_PLAYERS: ", { players });
      setPlayers(players);
    });

    socket.on("CRASH:history", (data) => {
      setHistory(data);
    });

    socket.on("CRASH:win", (players: Player[]) => {
      console.log("YOU WON! ", players);
      toast.success("You won!");
    });

    // socket.on("CRASH:end", (data) => {
    //   console.log("CRASH:End", { data });
    // });

    // socket.on("CRASH:end", (data) => {
    //   console.log("CRASH:End", { data });
    // });

    // return () => {
    //   socket.off("join_chat");
    // };
  }, []);

  const PlayerRow = ({ player }: { player: Player }) => (
    <tr
      onClick={() => {
        dispatch(
          triggerModal({
            children: <UserProfile username={player.user?.username || ""} />,
          }),
        );
      }}
      className="text-[0.8rem] text-gray-400 font-semibold cursor-pointer hover:bg-dark-600 transition-colors "
    >
      <td className="pl-1.5 rounded-l-sm text-left w-[20%]">
        <div className="flex gap-1.5 items-center">
          {/* <div className="w-6 h-6 sc-1nayyv1-1 kAmJof">
            <img
              draggable="false"
              src={player.user?.photo}
              alt={player.user?.username}
              className="w-full h-full sc-1nayyv1-0 kedPun"
            />
          </div> */}
          <figure className="w-8 rounded-full cursor-pointer sc-1nayyv1-1 avatar overflow-clip">
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
          </figure>
          {player.user?.username}
        </div>
      </td>
      <td className="text-center">{player.multiplier || "-"}</td>
      <td className="text-center">
        <span className="flex items-center justify-center gap-1">
          {player.stake || 0.65}
          <img
            src={SilverLockIcon}
            width="18"
            height="18"
            className="sc-x7t9ms-0 dnLnNz"
          />
        </span>
      </td>
      <td className="rounded-r-sm text-right h-[40px] pr-1.5">
        <span className="flex items-center justify-end gap-1">
          {player.profit || "-"}
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

  return (
    // <div className="w-full  overflow-hidden h-full-app max-sm:max-h-[calc(var(--app-height)-var(--header-height)-var(--bottom-height))]">
    //   <div className="flex flex-col items-center flex-grow w-full h-full overflow-y-auto">
    <>
      <div className="flex flex-col w-full gap-3 p-5 max-w-[80rem] mx-auto rounded-md bg-dark-800 ">
        <div className="grid grid-cols-6 gap-2">
          {history.map((item, i) => (
            <button
              key={i}
              className={clsx(
                "flex items-center justify-center p-2 text-md font-semibold rounded-sm bg-dark-700",
                item > 1 ? "bg-game-green" : "",
              )}
            >
              {item}×
            </button>
          ))}
        </div>
        <div className="flex flex-row-reverse w-full gap-3 max-xl:flex-col-reverse">
          <div className="relative flex flex-col w-full max-w-[350px] max-xl:max-w-full bg-dark-750 rounded-sm p-2.5">
            <div className="flex justify-between w-full text-sm font-semibold">
              <div className="flex items-center gap-1 text-gray-500">
                <span className="online-circle"></span>
                <span>{players.length} players</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Total bets:</span>
                <span className="flex items-center gap-1 text-white">
                  {totalBets}
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </div>
            </div>
            <div className="max-h-[600px] max-sm:max-h-[300px] overflow-y-auto mt-1.5">
              <div className="pr-1.5">
                <table className="w-full border-separate border-spacing-0 border-spacing-y-1">
                  <thead>
                    <tr className="text-sm text-gray-500 uppercase">
                      <th className="h-[20px] rounded-l-sm text-left pl-1.5">
                        Player
                      </th>
                      <th>Multi</th>
                      <th>Bet</th>
                      <th className="rounded-r-sm text-right pr-1.5">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <PlayerRow player={player} key={player.user?.username} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div
              className="min-h-[450px] overflow-hidden relative w-full rounded-md"
              id="crashRenderer"
            >
              <div className="relative top-0 left-0 flex items-center justify-center w-full overflow-hidden rounded-md pointer-events-none z-1 bg-dark-750">
                <Chart gamePhase={gamePhase} setGamePhase={setGamePhase} />
              </div>
              <ProvablyFair />
            </div>
            <form
              onSubmit={joinGame}
              // NOTE: Opacity, Relative
              className={clsx(
                "relative flex flex-col gap-2 p-3 text-sm font-medium rounded-sm",
                auth.isAuthenticated ? "opacity-100" : "opacity-40",
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">
                  Bet Amount
                </span>
                {/* <div className="relative flex items-center w-full">
                      <div className="absolute flex items-center gap-2 left-2">
                        <img
                          src={SilverLockIcon}
                          width="18"
                          height="18"
                          className="sc-x7t9ms-0 grLtgJ"
                        />
                      </div>
                      <Input
                        placeholder="Bet"
                        className="outline-none indent-5 border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
                        type="number"
                        value={(player?.stake || 0.0)?.toFixed(2)}
                        onChange={(e) => {
                          setPlayer((prev) => ({
                            ...prev,
                            stake: parseFloat(e.target.value),
                          }));

                          setBet((prev) => ({
                            ...prev,
                            stake: parseFloat(e.target.value),
                          }));
                        }}
                      />
                      <div className="absolute flex items-center gap-2 right-2">
                        <div className="flex gap-2.5 font-semibold">
                          <button
                            type="button"
                            className="transition-colors hover:text-white"
                          >
                            1/2
                          </button>
                          <button
                            type="button"
                            className="transition-colors hover:text-white"
                          >
                            2×
                          </button>
                        </div>
                      </div>
                    </div> */}
                <BetInput
                  inputProps={{
                    onChange(e) {
                      setPlayer((prev) => ({
                        ...prev,
                        stake: parseFloat(e.target.value),
                      }));

                      setBet((prev) => ({
                        ...prev,
                        stake: parseFloat(e.target.value),
                      }));
                    },
                    placeholder: "Bet",
                    className:
                      "outline-none indent-5 border-none p-1 text-[0.9rem] flex-grow text-white font-medium",
                    type: "number",
                    value: (player?.stake || 0.0)?.toFixed(2),
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white">
                  Auto Cashout
                </span>
                <div className="relative flex items-center w-full">
                  <div className="absolute flex items-center gap-2 left-2">
                    <XClose className="!stroke-gray-400" />
                  </div>
                  <Input
                    className="outline-none indent-5 border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
                    type="text"
                    value={(player?.multiplier || 0.0)?.toFixed(2)}
                    onChange={(e) => {
                      setPlayer((prev) => ({
                        ...prev,
                        multiplier: parseFloat(e.target.value),
                      }));

                      setBet((prev) => ({
                        ...prev,
                        multiplier: parseFloat(e.target.value),
                      }));
                    }}
                  />
                  <div className="absolute flex items-center gap-2 right-2">
                    <div className="flex gap-2.5 font-semibold">
                      <button className="transition-colors hover:text-white">
                        1/2
                      </button>
                      <button className="transition-colors hover:text-white">
                        2×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                aria-disabled="true"
                id="placeBet"
                // NOTE: Min-h, Max-h
                className="sc-1xm9mse-0 fzZXbl w-full min-h-[40px] max-h-[40px] text-sm rounded-sm text-nowrap"
              >
                <span>Place Bet</span>
              </Button>
              {!auth.isAuthenticated && (
                <div className="absolute top-0 left-0 w-full h-full cursor-not-allowed z-5" />
              )}
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800 ">
        <span className="text-2xl text-white">Crash</span>
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
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">Max Multiplier</span>
              <span className="flex items-center gap-1.5">1,000.00×</span>
            </div>
          </div>
          <div className="bg-dark-750 rounded-md  p-2.5 text-sm font-medium w-full text-justify leading-5">
            <span>
              Predict the multiplier in this quick and simplistic odds-based
              game, Crash!
              <br />
              <br />
              Take on the house with a variety of different strategies to defeat
              the house and take home some huge Diamond Lock winnings against
              the house!
              <br />
              <br />
              Crash is a simple game of chance where the player picks the
              cashout amount for a betting round as the multiplier flies through
              a grid. The cashout amount climbs until the multiplier and as long
              as the player's cashout amount is lower than the crash value, the
              player can win a payout.
            </span>
          </div>
        </div>
      </div>
    </> //     <div className="w-full">{/* <Bets /> */}</div>
    //   </div>
    //   <footer className="flex justify-center w-full text-sm font-medium text-gray-400">
    //     <div className="p-3 max-w-page"></div>
    //   </footer>
    // </div>
  );
}
