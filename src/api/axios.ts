"use client";

import store from "@/store";
import { clearUser } from "@/store/slices/auth";
import { API_URL, USE_MOCKS } from "@/utils/constants";
import socket from "@/utils/constants";
import { MockSocket } from "@/utils/mockSocket";
import axios, {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    // You can modify the response data here, e.g., handling pagination

    return response;
  },
  (error: AxiosError) => {
    // console.log("INTERCEPTOR_ERROR: ", error.code);
    if (error.response?.status === 401) {
      console.log("REMOVING_USER");
      store.dispatch(clearUser());
      toast.info("Logged out");
    }
    return Promise.reject(error);
  },
);

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

type MockResponse = {
  status?: number;
  statusText?: string;
  data?: any;
  headers?: Record<string, string>;
};

type MockHandler = {
  test: (config: InternalAxiosRequestConfig) => boolean;
  respond: (config: InternalAxiosRequestConfig) => MockResponse | Promise<MockResponse>;
};

type MockBetRecord = {
  _id: string;
  stake: number;
  profit: number;
  multiplier: number;
  gameType?: string;
};

type MockChatMessage = {
  id: string;
  room: string;
  content: string;
  senderInfo: {
    username: string;
    photo: string;
    level: number;
    uid: string;
  };
  date: string;
};

const mockState = {
  token: "mock-token",
  refreshToken: "mock-refresh-token",
  walletBalance: 1000000, // Set to 1,000,000 for testing
  bets: new Map<string, MockBetRecord>(),
  user: {
    id: "mock-user-id",
    username: "DemoGrower",
    email: "demo@grow.game",
    firstName: "Demo",
    lastName: "User",
    photo: "/logo.png",
    background: "/images/characters/backgrounds/sunny.webp",
  } as User,
  profile: {
    uid: "mock-user-id",
    username: "DemoGrower",
    email: "demo@grow.game",
    photo: "/logo.png",
    level: 54,
    gamesWon: 824,
    totalBets: 2073,
    totalWagered: 18452,
    allTimeHigh: 5432,
    allTimeLow: -432,
    netProfit: 1245,
    joinDate: new Date("2023-02-14T12:00:00Z").toISOString(),
    isVerified: true,
  } as UserProfile,
  messages: [] as MockChatMessage[],
};

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `mock-${Math.random().toString(36).slice(2, 10)}`;

const ensureMessagesSeeded = () => {
  if (mockState.messages.length) return;
  mockState.messages = Array.from({ length: 6 }, (_, index) => ({
    id: uuid(),
    room: "global",
    content:
      index % 2 === 0
        ? "Welcome to Grow Game! Place a bet to get started."
        : "Remember to stay hydrated and gamble responsibly.",
    senderInfo: {
      username: index % 2 === 0 ? "GrowBot" : "ModSara",
      photo: "/logo.png",
      level: index % 2 === 0 ? 99 : 42,
      uid: `mock-user-${index}`,
    },
    date: new Date(Date.now() - index * 60000).toISOString(),
  }));
};

