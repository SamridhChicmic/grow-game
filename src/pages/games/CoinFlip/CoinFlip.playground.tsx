// import React, { useEffect, useState } from "react";
// import { Heads, SilverLockIcon, Tails } from "@/assets/icons";
// import "./coinflip.css";

// const CoinFlipGame: React.FC = () => {
//   const [balance, setBalance] = useState(0);
//   const [bet, setBet] = useState(1);
//   const [multiplier, setMultiplier] = useState(1);
//   const [result, setResult] = useState<"Heads" | "Tails" | null>(null);

//   useEffect(() => {
//     const coinIcon = document.getElementById("coin");
//     const tossBtn = document.getElementById("toss-button") as HTMLButtonElement;
//     if (!(coinIcon && tossBtn)) return;
//     tossBtn.addEventListener("click", () => {
//       tossBtn.disabled = true;
//       tossCoinFunction();
//     });
//     function tossCoinFunction() {
//       if (!(coinIcon && tossBtn)) return;
//       const randomVal = Math.random();
//       const faceCoin = randomVal < 0.5 ? "Heads" : "Tails";
//       const imageUrl = faceCoin === "Heads" ? Heads : Tails;

//       coinIcon.classList.add("flip");
//       setTimeout(() => {
//         coinIcon.innerHTML = `<img src="${imageUrl}" alt="${faceCoin}" style="imageRendering: pixelated;"/>`;
//         coinIcon.classList.remove("flip");
//         setTimeout(() => {
//           tossBtn.disabled = false;
//         }, 500);
//       }, 1000);
//     }
//   }, []);

//   const flipCoin = () => {
//     const coin = Math.random() < 0.5 ? "Heads" : "Tails";
//     return coin;
//   };

//   const handleBet = (choice: "Heads" | "Tails") => {
//     const coinResult = flipCoin();
//     setResult(coinResult);
//     if (coinResult === choice) {
//       const winnings = bet * multiplier;
//       setBalance(balance + winnings);
//       setMultiplier(multiplier + 1);
//     } else {
//       setBalance(0);
//       setMultiplier(1);
//     }
//   };

//   const handleCashOut = () => {
//     setBalance(0);
//     setMultiplier(1);
//   };

//   return (
//     <div>
//       <h1>Coin Flip Game</h1>
//       <p>Balance: ${balance}</p>
//       <p>Current Bet: ${bet}</p>
//       <p>Current Multiplier: {multiplier}x</p>
//       {result && <p>Result: {result}</p>}
//       <button onClick={() => handleBet("Heads")}>Bet Heads</button>
//       <button onClick={() => handleBet("Tails")}>Bet Tails</button>
//       <button onClick={handleCashOut}>Cash Out</button>

//       <div className={"coin"} id="coin">
//         <img
//           src={Tails}
//           alt="Heads"
//           className=""
//           style={{
//             imageRendering: "pixelated",
//           }}
//         />
//       </div>
//       <button id="toss-button">Toss Coin</button>
//     </div>
//   );
// };

// export default CoinFlipGame;

// import React, { useEffect, useState } from "react";
// import { Heads, SilverLockIcon, Tails } from "@/assets/icons";
// import "./coinflip.css";

// const CoinFlipGame: React.FC = () => {
//   const [balance, setBalance] = useState<number>(0);
//   const [bet, setBet] = useState<number>(1);
//   const [multiplier, setMultiplier] = useState<number>(1);
//   const [result, setResult] = useState<"Heads" | "Tails" | null>(null);

//   useEffect(() => {
//     const tossCoinFunction = () => {
//       const randomVal = Math.random();
//       const faceCoin = randomVal < 0.5 ? "Heads" : "Tails";
//       const imageUrl = faceCoin === "Heads" ? Heads : Tails;

//       setTimeout(() => {
//         setResult(faceCoin);
//         setMultiplier((prevMultiplier) => (faceCoin === result ? prevMultiplier + 1 : 1));
//         setBalance((prevBalance) => (faceCoin === result ? prevBalance + bet * multiplier : 0));
//       }, 1000);
//     };

//     const tossBtn = document.getElementById("toss-button") as HTMLButtonElement;
//     if (tossBtn) {
//       tossBtn.addEventListener("click", () => {
//         tossBtn.disabled = true;
//         tossCoinFunction();
//         setTimeout(() => {
//           tossBtn.disabled = false;
//         }, 1500);
//       });
//     }

