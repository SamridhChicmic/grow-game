export type RouletteChoice = "red" | "black" | "green";

type RoulettePlayerState = {
  socketId: string;
  stake: number;
  choice: RouletteChoice;
  user: {
    username: string;
    photo: string;
  };
};

type SocketDispatcher = {
  id: string;
  dispatch: (event: string, ...args: any[]) => void;
};

const ROULETTE_MULTIPLIERS: Record<RouletteChoice, number> = {
  red: 2,
  black: 2,
  green: 14,
};

const ROULETTE_SEQUENCE = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];

const ROULETTE_COLORS: Record<number, RouletteChoice> = {
  0: "green",
  1: "red",
  2: "red",
  3: "red",
  4: "red",
  5: "red",
  6: "red",
  7: "red",
  8: "black",
  9: "black",
  10: "black",
  11: "black",
  12: "black",
  13: "black",
  14: "black",
};

const MAX_HISTORY = 100;
const COUNTDOWN_SECONDS = 5;

const rouletteState: {
  players: RoulettePlayerState[];
  history: RouletteChoice[];
  rolling: boolean;
  countdown?: ReturnType<typeof setInterval>;
} = {
  players: [],
  history: [],
  rolling: false,
  countdown: undefined,
};

const normalizeChoice = (choice: string | undefined): RouletteChoice => {
  const normalized = choice?.toLowerCase();
  if (normalized === "green") return "green";
  if (normalized === "black") return "black";
  return "red";
};

export const addRouletteBet = (player: RoulettePlayerState) => {
  const index = rouletteState.players.findIndex(
    (existing) =>
      existing.socketId === player.socketId && existing.choice === player.choice,
  );
  if (index >= 0) {
    rouletteState.players[index] = player;
  } else {
    rouletteState.players = [...rouletteState.players, player];
  }
};

export const getRoulettePlayers = () =>
  rouletteState.players.map((player) => ({
    bet: player.choice,
    user: player.user,
    multiplier: ROULETTE_MULTIPLIERS[player.choice],
    stake: player.stake,
    choice: player.choice,
    socketId: player.socketId,
  }));

export const getRouletteHistory = () => rouletteState.history;

const finishRouletteRound = (socket: SocketDispatcher) => {
  const outcomeNumber =
    ROULETTE_SEQUENCE[
      Math.floor(Math.random() * ROULETTE_SEQUENCE.length)
    ] ?? 0;
  const outcomeColor = ROULETTE_COLORS[outcomeNumber] ?? "green";

  socket.dispatch("ROULETTE:start", outcomeNumber);

  rouletteState.history = [
    outcomeColor,
    ...rouletteState.history,
  ].slice(0, MAX_HISTORY);
  socket.dispatch("ROULETTE:history", rouletteState.history);

  const winners = rouletteState.players.filter(
    (player) => player.choice === outcomeColor,
  );

  winners.forEach((winner) => {
    const payout = winner.stake * ROULETTE_MULTIPLIERS[winner.choice];
    socket.dispatch("ROULETTE:win", {
      socketId: winner.socketId,
      profit: payout,
    });
  });

  rouletteState.players = [];
  socket.dispatch("ROULETTE:players", []);
  rouletteState.rolling = false;
  socket.dispatch("ROULETTE:rollTime", COUNTDOWN_SECONDS);
};

export const scheduleRouletteRound = (socket: SocketDispatcher) => {
  if (rouletteState.rolling) return;
  rouletteState.rolling = true;

  let remaining = COUNTDOWN_SECONDS;
  socket.dispatch("ROULETTE:rollTime", remaining);

  rouletteState.countdown = setInterval(() => {
    remaining = parseFloat((remaining - 0.5).toFixed(1));
    if (remaining <= 0) {
      if (rouletteState.countdown) {
        clearInterval(rouletteState.countdown);
        rouletteState.countdown = undefined;
      }
      finishRouletteRound(socket);
    } else {
      socket.dispatch("ROULETTE:rollTime", remaining);
    }
  }, 500);
};

export const resetRouletteCountdown = () => {
  if (rouletteState.countdown) {
    clearInterval(rouletteState.countdown);
    rouletteState.countdown = undefined;
  }
  rouletteState.rolling = false;
};

export const prepareRouletteBet = (
  socketId: string,
  stake: number,
  choice: string,
  user: { username: string; photo: string },
) => {
  addRouletteBet({
    socketId,
    stake,
    choice: normalizeChoice(choice),
    user,
  });
};


