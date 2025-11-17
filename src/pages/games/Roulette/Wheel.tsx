// import clsx from "clsx";
// import "./RouletteWheel.css";

// import React, { useCallback, useEffect, useRef } from "react";
// import { FIst, LuckPLant, Wrench } from "@/assets/icons";

// const Roulette = ({ outcome, elements }) => {
//   const wheelRef = useRef<HTMLDivElement>(null);
//   // const [outcome, setOutcome] = useState("");

//   const initWheel = () => {
//     const wheel = wheelRef.current;
//     let row = "";
//     row += "<div class='row'>";
//     // row += "  <div class='card red'>1</div>";
//     // row += "  <div class='card black'>14</div>";
//     // row += "  <div class='card red'>2</div>";
//     // row += "  <div class='card black'>13</div>";
//     // row += "  <div class='card red'>3</div>";
//     // row += "  <div class='card black'>12</div>";
//     // row += "  <div class='card red'>4</div>";
//     // row += "  <div class='card green'>0</div>";
//     // row += "  <div class='card black'>11</div>";
//     // row += "  <div class='card red'>5</div>";
//     // row += "  <div class='card black'>10</div>";
//     // row += "  <div class='card red'>6</div>";
//     // row += "  <div class='card black'>9</div>";
//     // row += "  <div class='card red'>7</div>";
//     // row += "  <div class='card black'>8</div>";
//     // row += "</div>";

//     elements.forEach((item) => {
//       row += `<div class='${`card text-center p-2 outline_ outline-1 outline-gray-500 rounded-md"
//           ${
//             item.label.split("Label")[1] === "A"
//               ? "bg-red-600"
//               : item.label.split("Label")[1] === "B"
//                 ? "bg-green-400"
//                 : item.label.split("Label")[1] === "C"
//                   ? "bg-gray-950"
//                   : "bg-red-600"
//           }
//       `}'>
//       ${item.label.split("Label")[1]}
//       <img src="${
//         item.label.split("Label")[1] === "A"
//           ? "/images/icons/wrench.webp"
//           : item.label.split("Label")[1] === "B"
//             ? "/images/icons/luck-plant.webp"
//             : "/images/icons/fist.webp"
//       }"/>
//       </div>`;
//     });
//     row += "</div>";

//     for (let x = 0; x < elements.length - 1; x++) {
//       if (!wheel) return;
//       wheel.innerHTML += row;
//     }

//     spinWheel(outcome);
//   };

//   useEffect(() => {
//     console.log("INIT!");
//     initWheel();
//   }, [outcome]);

//   const spinWheel = (roll) => {
//     const wheel = wheelRef.current;
//     // const order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
//     const order = elements;
//     const position = order.indexOf(parseInt(roll));

//     const rows = 12;
//     const card = 75 + 3 * 2;
//     let landingPosition = rows * 15 * card + position * card;

//     const randomize = Math.floor(Math.random() * 75) - 75 / 2;

//     landingPosition += randomize;

//     const object = {
//       x: Math.floor(Math.random() * 50) / 100,
//       y: Math.floor(Math.random() * 20) / 100,
//     };

//     if (!wheel) return;
//     wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
//     wheel.style.transitionDuration = "3s";
//     wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;

//     setTimeout(() => {
//       wheel.style.transitionTimingFunction = "";
//       wheel.style.transitionDuration = "";
//       const resetTo = -(position * card + randomize);
//       wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
//     }, 3000);
//   };

//   // useEffect(() => {
//   //   console.log("SPIN_WHEEL");
//   //   spinWheel(outcome);
//   // }, [outcome]);

//   return (
//     <div>
//       <div className="roulette-wrapper">
//         <div className="selector"></div>
//         <div className="wheel" ref={wheelRef}>
//           {/* <div className="row">
//             {elements.map((item) => {
//               return (
//                 <div
//                   className={clsx(
//                     "card text-center p-2 outline_ outline-1 outline-gray-500 rounded-md",
//                     item.label.split("Label")[1] === "A"
//                       ? "bg-red-600"
//                       : item.label.split("Label")[1] === "B"
//                         ? "bg-green-400"
//                         : "bg-gray-950",
//                   )}
//                 >
//                   <img
//                     src={
//                       item.label.split("Label")[1] === "A"
//                         ? Wrench
//                         : item.label.split("Label")[1] === "B"
//                           ? LuckPLant
//                           : FIst
//                     }
//                     className="w-full h-full opacity-60"
//                   />
//                 </div>
//               );
//             })}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Roulette;

