import clsx from "clsx";
import { useEffect, useState } from "react";
enum Difficulty {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

type RowContent = 1 | 2 | "skip";
type CellContent = { hasSkull: boolean; selected: boolean };

const possibleRowContent: [RowContent, RowContent, RowContent] = ["skip", 1, 2];
function getRandomIndices<T>(array: T[], count: number): number[] {
  const indices: number[] = [];

  while (indices.length < count) {
    const index = Math.floor(Math.random() * array.length);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }

  return indices;
}

export default function MyTowers() {
  const [grid, setGrid] = useState<CellContent[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.HARD);

  const initializeGame = () => {
    const rows: CellContent[][] = Array(1)
      .fill(0)
      .map(() => {
        const columns: CellContent[] = Array(3)
          .fill(3)
          .map((_, i) => ({ hasSkull: false, selected: false, key: i }));

        const colsCopy = JSON.parse(JSON.stringify(columns));

        console.log("COLUMNS_BEFORE: ", columns);

        let possibleRowContentByDifficulty: RowContent[];

        switch (difficulty) {
          case Difficulty.EASY:
            possibleRowContentByDifficulty = possibleRowContent.filter(
              (value) => value !== 2,
            );
            break;

          case Difficulty.NORMAL:
            possibleRowContentByDifficulty = possibleRowContent.filter(
              (value) => value !== "skip" && value !== 2,
            );
            break;

          case Difficulty.HARD:
            possibleRowContentByDifficulty = possibleRowContent.filter(
              (value) => value !== "skip",
            );
            break;

          default:
            possibleRowContentByDifficulty = possibleRowContent.filter(
              (value) => value !== "skip" && value !== 2,
            );
            break;
        }

        for (
          let possibleRowIndex = 0;
          possibleRowIndex < possibleRowContentByDifficulty.length;
          possibleRowIndex++
        ) {
          if (possibleRowContentByDifficulty[possibleRowIndex] === "skip")
            continue;

          const numberOfSkulls = possibleRowContentByDifficulty[
            getRandomIndices(possibleRowContentByDifficulty, 1)[0]
          ] as number;

          //   const skulls: number[] = Array(numberOfSkulls).fill(1);

          const skullPositions = getRandomIndices(columns, numberOfSkulls);

          skullPositions.forEach((position) => {
            colsCopy[position].skullPosition = skullPositions;
            colsCopy[position].hasSkull = true;
            colsCopy[position].position = position;
          });

          console.log({
            numberOfSkulls,
            skullPositions,
            possibleRowContentByDifficulty,
          });
        }

        // let skullIndexes = getRandomIndices(possibleRowContentByDifficulty, 1);

        // console.log({ skullIndexes, possibleRowContentByDifficulty });

        // for (let i = 0; i < skullIndexes.length; i++) {
        //   console.log("RUNNING=========");
        //   if (possibleRowContent[skullIndexes[i]] === "skip") continue;
        //   const numberOfSkulls = Array(possibleRowContent[i]).fill(1);
        //   const skullPositions = getRandomIndices(
        //     possibleRowContent,
        //     numberOfSkulls.length,
        //   );

        //   for (let j = 0; j < skullPositions.length; j++) {
        //     columns[j].hasSkull = true;
        //   }
        // }

        // skullIndexes.forEach((index) => {});

        console.log("COLUMNS_AFTER: ", colsCopy);
        return colsCopy;
      });

    // console.log({ rows });

    setGrid(rows);

    //   .map((_, i) => {
    //     switch (difficulty) {
    //         case Difficulty.EASY:
    //            const skullIndex = getRandomIndices(possibleRowContent,1);

    //             break;

    //         default:
    //             break;
    //     }
    //   });
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const Cell = ({
    cellContent,
    col,
    row,
  }: {
    cellContent: CellContent;
    row: number;
    col: number;
  }) => {
    const gridCopy = [...grid];
    let cell = gridCopy[row][col];
    return (
      <button
        onClick={() => {
          console.log({ row, col, cell });
          gridCopy[row][col] = { ...cell, selected: true };
          setGrid(gridCopy);
          console.log(gridCopy);
        }}
        className={clsx(
          "w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default",
        )}
      >
        {cellContent.selected && (cellContent.hasSkull ? "X" : "0")}
      </button>
    );
  };

  return (
    <div className="flex flex-col p-2  gap-1 rounded-md bg-dark-800 w-full max-w-[370px]">
      {grid.map((rows, rowIndex) => (
        <div key={rowIndex} className="flex w-full gap-2">
          {rows.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              cellContent={cell}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
    // <div className="flex flex-col items-center justify-center w-full">
    //   <div className="flex flex-col p-2  gap-1 rounded-md bg-dark-800 w-full max-w-[370px]">
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //     <div className="flex w-full gap-2">
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //       <button className="w-full h-[45px] rounded-sm transition-transform ease-out flex pb-[5px] justify-center items-center shadow-md  bg-dark-750 towers-default"></button>
    //     </div>
    //   </div>
    // </div>
  );
}
