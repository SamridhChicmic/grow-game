import "react-range-slider-input/dist/style.css";
import "./RangeSlider.css";
import RCSlider from "rc-slider";
import "rc-slider/assets/index.css";
import { SliderProps } from "./types";
import { GamePhase, calculateMultiplier } from ".";
import clsx from "clsx";

const Slider = (sliderProps: SliderProps) => <RCSlider {...sliderProps} />;

const MIN = 0.1;
const MAX = 99.9;
const STEP = 0.1;

type Props = {
  multiplier: number;
  rangeValue: number;
  setMultiplier(value: number): void;
  setRange(value: number): void;
  roll: "over" | "under";
  switchDirection(): void;
  result: number;
  gamePhase: GamePhase;
};

export default function DiceGame({
  multiplier,
  rangeValue,
  setMultiplier,
  setRange,
  roll,
  switchDirection,
  result,
  gamePhase,
}: Props) {
  return (
    <>
      <style>
        {`    
          .rc-slider-disabled {
            background-color: transparent;
          }

          .slider-result .rc-slider-handle {
            transition-property: ${gamePhase !== GamePhase.bet ? "all" : "none"};
            transition-timing-function: ease-in-out;
            transition-duration: 500ms;
            cursor: pointer !important;
          }

          .slider-result rc-slider-handle {
            position: relative;
          }

          .slider-result .rc-slider-handle::before {
            content: "${result}";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
            color: ${result > rangeValue && roll === "over" ? "green" : "red"};
          }
      `}
      </style>
      <div className="w-full min-h-[500px] flex m-3 gap-3 justify-center items-center flex-col relative">
        <div className="w-full max-w-[700px] -mt-20">
          <div className="flex items-center justify-center w-full h-10 z-50 relative">
            <div className="flex-1 h-full flex items-center justify-start relative text-center_">
              <span className="absolute">0</span>
            </div>
            <div className="flex-1 h-full flex items-center relative">
              <span className="absolute">25</span>
            </div>
            <div className="flex-1 h-full flex items-center justify-center absolute text-center">
              <span className="absolute">50</span>
            </div>
            <div className="flex-1 h-full flex items-center justify-end relative text-center">
              <span className="absolute">75</span>
            </div>
            <div className="flex-1 h-full flex items-center justify-end relative text-end">
              <span className="absolute">100</span>
            </div>
          </div>
          <div className="h-0">
            <Slider
              className={clsx(
                "transition-all duration-300 slider-result",
                gamePhase === GamePhase.running && "slider-disabled",
              )}
              count={20}
              styles={{
                track: {
                  backgroundColor: roll === "over" ? "red" : "green",
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                  borderBottomRightRadius: 6,
                  borderBottomLeftRadius: 6,
                  height: 0,
                },
                handle: {
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                  borderBottomRightRadius: 6,
                  borderBottomLeftRadius: 6,
                  height: 40,
                  width: 50,
                  accentColor: "transparent",
                  backgroundColor: "#2b2f3d",
                  opacity: 1,
                  bottom: 20,
                  borderColor: "transparent",
                  boxShadow: "none",
                },
                rail: {
                  height: 0,
                },
                tracks: {
                  height: 0,
                },
              }}
              min={MIN}
              max={MAX}
              step={STEP}
              disabled={true}
              value={result}
              onChange={(e) => {
                setRange(+e);
                const result = calculateMultiplier(+e, "greater");
                setMultiplier(+result?.toFixed(2));
              }}
            />
          </div>
          <div className="flex p-4 bg-dark-700 rounded-md">
            <Slider
              className={clsx(
                "transition-all duration-300",
                gamePhase === GamePhase.running && "slider-disabled",
              )}
              count={20}
              styles={{
                track: {
                  backgroundColor: roll === "over" ? "red" : "green",
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                  borderBottomRightRadius: 6,
                  borderBottomLeftRadius: 6,
                  height: 10,
                },
                handle: {
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                  borderBottomRightRadius: 6,
                  borderBottomLeftRadius: 6,
                  height: 30,
                  width: 30,
                  accentColor: "transparent",
                  backgroundColor: "blue",
                  opacity: 1,
                  bottom: -10,
                  borderColor: "transparent",
                  boxShadow: "none",
                },
                rail: {
                  backgroundColor: roll === "over" ? "green" : "red",
                  height: 10,
                },
                tracks: {
                  height: 10,
                },
              }}
              min={MIN}
              max={MAX}
              step={STEP}
              disabled={gamePhase === GamePhase.running}
              value={+rangeValue?.toFixed()}
              onChange={(e) => {
                setRange(+e);
                const result = calculateMultiplier(+e, "greater");
                setMultiplier(+result?.toFixed(2));
              }}
            />
          </div>
        </div>
        <div className="absolute bottom-0 flex w-full gap-2 p-3 overflow-hidden text-sm font-medium rounded-sm bg-dark-800 max-sm:flex-col">
          <div className="flex flex-col w-full gap-1">
            <span className="text-sm font-medium text-white">Multiplier</span>
            <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
              <input
                className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
                type="text"
                value={multiplier?.toFixed(2)}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <span className="text-sm font-medium text-white capitalize">
              Roll {roll}
            </span>
            <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
              <input
                className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
                type="number"
                value={rangeValue}
                onChange={(e) => setRange(parseFloat(e.target.value))}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={switchDirection}
                  className="transition-colors hover:text-white"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/*
         <AnimateInOut
          show={
            message !== "" && gamePhase !== GamePhase.running && showMessage
          }
          initial={{ translateY: -100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ translateY: -100, opacity: 0 }}
          onClick={() => reset()}
          className="absolute z-50 flex flex-col items-center justify-center w-full h-full cursor-pointer backdrop-blur-sm_"
        >
          <div className="relative flex items-center justify-center">
            <p className="absolute text-6xl font-extrabold animate-ping">
                {message}
              </p>
            <p className="relative z-20 text-6xl font-extrabold">{message}</p>
          </div>

          <div className="mt-12 text-xl">
              <p>tap screen to reset</p>
            </div> 
        </AnimateInOut>
 
 */
