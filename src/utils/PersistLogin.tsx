import { useRefreshToken } from "@/hooks";
import { useAppSelector } from "@/hooks/store";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useRefreshToken();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error("PERSIST_LOGIN", error);
      } finally {
        setIsLoading(false);
      }
    };

    !auth.token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {}, [isLoading]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
}
