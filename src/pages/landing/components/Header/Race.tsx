import { StopwatchIcon } from "@/assets/svgs";
import { Table } from "@/components";
import SilverLockIcon from "@/assets/icons/silver-lock.webp";

// NOTE: Remove / Move type annotations
type TableValues = {
  game: string;
  player: string;
  bet: string;
  profit: string;
  multiplier: string;
  time: string;
};

type TableValue = TableValues[keyof TableValues];

export default function Race() {
  const games: TableValues[] = Array(20)
    .fill(0)
    .map(() => ({
      game: "roulette",
      player: "Malik",
      bet: "0.2",
      profit: "-0.3",
      multiplier: "0.01*",
      time: "20:00",
      // key: i,
    }));

  // NOTE: Come up with better name
  const DetailItem = ({
    label,
    info,
  }: {
    label: string;
    info: string | React.ReactNode;
  }) => (
    <div className="space-y-[2px]">
      <small className="text-sm font-semibold text-gray-400 capitalize">
        {label}
      </small>
      <div className="border-gray-600 border-2 text-gray-400 font-semibold rounded px-3 py-2">
        <p>{info}</p>
      </div>
    </div>
  );

  const CounterBox = ({
    label,
    data,
  }: {
    label: "hours" | "minutes" | "seconds";
    data: string;
  }) => (
    <div className="w-fit text-center space-y-2">
      <div className="flex items-center justify-center w-12 h-12 outline-gray-600 rounded-sm outline outline-2">
        <p className="text-lg font-semibold text-gray-400">{data}</p>
      </div>
      <small className="font-semibold text-gray-400 text-xs capitalize">
        {label}
      </small>
    </div>
  );

  return (
    <div className="w-full px-2 flex flex-col h-full pt-6 sm:mt-0 gap-1 overflow-y-auto sm:mb-0 sm:w-[90vw] sm:h-[86vh] md:w-[42vw] md:h-[90vh] space-y-4">
      <div className="shrink-0 space-y-3">
        <header className="flex items-center gap-2">
          <StopwatchIcon className="stroke-gray-400 fill-gray-400" />
          <h2 className="text-gray-400 text-md font-bold">15 BGL Daily Race</h2>
        </header>
        <div>
          <div className="space-y-3 w-fit mx-auto">
            <p className="text-sm text-gray-400 text-center">Time Left:</p>
            <div className="flex gap-2 items-center">
              <CounterBox data="2" label="hours" />
              <CounterBox data="30" label="minutes" />
              <CounterBox data="56" label="seconds" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-semibold">
            For every bet placed, you'll be passing other racers in the
            leaderboard! The top 100 players will receive a prize to their
            balance at the end of the race.
          </p>
          <div className="space-y-1 w-full">
            <DetailItem
              label="your position"
              info="Start Wagering to join..."
            />

            <DetailItem
              label="your current price"
              info={
                <div className="flex gap-1 items-center">
                  <p>0.00</p>
                  <img src={SilverLockIcon} className="w-4 aspect-square" />
                </div>
              }
            />
            <DetailItem
              label="wagered amount"
              info={
                <div className="flex gap-1 items-center">
                  <p>0.00</p>
                  <img src={SilverLockIcon} className="w-4 aspect-square" />
                </div>
              }
            />
          </div>
        </div>
      </div>
      <div className="h-full max-h-[70%]">
        <div className="h-full overflow-auto">
          <Table<TableValues, TableValue>
            head={["game", "player", "bet", "profit", "multiplier", "time"]}
            // body={[["me", "yyyyy"], ["you"], ["us"], ["them"], ["They"]]}
            body={games.map((game) => Object.entries(game))}
            title="Bets"
            fullData={games}
          />
        </div>
      </div>
    </div>
  );
}