import React, { useRef, useEffect } from "react";
import "./RouletteWheel.css";
import clsx from "clsx";
import { FIst, LuckPLant, Wrench } from "@/assets/icons";

const cards = [
  { label: "A", number: 1 },
  { label: "C", number: 14 },
  { label: "A", number: 2 },
  { label: "C", number: 13 },
  { label: "A", number: 3 },
  { label: "C", number: 12 },
  { label: "A", number: 4 },
  { label: "B", number: 0 },
  { label: "C", number: 11 },
  { label: "A", number: 5 },
  { label: "C", number: 10 },
  { label: "A", number: 6 },
  { label: "C", number: 9 },
  { label: "A", number: 7 },
  { label: "C", number: 8 },
];

const rows = Array(29).fill(cards).flat();

type Props = {
  outcome: number;
  setRolling: React.Dispatch<React.SetStateAction<boolean>>;
};

function App({ outcome, setRolling }: Props) {
  // const [outcome, setOutcome] = useState("");
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    spinWheel(outcome);
  }, [outcome]);

  const spinWheel = (roll) => {
    const startTime = Date.now();
    setRolling(true);

    const wheel = wheelRef.current;
    const order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
    const position = order.indexOf(parseInt(roll));

    // Determine position where to land
    const rows = 12;
    const card = 75 + 3 * 2;
    let landingPosition = rows * cards.length * card + position * card;

    const randomize = Math.floor(Math.random() * 75) - 75 / 2;
    landingPosition = landingPosition + randomize;

    const object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };

    // if (wheel) {
    //   wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
    //   wheel.style.transitionDuration = "6s";
    //   wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;

    //   setTimeout(() => {
    //     wheel.style.transitionTimingFunction = "";
    //     wheel.style.transitionDuration = "";
    //     const resetTo = -(position * card + randomize);
    //     wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
    //   }, 6 * 1000);
    // }

    const handleTransitionEnd = () => {
      console.log("Wheel has stopped spinning");
      if (wheel) {
        wheel.removeEventListener("transitionend", handleTransitionEnd);

        // Reset to the final position
        const resetTo = -(position * card + randomize);
        wheel.style.transitionTimingFunction = "";
        wheel.style.transitionDuration = "";
        wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
        setRolling(false);
        const endTime = Date.now();

        const diff = endTime - startTime;
        console.log({ diff });
      }
    };

    if (wheel) {
      wheel.addEventListener("transitionend", handleTransitionEnd);

      wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
      wheel.style.transitionDuration = "6s";
      wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;
    }
  };

  return (
    <div className="App">
      <div className="roulette-wrapper">
        <div className="w-[4px] bg-white h-full -translate-x-1/2 absolute z-10 " />
        <div className="wheel" ref={wheelRef}>
          {rows.map((_, index) => {
            return (
              <div key={index} className="row">
                {cards.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "card text-center p-2 outline_ outline-1 outline-gray-500 rounded-md",
                        card.label === "A"
                          ? "red"
                          : card.label === "B"
                            ? "green"
                            : "black",
                      )}
                    >
                      <img
                        src={
                          card.label === "A"
                            ? Wrench
                            : card.label === "B"
                              ? LuckPLant
                              : FIst
                        }
                        style={{ imageRendering: "pixelated" }}
                        className="w-[80%] aspect-square opacity-60"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          spinWheel(outcome);
        }}
      >
        <input
          placeholder="outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
        />
        <button type="submit">Spin Wheel</button>
      </form> */}
    </div>
  );
}

export default App;

// import React, { useState, useRef } from "react";
// import "./RouletteWheel.css";

// const defaultCards = [
//   { color: "red", number: 1 },
//   { color: "black", number: 14 },
//   { color: "red", number: 2 },
//   { color: "black", number: 13 },
//   { color: "red", number: 3 },
//   { color: "black", number: 12 },
//   { color: "red", number: 4 },
//   { color: "green", number: 0 },
//   { color: "black", number: 11 },
//   { color: "red", number: 5 },
//   { color: "black", number: 10 },
//   { color: "red", number: 6 },
//   { color: "black", number: 9 },
//   { color: "red", number: 7 },
//   { color: "black", number: 8 },
// ];