//     return () => {
//       if (tossBtn) {
//         tossBtn.removeEventListener("click", tossCoinFunction);
//       }
//     };
//   }, [bet, multiplier, result]);

//   const flipCoin = (): "Heads" | "Tails" => {
//     return Math.random() < 0.5 ? "Heads" : "Tails";
//   };

//   const handleBet = (choice: "Heads" | "Tails") => {
//     const coinResult = flipCoin();
//     setResult(coinResult);
//     if (coinResult === choice) {
//       const winnings = bet * multiplier;
//       setBalance((prevBalance) => prevBalance + winnings);
//       setMultiplier((prevMultiplier) => prevMultiplier + 1);
//     } else {
//       setBalance(0);
//       setMultiplier(1);
//     }
//   };

//   const handleCashOut = () => {
//     setBalance(0);
//     setMultiplier(1);
//   };

//   return (
//     <div>
//       <h1>Coin Flip Game</h1>
//       <p>Balance: ${balance}</p>
//       <p>Current Bet: ${bet}</p>
//       <p>Current Multiplier: {multiplier}x</p>
//       {result && <p>Result: {result}</p>}
//       <button onClick={() => handleBet("Heads")}>Bet Heads</button>
//       <button onClick={() => handleBet("Tails")}>Bet Tails</button>
//       <button onClick={handleCashOut}>Cash Out</button>

//       <div className={"coin"} id="coin">
//         <img
//           src={result === "Heads" ? Heads : Tails}
//           alt={result || "Coin"}
//           style={{
//             imageRendering: "pixelated",
//           }}
//         />
//       </div>
//       <button id="toss-button">Toss Coin</button>
//     </div>
//   );
// };

// export default CoinFlipGame;

import React, { useEffect, useRef, useState } from "react";
import { Heads, Tails } from "@/assets/icons";
import "./coinflip.css";

const CoinFlipGame: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [bet, setBet] = useState<number>(1);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [result, setResult] = useState<"H" | "T" | null>(null);
  const coinIconRef = useRef<HTMLDivElement>(null);
  const tossBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tossCoinFunction = () => {
      const randomVal = Math.random();
      const faceCoin = randomVal < 0.5 ? "H" : "T";
      const imageUrl = faceCoin === "H" ? Heads : Tails;

      if (coinIconRef.current) {
        coinIconRef.current.classList.add("flip");
        setTimeout(() => {
          if (coinIconRef.current) {
            coinIconRef.current.innerHTML = `<img src="${imageUrl}" alt="${faceCoin}" style="image-rendering: pixelated;"/>`;
            coinIconRef.current.classList.remove("flip");
          }
          if (tossBtnRef.current) {
            tossBtnRef.current.disabled = false;
          }
        }, 1000);
      }
    };

    const tossBtn = tossBtnRef.current;
    if (tossBtn) {
      tossBtn.addEventListener("click", () => {
        tossBtn.disabled = true;
        tossCoinFunction();
      });
    }

    return () => {
      if (tossBtn) {
        tossBtn.removeEventListener("click", tossCoinFunction);
      }
    };
  }, []);

  const flipCoin = (): "H" | "T" => {
    return Math.random() < 0.5 ? "H" : "T";
  };

  const handleBet = (choice: "H" | "T") => {
    const coinResult = flipCoin();
    setResult(coinResult);
    if (coinResult === choice) {
      const winnings = bet * multiplier;
      setBalance((prevBalance) => prevBalance + winnings);
      setMultiplier((prevMultiplier) => prevMultiplier + 1);
    } else {
      setBalance(0);
      setMultiplier(1);
    }
  };

  const handleCashOut = () => {
    setBalance(0);
    setMultiplier(1);
  };

  return (
    <div>
      <h1>Coin Flip Game</h1>
      <p>Balance: ${balance}</p>
      <p>Current Bet: ${bet}</p>
      <p>Current Multiplier: {multiplier}x</p>
      {result && <p>Result: {result}</p>}
      <button onClick={() => handleBet("H")}>Bet Heads</button>
      <button onClick={() => handleBet("T")}>Bet Tails</button>
      <button onClick={handleCashOut}>Cash Out</button>

      <div className={"coin"} ref={coinIconRef}>
        <img
          src={Tails}
          alt="Heads"
          className=""
          style={{
            imageRendering: "pixelated",
          }}
        />
      </div>
      <button ref={tossBtnRef} id="toss-button">
        Toss Coin
      </button>
    </div>
  );
};

export default CoinFlipGame;
