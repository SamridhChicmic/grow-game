import { io, type Socket } from "socket.io-client";
import { createMockSocket, MockSocket } from "./mockSocket";

export const BASE_URL =
  typeof window !== "undefined" ? window.location.pathname : "/";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://grow-game-server.onrender.com"
    : "http://localhost:3001";

const envMockFlag = import.meta.env.VITE_USE_MOCKS?.toLowerCase();
export const USE_MOCKS =
  envMockFlag === "true" ||
  (!envMockFlag && process.env.NODE_ENV !== "production");

export const ALLOW_OVERDRAWN_BALANCE = USE_MOCKS;

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket: Socket | MockSocket = USE_MOCKS
  ? createMockSocket()
  : io(API_URL, {
      auth: {
        token,
      },
    });

export default socket;