// const defaultRows = 12;
// const defaultCardWidth = 75;
// const defaultCardMargin = 3;

// const generateOrderArray = (cards) => {
//   return cards.map((card) => card.number);
// };

// const calculateLandingPosition = (
//   rows,
//   cardsLength,
//   cardWidth,
//   cardMargin,
//   position,
// ) => {
//   const card = cardWidth + cardMargin * 2;
//   const landingPosition = rows * cardsLength * card + position * card;
//   const randomize = Math.floor(Math.random() * card) - card / 2;
//   return landingPosition + randomize;
// };

// function App() {
//   const [outcome, setOutcome] = useState("");
//   const wheelRef = useRef<HTMLDivElement>(null);
//   const order = generateOrderArray(defaultCards);

//   const spinWheel = (roll) => {
//     const wheel = wheelRef.current;
//     const position = order.indexOf(parseInt(roll));

//     const landingPosition = calculateLandingPosition(
//       defaultRows,
//       defaultCards.length,
//       defaultCardWidth,
//       defaultCardMargin,
//       position,
//     );

//     const randomize = Math.floor(Math.random() * 75) - 75 / 2;

//     const object = {
//       x: Math.floor(Math.random() * 50) / 100,
//       y: Math.floor(Math.random() * 20) / 100,
//     };

//     if (wheel) {
//       wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
//       wheel.style.transitionDuration = "6s";
//       wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;

//       setTimeout(() => {
//         wheel.style.transitionTimingFunction = "";
//         wheel.style.transitionDuration = "";
//         const resetTo = -(
//           position * (defaultCardWidth + defaultCardMargin * 2) +
//           randomize
//         );
//         wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
//       }, 6 * 1000);
//     }
//   };

//   const rows = Array(defaultRows).fill(defaultCards).flat();

//   return (
//     <div className="App">
//       <div className="roulette-wrapper">
//         <div className="selector"></div>
//         <div className="wheel" ref={wheelRef}>
//           {rows.map((_, rowIndex) => (
//             <div key={rowIndex} className="row">
//               {defaultCards.map((card, cardIndex) => (
//                 <div key={cardIndex} className={`card ${card.color}`}>
//                   {card.number}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           spinWheel(outcome);
//         }}
//       >
//         <input
//           placeholder="outcome"
//           value={outcome}
//           onChange={(e) => setOutcome(e.target.value)}
//         />
//         <button type="submit">Spin Wheel</button>
//       </form>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useRef, useEffect } from "react";
// import "./RouletteWheel.css";

// // Configuration for the roulette wheel
// const config = {
//   cards: [
//     { color: "red", number: 1 },
//     { color: "black", number: 14 },
//     { color: "red", number: 2 },
//     { color: "black", number: 13 },
//     { color: "red", number: 3 },
//     { color: "black", number: 12 },
//     { color: "red", number: 4 },
//     { color: "green", number: 0 },
//     { color: "black", number: 11 },
//     { color: "red", number: 5 },
//     { color: "black", number: 10 },
//     { color: "red", number: 6 },
//     { color: "black", number: 9 },
//     { color: "red", number: 7 },
//     { color: "black", number: 8 },
//   ],
//   rows: 12,
//   cardWidth: 75,
//   transitionDuration: 6, // in seconds
// };

// const generateRows = (cards, numRows) => {
//   return Array(numRows).fill(cards).flat();
// };

// const App = () => {
//   const [outcome, setOutcome] = useState("");
//   const wheelRef = useRef<HTMLDivElement>(null);
//   const { cards, rows, cardWidth, transitionDuration } = config;

//   const spinWheel = (roll) => {
//     const wheel = wheelRef.current;
//     const order = cards.map((card) => card.number);
//     const position = order.indexOf(parseInt(roll));

//     if (position === -1) {
//       alert("Invalid roll number");
//       return;
//     }

//     const landingPosition =
//       rows * cards.length * cardWidth + position * cardWidth;
//     const randomize = Math.floor(Math.random() * cardWidth) - cardWidth / 2;
//     const finalLandingPosition = landingPosition + randomize;

