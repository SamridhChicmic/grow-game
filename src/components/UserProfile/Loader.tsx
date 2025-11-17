import User1 from "@/assets/users/user-1.png";
import { Button } from "..";
import {
  CoinsIcon,
  CurrencyNote2Icon,
  DieIcon,
  HanCoinsIcon,
  StatsIcon,
} from "@/assets/svgs";
import { SilverLockIcon } from "@/assets/icons";

export default function Loader() {
  return (
    <div className="overflow-auto sm:overflow-visible sm:mb-0 sm:w-[90vw] sm:h-[86vh]_ md:w-[65vw] md:h-[86vh]_ rounded space-y-1 px-2 pt-2">
      <div className="w-[98%] mx-auto pb-4">
        <header>
          <h2 className="capitalize font-semibold text-gray-400">
            user profile
          </h2>
        </header>
        <div className="rounded-md flex items-end overflow-clip __user-bg__ h-40 mt-2">
          <div className="w-24 ml-4">
            <img
              src={User1}
              className="object-cover w-full"
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>
          <div className="h-full p-6 pl-4 space-y-2">
            <div className="flex gap-1 items-center">
              <h2 className="text-3xl font-bold">UserName...</h2>
              <div className="p-1 h-fit py-[2px] rounded uppercase bg-[rgb(161,152,121)] text font-bold bg-amber text-gray-950">
                {/* User Level */}
                lvl {"..."}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 items-center text-xs font-semibold">
                <span className="uppercase  text-[#A3A6C2]">xp:</span>{" "}
                <span>{"8,110/10,563"}</span>
              </div>
              <div className="w-full h-3 relative after:bg-primary after:rounded overflow-clip after:absolute after:left-0 after:w-1/2 after:h-full  bg-gray-800/60 rounded-md" />
              <div className="flex gap-2 items-center text-sm font-semibold">
                <span className="uppercase text-[#A3A6C2]">join date:</span>{" "}
                <span>{"..."}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1 p-2 bg-dark-800 rounded mt-3">
          <header>
            <h3 className="capitalize text-sm sm:text-base font-semibold text-gray-400">
              actions
            </h3>
          </header>
          <Button
            disabled
            className="flex items-center capitalize gap-1 w-full !py-1"
          >
            <CurrencyNote2Icon />
            <p>tip</p>
          </Button>
        </div>
        <div className="bg-dark-800 p-2.5 mt-3 rounded-sm gap-2 flex flex-col">
          <span className="text-[1rem] gap-1 font-semibold flex items-center">
            <StatsIcon />
            User Statistics
          </span>
          <div className="grid auto-rows-auto grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
              <span className="flex gap-1 items-center">
                <DieIcon />
                <span>Total Bets</span>
              </span>
              <span className="text-white gap-1 flex items-center">4729</span>
            </div>
            <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
              <span className="flex gap-1 items-center">
                <DieIcon />
                <span>Games Won</span>
              </span>
              <span className="text-white gap-1 flex items-center">1195</span>
            </div>
            <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
              <span className="flex gap-1 items-center">
                <CoinsIcon />
                <span>Total Wagered</span>
              </span>
              <span className="text-white gap-1 flex items-center">
                363.71
                <img
                  src={SilverLockIcon}
                  width="18"
                  height="18"
                  className="sc-x7t9ms-0 dnLnNz"
                />
              </span>
            </div>
            <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
              <span className="flex gap-1 items-center">
                <HanCoinsIcon />
                <span>Net Profit</span>
              </span>
              <span className="text-white gap-1 flex items-center">
                <span className="flex items-center gap-1">
                  -29.63
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
              <span className="flex gap-1 items-center">
                <StatsIcon />
                <span>All Time High</span>
              </span>
              <span className="text-white gap-1 flex items-center">
                3.57
                <img
                  src={SilverLockIcon}
                  width="18"
                  height="18"
                  className="sc-x7t9ms-0 dnLnNz"
                />
              </span>
            </div>
            <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
              <span className="flex gap-1 items-center">
                <StatsIcon />
                <span>All Time Low</span>
              </span>
              <span className="text-white gap-1 flex items-center">
                -29.63
                <img
                  src={SilverLockIcon}
                  width="18"
                  height="18"
                  className="sc-x7t9ms-0 dnLnNz"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
