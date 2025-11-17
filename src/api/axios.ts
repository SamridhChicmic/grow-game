"use client";

import store from "@/store";
import { clearUser } from "@/store/slices/auth";
import { API_URL, USE_MOCKS } from "@/utils/constants";
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
  walletBalance: 1250,
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
