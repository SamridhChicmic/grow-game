export { default } from "./Dice";

export enum GamePhase {
  bet = "bet",
  running = "running",
  result = "result",
}

export function calculateMultiplier(
  value: number,
  predictedRange: "greater" | "less",
): number {
  const maxValue = 99.9;
  const minValue = 0;
  const totalPossibleOutcomes = maxValue - minValue + 1;
  let probability: number;

  if (predictedRange === "greater") {
    probability = (maxValue - value) / totalPossibleOutcomes;
  } else {
    probability = (value - minValue) / totalPossibleOutcomes;
  }

  // Multiplier calculation
  const baseMultiplier = 1.01; // Base multiplier
  let multiplier = baseMultiplier / probability;

  // Ensure multiplier is within the range [1.01, 960]
  if (multiplier < 1.01) {
    multiplier = 1.01;
  } else if (multiplier > 960) {
    multiplier = 960;
  }

  return multiplier;
}
