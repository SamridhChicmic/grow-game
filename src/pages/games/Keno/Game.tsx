import React, { useState } from "react";
import KenoBoard from "./KenoBoard";

const payoutTables = {
  classic: {
    1: { 1: 2.5 },
    2: { 2: 5, 1: 0.5 },
    3: { 3: 50, 2: 5, 1: 1 },
    4: { 4: 150, 3: 15, 2: 2, 1: 1 },
    5: { 5: 500, 4: 50, 3: 5, 2: 2, 1: 1 },
    6: { 6: 1600, 5: 100, 4: 15, 3: 5, 2: 1 },
    7: { 7: 5000, 6: 500, 5: 50, 4: 10, 3: 2, 2: 1 },
    8: { 8: 15000, 7: 1500, 6: 100, 5: 25, 4: 5, 3: 2, 2: 1 },
    9: { 9: 25000, 8: 4000, 7: 500, 6: 50, 5: 10, 4: 5, 3: 2, 2: 1 },
    10: {
      10: 100000,
      9: 10000,
      8: 500,
      7: 100,
      6: 20,
      5: 10,
      4: 5,
      3: 2,
      2: 1,
      1: 0.5,
    },
  },
  low: {
    1: { 1: 1.5 },
    2: { 2: 3, 1: 0.25 },
    3: { 3: 30, 2: 3, 1: 0.5 },
    4: { 4: 100, 3: 10, 2: 1, 1: 0.5 },
    5: { 5: 300, 4: 30, 3: 3, 2: 1, 1: 0.5 },
    6: { 6: 1000, 5: 50, 4: 10, 3: 3, 2: 0.5 },
    7: { 7: 3000, 6: 300, 5: 30, 4: 5, 3: 1, 2: 0.5 },
    8: { 8: 10000, 7: 1000, 6: 50, 5: 15, 4: 3, 3: 1, 2: 0.5 },
    9: { 9: 20000, 8: 2000, 7: 300, 6: 30, 5: 5, 4: 3, 3: 1, 2: 0.5 },
    10: {
      10: 50000,
      9: 5000,
      8: 300,
      7: 50,
      6: 10,
      5: 5,
      4: 3,
      3: 1,
      2: 0.5,
      1: 0.25,
    },
  },
  medium: {
    1: { 1: 2 },
    2: { 2: 4, 1: 0.35 },
    3: { 3: 40, 2: 4, 1: 0.75 },
    4: { 4: 120, 3: 12, 2: 1.5, 1: 0.75 },
    5: { 5: 400, 4: 40, 3: 4, 2: 1.5, 1: 0.75 },
    6: { 6: 1400, 5: 70, 4: 12, 3: 4, 2: 1 },
    7: { 7: 4000, 6: 400, 5: 40, 4: 8, 3: 1.5, 2: 1 },
    8: { 8: 12000, 7: 1200, 6: 70, 5: 20, 4: 4, 3: 1.5, 2: 1 },
    9: { 9: 24000, 8: 2400, 7: 400, 6: 40, 5: 8, 4: 4, 3: 1.5, 2: 1 },
    10: {
      10: 60000,
      9: 6000,
      8: 400,
      7: 70,
      6: 15,
      5: 8,
      4: 4,
      3: 1.5,
      2: 1,
      1: 0.35,
    },
  },
  high: {
    1: { 1: 3 },
    2: { 2: 6, 1: 0.75 },
    3: { 3: 70, 2: 6, 1: 1.25 },
    4: { 4: 200, 3: 25, 2: 3, 1: 1.25 },
    5: { 5: 700, 4: 70, 3: 6, 2: 3, 1: 1.25 },
    6: { 6: 2000, 5: 150, 4: 25, 3: 6, 2: 2 },
    7: { 7: 7000, 6: 700, 5: 70, 4: 15, 3: 3, 2: 2 },
    8: { 8: 20000, 7: 2500, 6: 150, 5: 50, 4: 6, 3: 3, 2: 2 },
    9: { 9: 40000, 8: 5000, 7: 700, 6: 70, 5: 15, 4: 6, 3: 3, 2: 2 },
    10: {
      10: 100000,
      9: 10000,
      8: 700,
      7: 150,
      6: 30,
      5: 15,
      4: 6,
      3: 3,
      2: 2,
      1: 0.75,
    },
  },
};

const Game: React.FC = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [riskLevel, setRiskLevel] = useState<
    "classic" | "low" | "medium" | "high"
  >("classic");
  const [balance, setBalance] = useState<number>(100);
  const [bet, setBet] = useState<number>(1);
  const [result, setResult] = useState<{ hits: number; payout: number } | null>(
    null,
  );

  const selectedCount = selectedNumbers.length;

  const handleNumberSelect = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleDrawNumbers = () => {
    if (selectedNumbers.length === 0 || bet <= 0 || balance < bet) return;

    const newDrawnNumbers = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 80) + 1,
    );
    setDrawnNumbers(newDrawnNumbers);

    const hits = selectedNumbers.filter((num) =>
      newDrawnNumbers.includes(num),
    ).length;
    const payoutTable = payoutTables[riskLevel][selectedNumbers.length];
    const payoutMultiplier = payoutTable[hits] || 0;
    const payout = bet * payoutMultiplier;

    setResult({ hits, payout });
    setBalance(balance + payout - bet);
  };

  const handleRiskLevelChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRiskLevel(event.target.value as "classic" | "low" | "medium" | "high");
  };

  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-4">Keno Game</h1>
      <div className="mb-4">
        <label className="mr-2">Risk Level:</label>
        <select
          value={riskLevel}
          onChange={handleRiskLevelChange}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="classic">Classic</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-4">
        <KenoBoard
          selectedNumbers={selectedNumbers}
          onSelectNumber={handleNumberSelect}
          drawnNumbers={drawnNumbers}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Bet Amount:</label>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="bg-gray-800 p-2 rounded"
        />
      </div>
      <button
        onClick={handleDrawNumbers}
        className="bg-blue-500 p-2 rounded mb-4"
      >
        Draw Numbers
      </button>
      <div className="mb-4">
        <p>Balance: ${balance?.toFixed(2)}</p>
      </div>
      {result && (
        <div className="mb-4">
          <p>Hits: {result.hits}</p>
          <p>Payout: ${result.payout?.toFixed(2)}</p>
        </div>
      )}
      <div className="mt-4 grid grid-cols-11 gap-2">
        {selectedCount > 0 &&
          Object.entries(payoutTables[riskLevel][selectedCount]).map(
            ([hits, multiplier]) => (
              <div
                key={hits}
                className="p-2 border rounded bg-gray-800 text-white text-center"
              >
                HIT {hits}
                <br />
                {multiplier as any}×
              </div>
            ),
          )}
      </div>

      <div className="mb-4">
        <button
          onClick={() =>
            setSelectedNumbers(
              Array.from(
                { length: Math.floor(Math.random() * 10) + 1 },
                () => Math.floor(Math.random() * 80) + 1,
              ),
            )
          }
          className="bg-blue-500 p-2 rounded"
        >
          Random Pick
        </button>
      </div>
    </div>
  );
};

export default Game;