//     const object = {
//       x: Math.floor(Math.random() * 50) / 100,
//       y: Math.floor(Math.random() * 20) / 100,
//     };

//     if (wheel) {
//       wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
//       wheel.style.transitionDuration = `${transitionDuration}s`;
//       wheel.style.transform = `translate3d(-${finalLandingPosition}px, 0px, 0px)`;

//       setTimeout(() => {
//         wheel.style.transitionTimingFunction = "";
//         wheel.style.transitionDuration = "";
//         const resetTo = -(position * cardWidth + randomize);
//         wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
//       }, transitionDuration * 1000);
//     }
//   };

//   const rowsArray = generateRows(cards, rows);

//   return (
//     <div className="App">
//       <div className="roulette-wrapper">
//         <div className="selector"></div>
//         <div className="wheel" ref={wheelRef}>
//           {rowsArray.map((_, rowIndex) => (
//             <div key={rowIndex} className="row">
//               {cards.map((card, cardIndex) => (
//                 <div key={cardIndex} className={`card ${card.color}`}>
//                   {card.number}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           spinWheel(outcome);
//         }}
//       >
//         <input
//           placeholder="outcome"
//           value={outcome}
//           onChange={(e) => setOutcome(e.target.value)}
//         />
//         <button type="submit">Spin Wheel</button>
//       </form>
//     </div>
//   );
// };

// export default App;

// import React, { useState, useRef, useEffect } from "react";
// import "./RouletteWheel.css";

// // Roulette wheel configuration
// const rouletteConfig = [
//   { color: "red", number: 1 },
//   { color: "black", number: 14 },
//   { color: "red", number: 2 },
//   { color: "black", number: 13 },
//   { color: "red", number: 3 },
//   { color: "black", number: 12 },
//   { color: "red", number: 4 },
//   { color: "green", number: 0 },
//   { color: "black", number: 11 },
//   { color: "red", number: 5 },
//   { color: "black", number: 10 },
//   { color: "red", number: 6 },
//   { color: "black", number: 9 },
//   // { color: "red", number: 7 },
//   { color: "black", number: 8 },
// ];

// // Function to generate rows based on the roulette configuration
// const generateRows = (config, numRows) => {
//   const rows = [];
//   for (let i = 0; i < numRows; i++) {
//     rows.push(...config);
//   }
//   return rows;
// };

// function App() {
//   const [outcome, setOutcome] = useState("");
//   const wheelRef = useRef<HTMLDivElement>(null);
//   const numRows = 12;
//   const rows = generateRows(rouletteConfig, numRows);

//   const spinWheel = (roll) => {
//     const wheel = wheelRef.current;
//     const numSlots = rouletteConfig.length;
//     const position = rouletteConfig.findIndex(
//       (slot) => slot.number === parseInt(roll),
//     );

//     // Determine position where to land
//     const cardWidth = 75 + 3 * 2;
//     let landingPosition = numRows * numSlots * cardWidth + position * cardWidth;

//     const randomize = Math.floor(Math.random() * 75) - 75 / 2;
//     landingPosition = landingPosition + randomize;

//     const object = {
//       x: Math.floor(Math.random() * 50) / 100,
//       y: Math.floor(Math.random() * 20) / 100,
//     };

//     if (wheel) {
//       wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
//       wheel.style.transitionDuration = "6s";
//       wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;

//       setTimeout(() => {
//         wheel.style.transitionTimingFunction = "";
//         wheel.style.transitionDuration = "";
//         const resetTo = -(position * cardWidth + randomize);
//         wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
//       }, 6 * 1000);
//     }
//   };

//   return (
//     <div className="App">
//       <div className="roulette-wrapper">
//         <div className="selector"></div>
//         <div className="wheel" ref={wheelRef}>
//           {rows.map((_, index) => {
//             return (
//               <div key={index} className="row">
//                 {rouletteConfig.map((slot, index) => {
//                   return (
//                     <div key={index} className={`card ${slot.color}`}>
//                       {slot.number}
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           spinWheel(outcome);
//         }}
//       >
//         <input
//           placeholder="outcome"
//           value={outcome}
//           onChange={(e) => setOutcome(e.target.value)}
//         />
//         <button type="submit">Spin Wheel</button>
//       </form>
//     </div>
//   );
// }

// export default App;
