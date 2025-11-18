type Listener = (...args: any[]) => void;

type Reaction = {
  match: (event: string) => boolean;
  emit: (socket: MockSocket, args: any[]) => void;
};

type AutoEvent = {
  match: (event: string) => boolean;
  payload: () => any | any[];
};

const randomBetween = (min: number, max: number, precision = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(precision));

const randomUsername = () =>
  `Player${Math.floor(Math.random() * 900 + 100)}`;

const createMockPlayer = () => ({
  user: {
    username: randomUsername(),
    photo: "/logo.png",
  },
  multiplier: randomBetween(1.1, 5),
  bet: randomBetween(0.1, 4),
  stake: randomBetween(0.1, 4),
  profit: randomBetween(0.1, 4),
});

// Create mock leaderboard data matching AllBets component structure
const createMockLeaderboardTable = (length = 25) => {
  const gameTypes: GameType[] = ["LIMBO", "COINFLIP", "DICE", "CRASH", "MINES", "ROULETTE", "SLOTS"];
  return Array.from({ length }, () => ({
    gameType: gameTypes[Math.floor(Math.random() * gameTypes.length)] as GameType,
    player: randomUsername(),
    stake: randomBetween(0.1, 100),
    profit: randomBetween(-50, 200), // Can be negative for losses
    multiplier: randomBetween(1.01, 10),
    time: new Date(Date.now() - Math.random() * 86400000), // Random time within last 24 hours
  }));
};

const createMockLeaderboard = (length = 8) =>
  Array.from({ length }, () => createMockPlayer());

const createMockHistory = (length = 12) =>
  Array.from({ length }, () => randomBetween(1, 12));

const createMockMultipliers = (length = 6) =>
  Array.from({ length }, (_, index) => ({
    id: `multipliers-${index}`,
    text: randomBetween(1, 10).toFixed(2),
  }));

const createMockMessage = () => ({
  id: crypto.randomUUID?.() ?? String(Math.random()),
  room: "global",
  content: "Welcome to Grow Game (mock server)",
  senderInfo: {
    username: "GrowBot",
    photo: "/logo.png",
    level: 99,
    uid: "grow-bot",
  },
  date: new Date().toISOString(),
});

const autoEvents: AutoEvent[] = [
  {
    match: (event) => event === "usersCount",
    payload: () => Math.floor(randomBetween(120, 260, 0)),
  },
  {
    match: (event) => event === "incoming_message",
    payload: () => createMockMessage(),
  },
  {
    match: (event) => /^user:/.test(event),
    payload: () => ({ message: "You have a new reward waiting!", type: "info" }),
  },
  {
    match: (event) => event === "tip",
    payload: () => ({
      message: "Mock tip received",
      amount: randomBetween(0.1, 1),
    }),
  },
];

const reactions: Reaction[] = [
  {
    match: (event) => event === "LEADERBOARD:get_aggregate",
    emit: (socket) => {
      socket.dispatch("LEADERBOARD:aggregate", createMockLeaderboard(5));
    },
  },
  {
    match: (event) => event === "LEADERBOARD:get_table",
    emit: (socket) => {
      socket.dispatch("LEADERBOARD:table", createMockLeaderboardTable(25));
    },
  },
  {
    match: (event) => event === "join_chat",
    emit: (socket, args) => {
      socket.dispatch("room_joined", {
        room: args[0] ?? "global",
        id: socket.id,
      });
      socket.dispatch("usersCount", autoEvents[0].payload());
      socket.dispatch("incoming_message", createMockMessage());
    },
  },
  {
    match: (event) => event.startsWith("COINFLIP"),
    emit: (socket) => {
      socket.dispatch("COINFLIP:multipliers", createMockMultipliers());
      socket.dispatch("COINFLIP:result", {
        choice: Math.random() > 0.5 ? "H" : "T",
        outcome: Math.random() > 0.5 ? "win" : "lose",
        profit: randomBetween(0, 2),
      });
    },
  },
  {
    match: (event) => event === "CRASH:get_players",
    emit: (socket) => {
      socket.dispatch("CRASH:players", createMockLeaderboard(10));
    },
  },
  {
    match: (event) => event === "CRASH:get_history",
    emit: (socket) => {
      socket.dispatch("CRASH:history", createMockHistory());
      socket.dispatch("CRASH:win", createMockLeaderboard(3));
    },
  },
  {
    match: (event) => event === "LIMBO:get_multipliers",
    emit: (socket) => {
      socket.dispatch("LIMBO:multipliers", createMockMultipliers());
      // Result will be emitted after bet is placed via API
    },
  },
  {
    match: (event) => event === "MINES:join_game",
    emit: (socket) => {
      socket.dispatch("MINES:game_started", []);
      socket.dispatch("MINES:game_over");
    },
  },
  {
    match: (event) => event === "REME:join_game",
    emit: (socket) => {
      socket.dispatch("REME:result", {
        playerSpin: Math.floor(randomBetween(1, 50, 0)),
        houseSpin: Math.floor(randomBetween(1, 50, 0)),
        message: "Mock Reme round completed",
        profit: randomBetween(0, 4),
      });
    },
  },
];

export class MockSocket {
  readonly id = `mock-socket-${Math.random().toString(36).slice(2, 8)}`;
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, handler: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    this.autoEmit(event);
    return this;
  }

  emit(event: string, ...args: any[]) {
    const reaction = reactions.find((item) => item.match(event));
    reaction?.emit(this, args);
    return this;
  }

  off(event?: string, handler?: Listener) {
    if (!event) {
      this.listeners.clear();
      return this;
    }

    if (!this.listeners.has(event)) return this;

    if (!handler) {
      this.listeners.get(event)?.clear();
      return this;
    }

    this.listeners.get(event)?.delete(handler);
    return this;
  }

  disconnect() {
    this.listeners.clear();
  }

  dispatch(event: string, ...args: any[]) {
    const listeners = this.listeners.get(event);
    listeners?.forEach((listener) => {
      listener(...args);
    });
  }

  private autoEmit(event: string) {
    const generator = autoEvents.find((item) => item.match(event));
    if (!generator) return;

    const payload = generator.payload();
    const args = Array.isArray(payload) ? payload : [payload];

    setTimeout(() => {
      this.dispatch(event, ...args);
    }, 50);
  }
}

export const createMockSocket = () => new MockSocket();

