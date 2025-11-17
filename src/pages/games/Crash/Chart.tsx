import React from "react";
import socket from "@/utils/constants";
import { Chart as ChartJs, ChartData, ChartOptions } from "chart.js";
import { useEffect, useRef, useState } from "react";

// import { Line } from "react-chartjs-2";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  // LinearScale,
  // PointElement,
  // LineElement,
  // Title,
  // Tooltip,
  // Legend,
  // Filler,
  registerables,
} from "chart.js";
import { GamePhase } from ".";
import clsx from "clsx";

ChartJS.register(
  CategoryScale,
  // LinearScale,
  // PointElement,
  // LineElement,
  // Title,
  // Tooltip,
  // Legend,
  // Filler,
  ...registerables,
);

const initialData: ChartData<"line"> = {
  labels: [],
  datasets: [],
};

const initialOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: "linear",
      title: {
        display: false,
      },
      min: 1,
      ticks: {
        autoSkip: true,
        color: "rgba(255, 255, 255,1)",
        maxTicksLimit: 5,
        callback: function (value) {
          const val = parseFloat(value.toString());
          if (val > 2) {
            return Math.ceil(val) + "×";
          } else return parseFloat(value.toString())?.toFixed(1) + "×";
        },
      },
      grid: {
        display: true,
        color: "rgba(255, 255, 255, 0.1)", // Light grid color
      },
    },
    x: {
      type: "linear",
      title: {
        display: false,
      },
      ticks: {
        stepSize: 2,
        color: "rgba(255, 255, 255,1)",
        maxTicksLimit: 4,
        callback: function (value) {
          const val = parseFloat(value.toString());
          return Math.round(val) + "s"; // Add 's' symbol for seconds
        },
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: false, // Disable tooltips
    },
  },
  animation: {
    // @ts-expect-error: Allow
    x: {
      type: "number",
      easing: "linear",
      duration: 0,
      from: 5,
      delay: 0,
    },
    y: {
      type: "number",
      easing: "linear",
      duration: 0,
      from: 5,
      delay: 0,
    },
    loop: true,
  },
};

type Props = {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
};

// const ballSound = new Audio(ballAudio);
// ballSound.volume = 0.2;
// ballSound.currentTime = 0;
// ballSound.play();

