import { Outlet } from "react-router-dom";
import { Bets } from "./landing/components";

export default function GameWrapper() {
  return (
    <>
      {/* //{" "} */}
      <div className="w-full  overflow-hidden h-full-app max-sm:max-h-[calc(var(--app-height)-var(--header-height)-var(--bottom-height))]">
        <div className="items-center w-full h-full overflow-y-auto">
          <div className="space-y-3 px-3 max-w-page">
            <Outlet />
            <div className="w-full">
              <Bets />
            </div>
          </div>
        </div>
        <footer className="flex justify-center w-full text-sm font-medium text-gray-400">
          <div className="p-3 max-w-page"></div>
        </footer>
        {/* //{" "} */}
      </div>
    </>
  );
}
