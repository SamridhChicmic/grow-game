import ballAudio from "../../assets/sounds/ball.wav";
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IEventCollision,
  Render,
  Runner,
  World,
} from "matter-js";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { useGameStore } from "../../store/game";
import { random } from "../../utils/random";

import { LinesType, MultiplierValues } from "./@types";
import { BetActions } from "./components/BetActions";
import { PlinkoGameBody } from "./components/GameBody";
import { MultiplierHistory } from "./components/MultiplierHistory";
import { config } from "./config";
import {
  getMultiplierByLinesQnt,
  getMultiplierSound,
} from "./config/multipliers";
import { SilverLockIcon } from "@/assets/icons";
import { ProvablyFair } from "@/components";

let onGameComplete:
  | ((result: { profit: number; multiplier: number }) => void)
  | undefined = undefined;
export function Game() {
  // #region States
  const incrementCurrentBalance = useAuthStore(
    (state) => state.incrementBalance,
  );
  const engine = Engine.create();
  const [lines, setLines] = useState<LinesType>(16);
  const inGameBallsCount = useGameStore((state) => state.gamesRunning);
  const incrementInGameBallsCount = useGameStore((state) => {
    console.log("INCREMENT");
    return state.incrementGamesRunning;
  });
  const decrementInGameBallsCount = useGameStore(
    (state) => state.decrementGamesRunning,
  );

  useEffect(() => {
    console.log({ inGameBallsCount });
  }, [inGameBallsCount]);

  const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);
  const {
    pins: pinsConfig,
    colors,
    ball: ballConfig,
    engine: engineConfig,
    world: worldConfig,
  } = config;

  const worldWidth: number = worldConfig.width;

  const worldHeight: number = worldConfig.height;
  // #endregion

  useEffect(() => {
    engine.gravity.y = engineConfig.engineGravity;
    const element = document.getElementById("plinko");
    const render = Render.create({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element: element!,
      bounds: {
        max: {
          y: worldHeight,
          x: worldWidth,
        },
        min: {
          y: 0,
          x: 0,
        },
      },
      options: {
        background: colors.background,
        hasBounds: true,
        width: worldWidth,
        height: worldHeight,
        wireframes: false,
      },
      engine,
    });
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
    return () => {
      World.clear(engine.world, true);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [lines]);

  const pins: Body[] = [];

  for (let l = 0; l < lines; l++) {
    const linePins = pinsConfig.startPins + l;
    const lineWidth = linePins * pinsConfig.pinGap;
    for (let i = 0; i < linePins; i++) {
      const pinX =
        worldWidth / 2 -
        lineWidth / 2 +
        i * pinsConfig.pinGap +
        pinsConfig.pinGap / 2;

      const pinY =
        worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

      const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
        label: `pin-${i}`,
        render: {
          fillStyle: "#F5DCFF",
        },
        isStatic: true,
      });
      pins.push(pin);
    }
  }

  function addInGameBall() {
    if (inGameBallsCount > 15) return;
    incrementInGameBallsCount();
  }

  function removeInGameBall() {
    decrementInGameBallsCount();
  }

  const addBall = useCallback(
    (ballValue: number) => {
      addInGameBall();
      const ballSound = new Audio(ballAudio);
      ballSound.volume = 0.2;
      ballSound.currentTime = 0;
      ballSound.play();

      const minBallX =
        worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap;
      const maxBallX =
        worldWidth / 2 -
        pinsConfig.pinSize * 3 -
        pinsConfig.pinGap +
        pinsConfig.pinGap / 2;

      const ballX = random(minBallX, maxBallX);
      const ballColor = ballValue <= 0 ? colors.text : colors.purple;
      const ball = Bodies.circle(ballX, 20, ballConfig.ballSize, {
        restitution: 1,
        friction: 0.6,
        label: `ball-${ballValue}`,
        id: new Date().getTime(),
        frictionAir: 0.05,
        collisionFilter: {
          group: -1,
        },
        render: {
          fillStyle: ballColor,
        },
        isStatic: false,
      });
      Composite.add(engine.world, ball);
    },
    [lines],
  );

  const leftWall = Bodies.rectangle(
    worldWidth / 3 - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap,
    worldWidth / 2 - pinsConfig.pinSize,
    worldWidth * 2,
    40,
    {
      angle: 90,
      render: {
        visible: false,
      },
      isStatic: true,
    },
  );
  const rightWall = Bodies.rectangle(
    worldWidth -
      pinsConfig.pinSize * pinsConfig.pinGap -
      pinsConfig.pinGap -
      pinsConfig.pinGap / 2,
    worldWidth / 2 - pinsConfig.pinSize,
    worldWidth * 2,
    40,
    {
      angle: -90,
      render: {
        visible: false,
      },
      isStatic: true,
    },
  );
  const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
    label: "block-1",
    render: {
      visible: false,
    },
    isStatic: true,
  });

  const multipliers = getMultiplierByLinesQnt(lines);

  const multipliersBodies: Body[] = [];

  let lastMultiplierX: number =
    worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap;

  multipliers.forEach((multiplier) => {
    const blockSize = 20; // height and width
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + 20,
      worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap,
      blockSize,
      blockSize,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            xScale: 1,
            yScale: 1,
            texture: multiplier.img,
          },
        },
      },
    );
    lastMultiplierX = multiplierBody.position.x;
    multipliersBodies.push(multiplierBody);
  });

  Composite.add(engine.world, [
    ...pins,
    ...multipliersBodies,
    leftWall,
    rightWall,
    floor,
  ]);

  function bet(betValue: number) {
    addBall(betValue);
  }

  async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
    ball.collisionFilter.group = 2;
    World.remove(engine.world, ball);
    removeInGameBall();
    const ballValue = ball.label.split("-")[1];
    const multiplierValue = +multiplier.label.split("-")[1] as MultiplierValues;

    const multiplierSong = new Audio(getMultiplierSound(multiplierValue));
    multiplierSong.currentTime = 0;
    multiplierSong.volume = 0.2;
    multiplierSong.play();
    setLastMultipliers((prev) => [multiplierValue, prev[0], prev[1], prev[2]]);

    if (+ballValue <= 0) return;

    const newBalance = +ballValue * multiplierValue;
    onGameComplete?.({
      multiplier: multiplierValue,
      profit: +ballValue * multiplierValue,
    });
    // COMEBACK: Remove the below code
    await incrementCurrentBalance(newBalance);
  }
  async function onBodyCollision(event: IEventCollision<Engine>) {
    const pairs = event.pairs;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyB.label.includes("ball") && bodyA.label.includes("block"))
        await onCollideWithMultiplier(bodyB, bodyA);
    }
  }

  Events.on(engine, "collisionActive", onBodyCollision);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className=" min-h-[50px] bg-dark-800 flex overflow-hidden_ flex-col-reverse w-full items-center rounded-t-md border-b border-gray-700">
          <div className="w-full h-full flex gap-1.5 p-2  justify-start overflow-hidden relative shadow-dark-800 items-center">
            <div
              className="w-[6px] bg-dark-800 h-full absolute right-0 top-0 z-[5] "
              style={{ boxShadow: "0 0 30px 40px var(--tw-shadow-color)" }}
            ></div>
          </div>
        </div>
        <div className="flex flex-row w-full h-full max-md:flex-col-reverse">
          <BetActions
            lines={lines}
            inGameBallsCount={inGameBallsCount}
            onChangeLines={setLines}
            onRunBet={(betValue, callback) => {
              onGameComplete = callback;
              bet(betValue);
            }}
          />
          <MultiplierHistory multiplierHistory={lastMultipliers} />
          <div className="flex items-center justify-center flex-1">
            <PlinkoGameBody />
          </div>
        </div>
        <div className="flex flex-row-reverse items-center min-h-[50px] bg-dark-800 rounded-b-md border-t border-gray-700">
          <ProvablyFair />
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-3 font-semibold text-gray-400 rounded-md bg-dark-800">
        <span className="text-2xl text-white">Reme</span>
        <div className="flex flex-row gap-2 max-md:flex-col">
          <div className="flex flex-col min-w-[300px] max-md:w-full gap-2">
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">House Edge</span>
              <span className="flex items-center gap-1.5">2.70%</span>
            </div>
            <div className="text-sm h-[40px] max-h-[40px] rounded-sm bg-dark-750 p-2 flex-grow flex justify-between items-center gap-2">
              <span className="font-medium text-white">Max Bet</span>
              <span className="flex items-center gap-1.5">
                2,000.00
                <img
                  src={SilverLockIcon}
                  width="18"
                  height="18"
                  className="sc-x7t9ms-0 dnLnNz"
                />
              </span>
            </div>
          </div>
          <div className="bg-dark-750 rounded-md  p-2.5 text-sm font-medium w-full text-justify leading-5">
            <span>
              In this game both the house and you spin a roulette wheel.
              <br />
              <br />
              If it is a two digit number, we sum the digits (23 -&gt; 2 + 3 =
              5).
              <br />
              If the result is a two digit number (e.g 29 -&gt; 2 + 9 = 11),
              then we use the last digit of the number only, in this case 1.
              <br />
              <br />
              If your end result is bigger than the house's, you win double your
              bet. If your end result is 0 and it is not a tie, you win triple
              your bet.
              <br />
              <br />
              If the end result is a tie, or your result is smaller than the
              house's, you lose.
            </span>
          </div>
        </div>
      </div>
    </>
    // <div className="flex flex-col-reverse items-center justify-center gap-4 h-fit md:flex-row">
    //   <BetActions
    //     inGameBallsCount={inGameBallsCount}
    //     onChangeLines={setLines}
    //     onRunBet={bet}
    //   />
    // <MultiplierHistory multiplierHistory={lastMultipliers} />
    // <div className="flex items-center justify-center flex-1">
    //   <PlinkoGameBody />
    // </div>
    // </div>
  );
}
