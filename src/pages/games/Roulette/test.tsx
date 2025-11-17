// import React, { useState, useRef } from "react";
// import "./test.css";
import {
  DiamondLockIcon,
  FIst,
  LuckPLant,
  SilverLockIcon,
  Wrench,
  YellowLockIcon,
} from "@/assets/icons";

// interface RouletteProps {
//   items: string[]; // Array of image URLs
// }

// const Roulette: React.FC<RouletteProps> = ({
//   items = [SilverLockIcon, YellowLockIcon, DiamondLockIcon, Wrench],
// }) => {
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<string | null>(null);
//   const rouletteRef = useRef<HTMLDivElement>(null);

//   const spinRoulette = () => {
//     setIsSpinning(true);
//     const stopIndex = Math.floor(Math.random() * items.length);
//     const stopTime = 3000; // 3 seconds

//     const startTime = Date.now();
//     const spinInterval = setInterval(() => {
//       const elapsedTime = Date.now() - startTime;
//       const currentIndex = Math.floor(elapsedTime / 100) % items.length;
//       if (elapsedTime >= stopTime) {
//         clearInterval(spinInterval);
//         setIsSpinning(false);
//         setSelectedItem(items[stopIndex]);
//       }
//       if (rouletteRef.current) {
//         rouletteRef.current.style.transform = `translateY(-${currentIndex * 100}px)`;
//       }
//     }, 100);
//   };

//   return (
//     <div className="roulette-container">
//       <div
//         ref={rouletteRef}
//         className={`roulette ${isSpinning ? "spinning" : ""}`}
//       >
//         {items.map((item, index) => (
//           <div key={index} className="roulette-item">
//             <img src={item} alt={`Item ${index}`} />
//           </div>
//         ))}
//       </div>
//       <button onClick={spinRoulette} disabled={isSpinning}>
//         Spin
//       </button>
//       {selectedItem && (
//         <div className="selected-item">
//           <img src={selectedItem} alt="Selected Item" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Roulette;

// import React, { useState, useRef } from "react";
// import "./test.css";

// interface RouletteProps {
//   items: string[]; // Array of image URLs
// }

// const Roulette: React.FC<RouletteProps> = ({
//   items = [
//     SilverLockIcon,
//     YellowLockIcon,
//     DiamondLockIcon,
//     Wrench,
//     SilverLockIcon,
//     YellowLockIcon,
//     DiamondLockIcon,
//     Wrench,
//     SilverLockIcon,
//     YellowLockIcon,
//     DiamondLockIcon,
//     Wrench,
//     SilverLockIcon,
//     YellowLockIcon,
//     DiamondLockIcon,
//     Wrench,
//     SilverLockIcon,
//     YellowLockIcon,
//     DiamondLockIcon,
//     Wrench,
//     SilverLockIcon,
//     YellowLockIcon,
//     DiamondLockIcon,
//     Wrench,
//   ],
// }) => {
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<string | null>(null);
//   const rouletteRef = useRef<HTMLDivElement>(null);
//   const itemWidth = 100; // Width of each item in pixels

//   const spinRoulette = () => {
//     setIsSpinning(true);
//     const stopTime = 5000; // 5 seconds

//     const startTime = Date.now();
//     const spinInterval = setInterval(() => {
//       const elapsedTime = Date.now() - startTime;
//       if (elapsedTime >= stopTime) {
//         clearInterval(spinInterval);
//         setIsSpinning(false);
//         const centerIndex = Math.floor(
//           (rouletteRef.current!.scrollLeft +
//             rouletteRef.current!.offsetWidth / 2) /
//             itemWidth,
//         );
//         setSelectedItem(items[centerIndex]);
//         rouletteRef.current!.scrollLeft =
//           centerIndex * itemWidth -
//           rouletteRef.current!.offsetWidth / 2 +
//           itemWidth / 2;
//       } else {
//         const spinSpeed = 100000000; // Adjust spin speed here
//         const scrollAmount = spinSpeed * (Math.random() + 1); // Randomize scroll amount

//         rouletteRef.current!.scrollLeft += scrollAmount;
//       }
//     }, 50);
//   };

//   return (
//     <div className="roulette-container">
//       <div
//         ref={rouletteRef}
//         className={`roulette ${isSpinning ? "spinning" : ""}`}
//       >
//         {items.map((item, index) => (
//           <div key={index} className="roulette-item">
//             <img src={item} alt={`Item ${index}`} />
//           </div>
//         ))}
//       </div>
//       <button onClick={spinRoulette} disabled={isSpinning}>
//         Spin
//       </button>
//       {selectedItem && (
//         <div className="selected-item">
//           <img src={selectedItem} alt="Selected Item" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Roulette;

import React, { useState, useRef, useEffect } from "react";
import "./test.css";
import clsx from "clsx";

interface Item {
  label: string;
  start: number;
  end: number;
}

