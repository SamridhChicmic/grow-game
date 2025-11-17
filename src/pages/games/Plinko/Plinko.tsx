import { useCallback, useEffect } from "react";
import { useGameStore } from "./store/game";

import { Game } from "./components/Game";

export default function PlinkoGamePage() {
  const alertUser = useCallback((e: BeforeUnloadEvent) => {
    if (gamesRunning > 0) {
      e.preventDefault();
      alert("this that");
      e.returnValue = "";
    }
  }, []);
  const gamesRunning = useGameStore((state) => state.gamesRunning);
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, [alertUser, gamesRunning]);
  return <Game />;
}