const parseData = (config: InternalAxiosRequestConfig) => {
  if (!config.data) return {};
  if (typeof config.data === "string") {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data;
};

const resolvePath = (config: InternalAxiosRequestConfig) => {
  try {
    const base = config.baseURL ?? API_URL;
    const url = new URL(config.url ?? "", base);
    const rawPath = url.pathname.replace(/^\/api/, "");
    return rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  } catch {
    return config.url || "/";
  }
};

const createMockAdapter = (): AxiosAdapter => {
  ensureMessagesSeeded();

  const handlers: MockHandler[] = [
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/auth/sign-in",
      respond: () => ({
        status: 201,
        data: {
          message: "Signed in (mock)",
          user: mockState.user,
          token: mockState.token,
        },
      }),
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/auth/sign-up",
      respond: () => ({
        status: 201,
        data: {
          message: "Signed up (mock)",
          user: mockState.user,
          token: mockState.token,
        },
      }),
    },
    {
      test: (config) =>
        config.method === "post" &&
        resolvePath(config).startsWith("/auth/verify/"),
      respond: () => ({
        status: 200,
        data: { message: "Email verified (mock)" },
      }),
    },
    {
      test: (config) =>
        config.method === "post" &&
        resolvePath(config).startsWith("/auth/reset/"),
      respond: () => ({
        status: 200,
        data: { message: "Password reset successfully (mock)" },
      }),
    },
    {
      test: (config) =>
        config.method === "post" &&
        resolvePath(config) === "/auth/reset-request",
      respond: () => ({
        status: 200,
        data: { message: "Password reset link sent (mock)" },
      }),
    },
    {
      test: (config) =>
        config.method === "post" &&
        resolvePath(config) === "/auth/request-verification",
      respond: () => ({
        status: 201,
        data: { message: "Verification email sent (mock)" },
      }),
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/auth/sign-out",
      respond: () => ({
        status: 201,
        data: { message: "Signed out (mock)" },
      }),
    },
    {
      test: (config) =>
        config.method === "get" &&
        resolvePath(config) === "/auth/refresh-token",
      respond: () => ({
        status: 200,
        data: { token: `${mockState.token}-${Date.now()}` },
      }),
    },
    {
      test: (config) =>
        config.method === "get" && resolvePath(config) === "/wallet",
      respond: () => ({
        status: 200,
        data: mockState.walletBalance,
      }),
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/wallet/fund",
      respond: (config) => {
        const body = parseData(config);
        const amount = Number(body.amount) || 0;
        mockState.walletBalance += amount;
        return { status: 200, data: mockState.walletBalance };
      },
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/wallet/tip",
      respond: () => ({
        status: 200,
        data: { message: "success" },
      }),
    },
    {
      test: (config) =>
        config.method === "get" &&
        resolvePath(config).startsWith("/users/"),
      respond: (config) => {
        const path = resolvePath(config);
        const username = path.split("/")[2] || mockState.profile.username;
        return {
          status: 200,
          data: {
            user: {
              ...mockState.profile,
              username,
            },
          },
        };
      },
    },
    {
      test: (config) =>
        config.method === "get" &&
        resolvePath(config).startsWith("/chat/messages"),
      respond: () => ({
        status: 200,
        data: { messages: mockState.messages },
      }),
    },
    {
      test: (config) =>
        config.method === "post" &&
        resolvePath(config) === "/chat/message",
      respond: (config) => {
        const body = parseData(config);
        const message: MockChatMessage = {
          id: uuid(),
          room: body.room || "global",
          content: body.content || "",
          senderInfo: body.senderInfo || {
            username: mockState.user.username,
            photo: mockState.user.photo,
            level: 12,
            uid: mockState.user.id,
          },
          date: new Date().toISOString(),
        };
        mockState.messages = [...mockState.messages, message];
        return {
          status: 201,
          data: { message: "Message sent (mock)", data: message },
        };
      },
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/bet",
      respond: (config) => {
        const body = parseData(config);
        const stake = Number(body.stake) || 0;
        const targetMultiplier = Number(body.multiplier) || 1;
        
        // Generate random result multiplier (between 0.01 and 10)
        const resultMultiplier = parseFloat((Math.random() * 9.99 + 0.01).toFixed(2));
        
        // Determine win/lose based on whether result exceeds target
        const isWin = resultMultiplier >= targetMultiplier;
        // Profit calculation: Since stake is already deducted when bet is placed,
        // profit should be the total winnings (stake * multiplier) for wins, or 0 for losses
        const profit = isWin 
          ? stake * targetMultiplier // Total winnings = stake * multiplier
          : 0; // No profit on loss (stake already deducted)
        
        const bet: MockBetRecord = {
          _id: uuid(),
          stake,
          multiplier: targetMultiplier,
          profit,
          gameType: body.gameType,
        };
        mockState.bets.set(bet._id, bet);
        
        // Emit LIMBO result via socket if it's a Limbo game
        if (USE_MOCKS && body.gameType === "LIMBO") {
          const mockSocket = socket as MockSocket;
          if (mockSocket && typeof mockSocket.dispatch === "function") {
            setTimeout(() => {
              mockSocket.dispatch("LIMBO:result", {
                result: resultMultiplier,
                status: isWin ? "win" : "lose",
                profit: isWin ? profit : 0,
              });
            }, 100); // Small delay to simulate server processing
          }
        }
        
        // Handle CRASH game flow
        if (USE_MOCKS && body.gameType === "CRASH") {
          const mockSocket = socket as MockSocket;
          if (mockSocket && typeof mockSocket.dispatch === "function") {
            // Start the game after a short delay
            setTimeout(() => {
              mockSocket.dispatch("CRASH:start", {});
              
              // Generate a random crash multiplier (between 1.01 and 10.00)
              const crashMultiplier = parseFloat((Math.random() * 8.99 + 1.01).toFixed(2));
              
              // Game runs for 3-8 seconds before crashing
              const gameDuration = Math.random() * 5000 + 3000;
              
              setTimeout(() => {
                // Stop the game at the crash multiplier
                mockSocket.dispatch("CRASH:stop", crashMultiplier);
                
                // Check if player won (their auto cashout is less than crash multiplier)
                const playerWon = targetMultiplier < crashMultiplier;
                const playerProfit = playerWon 
                  ? stake * targetMultiplier // Total winnings
                  : 0;
                
                // Update bet with actual profit
                bet.profit = playerProfit;
                mockState.bets.set(bet._id, bet);
                
                // Notify winners
                if (playerWon) {
                  setTimeout(() => {
                    mockSocket.dispatch("CRASH:win", [{
                      user: mockState.user,
                      multiplier: targetMultiplier,
                      stake: stake,
                      profit: playerProfit,
                    }]);
                  }, 500);
                }
                
                // Return to betting phase after showing results
                setTimeout(() => {
                  mockSocket.dispatch("CRASH:bet", {});
                  // Update players list - create simple mock players
                  const mockPlayers = Array.from({ length: 10 }, () => ({
                    user: {
                      username: `Player${Math.floor(Math.random() * 900 + 100)}`,
                      photo: "/logo.png",
                    },
                    multiplier: parseFloat((Math.random() * 8.99 + 1.01).toFixed(2)),
                    stake: parseFloat((Math.random() * 99 + 0.1).toFixed(2)),
                    profit: parseFloat((Math.random() * 200 - 50).toFixed(2)),
                  }));
                  mockSocket.dispatch("CRASH:players", mockPlayers);
                  // Update history with new crash multiplier
                  const historyLength = 12;
                  const newHistory = Array.from({ length: historyLength }, (_, i) => 
                    i === 0 ? crashMultiplier : parseFloat((Math.random() * 8.99 + 1.01).toFixed(2))
                  );
                  mockSocket.dispatch("CRASH:history", newHistory);
                }, 2000);
              }, gameDuration);
            }, 500);
          }
        }
        
        return {
          status: 201,
          data: { message: "Bet placed (mock)", bet },
        };
      },
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/bet/quick",
      respond: (config) => {
        const body = parseData(config);
        const bet: MockBetRecord = {
          _id: uuid(),
          stake: Number(body.stake) || 0,
          multiplier: Number(body.multiplier) || 1,
          profit: Number(body.profit) || 0,
          gameType: body.gameType,
        };
        mockState.bets.set(bet._id, bet);
        return {
          status: 201,
          data: { message: "Bet placed (mock)", bet },
        };
      },
    },
    {
      test: (config) =>
        config.method === "post" && resolvePath(config) === "/bet/result",
      respond: (config) => {
        const body = parseData(config);
        const betId = body.id as string;
        const bet = betId ? mockState.bets.get(betId) : null;
        const profit = Number(body.profit ?? bet?.profit ?? 0);
        mockState.walletBalance += profit;
        return {
          status: 200,
          data: {
            message: "Bet settled (mock)",
            bet: bet
              ? { ...bet, profit }
              : { _id: betId ?? uuid(), profit, multiplier: 1 },
          },
        };
      },
    },
  ];

  const adapter: AxiosAdapter = async (config) => {
    const handler = handlers.find((item) => item.test(config));
    if (!handler) {
      console.warn(
        `[MockAPI] No handler for ${config.method?.toUpperCase()} ${resolvePath(config)}`,
      );
    }

    const response = handler
      ? await handler.respond(config)
      : {
          status: 200,
          data: {
            message: `Mock response for ${config.method?.toUpperCase()} ${resolvePath(config)}`,
          },
        };

    return {
      data: response.data,
      status: response.status ?? 200,
      statusText: response.statusText ?? "OK",
      headers: response.headers ?? {},
      config,
      request: { mock: true },
    };
  };

  return adapter;
};

if (USE_MOCKS) {
  api.defaults.adapter = createMockAdapter();
  axiosPrivate.defaults.adapter = createMockAdapter();
}

export default api;