export default function CrashChart({ gamePhase, setGamePhase }: Props) {
  const [chartData, setChartData] = useState<ChartData<"line">>(initialData);
  const [chartOptions, setChartOptions] =
    useState<ChartOptions<"line">>(initialOptions);
  const [chartId, setChartId] = useState("");
  const [liveMultiplier, setLiveMultiplier] = useState(0);
  const [betPhaseTime, setBetPhaseTime] = useState("");
  const [liveMultiplierSwitch, setLiveMultiplierSwitch] = useState(false);
  const [gamePhaseTimeElapsed, setGamePhaseTimeElapsed] = useState(0);
  const [chartSwitch, setChartSwitch] = useState(false);
  const [globalTimeNow, setGlobalTimeNow] = useState(0);
  const [gameStopped, setGameStopped] = useState(false);

  const chartRef = useRef<ChartJs<"line">>(null);
  const multiplierCount = useRef<number[]>([]);
  const timeCountXaxis = useRef<number[]>([]);
  const realCounterYaxis = useRef(5);

  useEffect(() => {
    // socket.emit("CRASH:get_graph");

    socket.on("CRASH:start", (data) => {
      console.log("START: first ");
      setChartId(Math.random().toString());
      setChartSwitch(true);
      setGameStopped(false);

      (() => {
        console.log("THIS RAN!");
        setChartData({ ...initialData, datasets: [{ data: [] }] });
        chartRef?.current?.data?.labels?.pop();
        chartRef?.current?.data.datasets.forEach((dataset) => {
          dataset.data.pop();
        });
        chartRef?.current?.reset();
      })();
      setTimeout(() => {
        console.log("START: second ", data);
        setGamePhase(GamePhase.game);
        setGlobalTimeNow(Date.now());
        setLiveMultiplierSwitch(true);
      }, 1000);
    });

    socket.on("CRASH:stop", (data) => {
      console.log("CRASH:End", { data });
      setLiveMultiplier(data);
      setLiveMultiplierSwitch(false);
      setGamePhase(GamePhase.cashout);
      setGameStopped(true);
    });

    socket.on("CRASH:bet", () => {
      setGlobalTimeNow(Date.now());
      setLiveMultiplier(0.999999);
      setGamePhase(GamePhase.bet);
      setChartSwitch(false);

      multiplierCount.current = [];
      timeCountXaxis.current = [];
    });
  }, []);

  useEffect(() => {
    if (!chartSwitch) return;
    const tempInterval = setInterval(() => {
      setChartSwitch(false);
      sendToChart();
      chartRef?.current?.update();
    }, 10);

    return () => {
      clearInterval(tempInterval);
      setChartSwitch(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartSwitch]);

  const sendToChart = () => {
    const latestPointIndex = multiplierCount.current.length - 1;
    setChartData({
      labels: timeCountXaxis.current,
      datasets: [
        {
          label: chartId,
          data: multiplierCount.current,
          // backgroundColor: "rgba(68, 131, 235, 0.5)",
          backgroundColor: !gameStopped ? "#4483EB" : "#35425b73",
          borderColor: !gameStopped ? "#4483EB" : "#35425b73",
          borderDash: [0],
          pointBackgroundColor: !gameStopped ? "#fff" : "#ccc",
          pointBorderColor: !gameStopped ? "#fff" : "#ccc",
          pointHoverBackgroundColor: !gameStopped ? "#fff" : "#ccc",
          pointHoverBorderColor: !gameStopped ? "#fff" : "#ccc",
          pointRadius: (context) =>
            context.dataIndex === latestPointIndex ? 12 : 0,
          pointHoverRadius: 7,
          pointStyle: "circle",
          borderWidth: 2,
          tension: 0.1,
          fill: true,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          title: {
            display: false,
          },
          min: 1,
          max: liveMultiplier > 2 ? liveMultiplier : 2,
          ticks: {
            autoSkip: true,
            color: "rgba(255, 255, 255,1)",
            maxTicksLimit: 5,
            callback: function (value) {
              const val = parseFloat(value.toString());
              if (val > 2) {
                return Math.ceil(val) + "×";
              } else return parseFloat(value.toString())?.toFixed(1) + "×";
            },
          },
          grid: {
            display: true,
            color: "rgba(255, 255, 255, 0.1)", // Light grid color
          },
        },

        x: {
          type: "linear",
          title: {
            display: false,
          },
          max: gamePhaseTimeElapsed > 8 ? gamePhaseTimeElapsed : 8,
          ticks: {
            stepSize: 2,
            color: "rgba(255, 255, 255,1)",
            maxTicksLimit: 4,
            callback: function (value) {
              const val = parseFloat(value.toString());
              return Math.round(val) + "s"; // Add 's' symbol for seconds
            },
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false, // Disable tooltips
        },
      },
      animation: {
        // @ts-expect-error: Allow
        x: {
          type: "number",
          easing: "linear",
          duration: 0,
          from: 5,
          delay: 0,
        },
        y: {
          type: "number",
          easing: "linear",
          duration: 0,
          from: 5,
          delay: 0,
        },
        loop: true,
      },
    });
  };

  useEffect(() => {
    console.log({ liveMultiplierSwitch });
    if (liveMultiplierSwitch) {
      setLiveMultiplier(1);

      const gameCounter = setInterval(() => {
        const timeElapsed = (Date.now() - globalTimeNow) / 1000.0;
        setGamePhaseTimeElapsed(timeElapsed);
        setLiveMultiplier(
          parseFloat((1.0024 * Math.pow(1.0718, timeElapsed))?.toFixed(2)),
        );

        if (multiplierCount.current.length < 1) {
          multiplierCount.current = [...multiplierCount.current, 1];
          timeCountXaxis.current = [...timeCountXaxis.current, 0];
        }
        if (realCounterYaxis.current % 5 === 0) {
          multiplierCount.current = [
            ...multiplierCount.current,
            parseFloat((1.0024 * Math.pow(1.0718, timeElapsed))?.toFixed(2)),
          ];
          timeCountXaxis.current = [...timeCountXaxis.current, timeElapsed];
        }
        realCounterYaxis.current += 1;
      }, 1);

      return () => {
        clearInterval(gameCounter);
      };
    }
  }, [liveMultiplierSwitch]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gamePhase === GamePhase.bet) {
      console.log("BET_RUNNING!");
      interval = setInterval(() => {
        const timeElapsed = (Date.now() - globalTimeNow) / 1000.0;
        const timeRemaining = parseFloat((5 - timeElapsed)?.toFixed(2));
        setBetPhaseTime(timeRemaining?.toFixed(2));
        if (timeRemaining <= 0) {
          console.log("GAME_PHASE_NOW!");
          setGamePhase(GamePhase.game);
        }
      }, 10);
    }
    return () => {
      clearInterval(interval);
      setBetPhaseTime("Starting...");
    };
  }, [gamePhase, globalTimeNow]);

  useEffect(() => {
    console.log({ gamePhase });
  }, [gamePhase]);

  return (
    <>
      <div className="absolute z-10 flex font-bold text-white -translate-y-12 text-5xl md:text-6xl lg:text-7xl">
        {gamePhase === GamePhase.bet ? (
          <p>Starting in... {betPhaseTime}</p>
        ) : (
          <div className={clsx("flex", gameStopped && "text-red-800")}>
            <p>
              {gameStopped && "Crashed @"} {liveMultiplier?.toFixed(2)}
            </p>
            <span className="text-3xl md:text-6xl">×</span>
          </div>
        )}
      </div>
      <div className="min-h-[450px] overflow-hidden relative w-full rounded-md">
        <Chart
          ref={chartRef}
          type="line"
          datasetIdKey="id"
          updateMode={"none"}
          data={chartData}
          options={chartOptions}
        />
      </div>
    </>
  );
}
