import { useEffect, useState } from "react";

import { LinesType } from "../../@types";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { BetInput, Button, Select } from "@/components";
import { GameType } from "@/game-types";
import { updateBalance } from "@/store/slices/wallet";
import { toast } from "react-toastify";
import api from "@/api/axios";
import socket from "@/utils/constants";

interface PlinkoBetActions {
  lines: LinesType;
  onRunBet: (
    betValue: number,
    callback: (result: { profit: number; multiplier: number }) => void,
  ) => void;
  onChangeLines: (lines: LinesType) => void;
  inGameBallsCount: number;
}

let walletBalance = 0;
let betID = "";

export function BetActions({
  lines,
  onRunBet,
  onChangeLines,
  inGameBallsCount,
}: PlinkoBetActions) {
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [betId, setBetId] = useState("");
  const [bet, setBet] = useState<Partial<Bet>>({
    gameType: GameType.PLINKO as Bet["gameType"],
    multiplier: 1.2,
    stake: 0,
  });

  const { balance } = useAppSelector((state) => state.wallet);
  const auth = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!balance) return;

    walletBalance = balance;
  }, [balance]);

  const maxLinesQnt = 16;
  const linesOptions: number[] = [];
  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i);
  }

  function handleChangeLines(val: any) {
    if (!auth.isAuthenticated || loading) return;

    onChangeLines(Number(val) as LinesType);
  }

  async function handleRunBet() {
    if (!auth.isAuthenticated || loading) return;
    // setLoading(true);
    // setGameRunning(true)
    if (inGameBallsCount >= 15) return;
    if (bet.stake! > walletBalance) {
      setBet((prev) => ({ ...prev, stake: walletBalance }));
      return;
    }
    console.log("ON_RUN_BET");
    onRunBet(bet.stake!, endGame);
    if (bet.stake! <= 0) return;
    // await decrementCurrentBalance(bet.stake!);
    // await endGame();
    dispatch(updateBalance(walletBalance - bet.stake!));
  }

  const placeBet = async () => {
    if (!bet.stake) return toast.error("Invalid bet input");

    if (bet?.stake > balance) {
      // setMessage("Insufficient balance");

      return toast.error("Insufficient balance");
    }

    // setDelay(true);
    // setTimeout(() => {
    //   setDelay(false);
    // }, 3000);

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

      handleRunBet();
      // setGameRunning(true);
      toast.success("Bet placed");
    } catch (error) {
      console.error("PLACE_BET:LIMBO", error);
      return toast.error("An error occurred");
    }
  };

  const endGame = async ({
    multiplier,
    profit,
  }: {
    profit: number;
    multiplier: number;
  }) => {
    console.log("END_GAME: ", { betId, profit: bet.profit });
    try {
      const response = await api.post("/bet/result", {
        ...bet,
        profit,
        multiplier,
        id: betID,
      });
      const data = response.data;
      console.log({ data });
      dispatch(updateBalance(balance + profit));
      // resetGame();
      toast.dark("Complete");
    } catch (error) {
      console.error("END_GAME: ", { error });
    }
  };

  return (
    <div className="bg-dark-800 flex justify-start flex-col max-md:w-full w-[400px]">
      <div className="text-sm font-medium">
        <div className="relative flex flex-col gap-2 p-3 text-sm font-medium text-white">
          {(!auth.isAuthenticated || loading || gameRunning) && (
            <div
              onClick={() => {
                // !loading && resetGame();
              }}
              className="absolute top-0 left-0 z-10 w-full h-full cursor-pointer bg-dark-800 opacity-70"
            />
          )}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-white">Bet Amount</span>
            <BetInput
              inputProps={{
                disabled: delay,
                onChange(e) {
                  setBet((prev) => ({
                    ...prev,
                    stake: parseFloat(e.target.value),
                  }));
                },
                value: bet.stake || 0,
              }}
            />
          </div>
          <Select
            label="Risk"
            options={linesOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            getValue={(e) => handleChangeLines(e)}
            value={lines}
          />
          <Button
            disabled={loading || delay || gameRunning}
            onClick={placeBet}
            aria-disabled="false"
            className="w-full text-sm rounded-sm sc-1xm9mse-0 fzZXbl text-nowrap"
          >
            {balance ? "play game" : "Insufficient funds"}
          </Button>
        </div>
      </div>
    </div>
  );
}