const Roulette: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(9);

  const [items, setItems] = useState<{ elements: Item[]; totalSum: number }>({
    elements: [],
    totalSum: 0,
  });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [prevSelectedItemIndex, setPrevSelectedItemIndex] = useState<
    string | null
  >(null);
  const rouletteRef = useRef<HTMLDivElement>(null);
  const itemWidth = 100; // Width of each item in pixels

  // const timeLeft = useTimer();

  const [timeLeft, setTimeLeft] = useState(9);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime === 0 ? 9 : prevTime - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { elements, totalSum } = generateItems();
    console.log({ totalSum, elements });
    setItems({ elements, totalSum });
  }, []);

  const spinRoulette = async () => {
    setIsSpinning(true);

    // Simulate backend call to get selected item
    const selectedLabel = await fetchSelectedItem();
    const selectedItemIndex = items.elements.findIndex(
      (item) => item.label === selectedLabel,
    );

    // Scroll to the selected item
    if (rouletteRef.current) {
      rouletteRef.current.scrollLeft =
        selectedItemIndex * itemWidth -
        rouletteRef.current.offsetWidth / 2 +
        itemWidth / 2;

      // rouletteRef.current.scrollLeft = items.elements.length * itemWidth;

      console.log({
        scrollLeft: rouletteRef.current.scrollLeft,
        offSetWidth: rouletteRef.current.offsetWidth,
      });
    }

    setIsSpinning(false);
    setSelectedItem(selectedLabel);
  };

  useEffect(() => {
    console.log({ selectedItem });
  }, [selectedItem]);

  useEffect(() => {
    if (!items.elements || !items.totalSum) return;
    // setTimeLeft(9);
    const interval = setInterval(() => {
      // setInterval(() => {
      //   // setTimeLeft((prev) => prev--);
      // }, 1000);
      console.log("spinRoulette---------->");
      spinRoulette();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log({ timeLeft });
  }, [timeLeft]);

  const fetchSelectedItem = async (): Promise<string> => {
    // Simulate backend call
    const response = await new Promise<string>((resolve) => {
      setTimeout(() => {
        // const { elements, totalSum } = generateItems();
        const { element } = getRandomLabel(items.elements, items.totalSum);
        resolve(element);
      }, 3000); // Simulate 3 seconds delay for backend response
    });
    return response;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center w-full h-20">
        <div className="absolute z-50 mx-auto text-3xl text-white top-4 w-fit">
          {timeLeft}
        </div>
      </div>
      <div
        ref={rouletteRef}
        className={`roulette transition-all duration-300 relative ${isSpinning ? "spinning" : ""}`}
      >
        {items.elements.map((item, index) => (
          <div key={index} className={clsx("roulette-item p-1")}>
            <div
              className={clsx(
                "text-center p-4 outline_ outline-1 outline-gray-500 rounded-md",
                item.label.split("Label")[1] === "A"
                  ? "bg-red-600"
                  : item.label.split("Label")[1] === "B"
                    ? "bg-green-400"
                    : "bg-gray-950",
              )}
            >
              {/* <span className="font-bold bg-red-400 text-8xl_">
                {item.label.split("Label")[1]}
              </span> */}
              <img
                src={
                  item.label.split("Label")[1] === "A"
                    ? Wrench
                    : item.label.split("Label")[1] === "B"
                      ? LuckPLant
                      : FIst
                }
                className="w-full h-full opacity-60"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute flex items-center justify-center w-full h-28 top-1/3">
        <div className="w-1 h-full text-center bg-white selected-item">
          {/* <span>{selectedItem}</span> */}
        </div>
      </div>

      <div className="mx-auto mt-6 w-fit">
        {/* <button
          className="p-1 bg-gray-700 rounded-sm"
          onClick={spinRoulette}
          disabled={isSpinning}
        >
          Spin Roulette
        </button> */}
      </div>
    </div>
  );
};

export default Roulette;

// Backend functions
function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateItems(): { elements: Item[]; totalSum: number } {
  const labels: string[] = [];
  for (let i = 1; i <= 36; i++) {
    labels.push(`Item${i}Label${String.fromCharCode(65 + (i % 3))}`);
  }
  shuffleArray(labels);

  const elements: Item[] = [];
  let totalSum = 0;

  for (let i = 0; i < 36; i++) {
    let rangeLength;
    switch (labels[i].charAt(labels[i].length - 1)) {
      case "A":
        rangeLength = 30;
        break;
      case "B":
        rangeLength = 8;
        break;
      case "C":
        rangeLength = 45;
        break;
      default:
        rangeLength = 0;
    }
    const startNumber = i === 0 ? 0 : elements[i - 1].end + 1;
    const endNumber = startNumber + rangeLength - 1;
    elements.push({ label: labels[i], start: startNumber, end: endNumber });
    totalSum += rangeLength;
  }

  return { elements, totalSum };
}

function getRandomLabel(
  elements: Item[],
  totalSum: number,
): { element: string; randomNumber: number } {
  const randomNumber = Math.floor(Math.random() * totalSum);
  let cumulativeSum = 0;

  for (const element of elements) {
    cumulativeSum += element.end - element.start + 1;
    if (randomNumber < cumulativeSum) {
      return { element: element.label, randomNumber };
    }
  }

  // In case the random number exceeds the total sum, return the last element's label
  return { element: elements[elements.length - 1].label, randomNumber };
}

function useTimer() {
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState("0");

  const getTimeRemaining = (e) => {
    // @ts-ignore
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      // setTimer(
      //   (hours > 9 ? hours : "0" + hours) +
      //     ":" +
      //     (minutes > 9 ? minutes : "0" + minutes) +
      //     ":" +
      //     (seconds > 9 ? seconds : "0" + seconds),
      // );

      setTimer((seconds > 9 ? seconds : "0" + seconds).toString());
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("00:00:10");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    // @ts-ignore
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you intend to add more time
    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  return timer;
}
