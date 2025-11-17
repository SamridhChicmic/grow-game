import { AnimateInOut } from "@/components";
import Wheel from "./assets/wheel.png";
import Base from "./assets/base.png";
import classes from "./reme.module.css";
import clsx from "clsx";
import React from "react";
type Props = {
  message: string | React.ReactNode;
  playerSpin: number;
  houseSpin: number;
  loading?: boolean;
  reset(): void;
};

export default function RemeGame({
  houseSpin,
  playerSpin,
  loading,
  message,
  reset,
}: Props) {
  return (
    <div className="overflow-hidden bg-dark-850 w-full h-full min-h-[400px] max-sm:min-h-[300px] flex justify-center relative">
      <div className="relative w-full h-[500px] max-sm:max-h-[325px]">
        <AnimateInOut
          show={message !== ""}
          initial={{ translateY: -100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ translateY: -100, opacity: 0 }}
          onClick={() => reset()}
          className="absolute z-50 flex flex-col items-center justify-center w-full h-full cursor-pointer backdrop-blur-sm_"
        >
          <div className="relative flex items-center justify-center">
            <div className="relative z-20 text-5xl lg:text-6xl text-center font-extrabold">
              {message}
            </div>
          </div>
        </AnimateInOut>
        <div className="flex items-center justify-between w-full p-20 absolute_ max-sm:p-5">
          <div className="flex upper flex-col justify-center items-center gap-1.5 text-xl font-semibold">
            <span className="max-sm:text-[1rem]">YOU</span>
            <div className="bg-dark-800 select-none overflow-hidden rounded-sm max-sm:h-[50px] max-sm:w-[50px] w-[75px] h-[75px] flex justify-center items-center">
              <span className="text-3xl font-semibold text-white max-sm:text-xl">
                {playerSpin || ""}
              </span>
            </div>
          </div>
          <div className="font-semibold max-sm:text-[1rem] flex-nowrap text-3xl transition-colors"></div>
          <div className="flex upper flex-col justify-center items-center gap-1.5 text-xl font-semibold">
            <span className="max-sm:text-[1rem]">HOUSE</span>
            <div className="bg-dark-800 select-none overflow-hidden rounded-sm max-sm:h-[50px] max-sm:w-[50px] w-[75px] h-[75px] flex justify-center items-center">
              <span className="text-3xl font-semibold text-white max-sm:text-xl">
                {houseSpin || ""}
              </span>
            </div>
          </div>
        </div>

        <div className="h-full w-full_ absolute_">
          <div className={clsx(`mx-auto ${classes["reme-spinner-container"]}`)}>
            <div className="flex flex-col">
              <img
                src={Wheel}
                alt="Roulette Wheels"
                draggable={false}
                className={clsx(
                  `object-cover ${classes["spinner-container"]}`,
                  loading && "animate-spin",
                )}
                style={{
                  imageRendering: "pixelated",
                }}
              />
              <img
                src={Base}
                alt="Roulette Wheels"
                draggable={false}
                className={`object-cover ${classes["reme-spinner"]} shrink-0`}
                style={{
                  imageRendering: "pixelated",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
