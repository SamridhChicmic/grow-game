type User = {
  id: string;
  username: string;
  email: string;
  photo: string;
};

type Message = {
  senderInfo: {
    username: string;
    photo: string;
    level: number;
  };
  sender?: string;
  content: string;
  date: Date;
  room?: "global" | "support";
};

type Currency = "world-lock" | "diamond-lock";

enum GameType {
  CRASH = "CRASH",
  BLACKJACK = "BLACKJACK",
  ROULETTE = "ROULETTE",
  PLINKO = "PLINKO",
  TOWERS = "TOWERS",
  REME = "REME",
  DICE = "DICE",
  COINFLIP = "COINFLIP",
  MINES = "MINES",
  LIMBO = "LIMBO",
  KENO = "KENO",
}

type Game = {
  GameType: GameType;
};

interface Bet {
  player: string;
  gameType: GameType; // Type of the game
  stake: number; // Amount staked by the player
  outcome: BetOutcome; // Outcome of the game: WIN, LOSE, or DRAW
  multiplier?: number; // Multiplier set by the player
  profit?: number; // Amount won by the player (if applicable)
  date?: Date; // Date of the game (defaults to current date)
  details?: Record<string, any>; // Additional details about the game
  createdAt: Date;
}
