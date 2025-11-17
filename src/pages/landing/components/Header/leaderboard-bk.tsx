import { TrophyIcon } from '@/assets/svgs';
import User1 from '@/assets/users/user-1.png';
import clsx from 'clsx';
import { DetailedHTMLProps, PropsWithChildren, TdHTMLAttributes } from 'react';
import { capitalizeCamelCase } from '@/utils/strings';
import SilverLockIcon from '@/assets/icons/silver-lock.webp';

// NOTE: Remove / Move type annotations
type TableUser = { name: string; photo: string };

type TableValues = {
  username: TableUser;
  level: number;
  wagered: number;
  profit: number;
  'profit (ath)': number;
  'profit (atl)': number;
  gamesPlayed: number;
  gamesWon: number;
};

// type TableValue = TableValues[keyof TableValues];

interface TdProps
  extends DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {}

function Td({ className, children, ...tdProps }: PropsWithChildren<TdProps>) {
  return (
    <td
      className={clsx(
        'whitespace-nowrap bg-dark-800 text-center overflow-ellipsis py-2 px-4',
        className,
      )}
      {...tdProps}
    >
      {children}
    </td>
  );
}

export function Leaderboard_() {
  const games: TableValues[] = Array(19)
    .fill(0)
    .map((_, i) => ({
      '#': i + 1,
      username: { name: 'KaanOzturk33', photo: User1 },
      level: 11,
      wagered: 0.2,
      profit: -0.3,
      'profit (ath)': 0.01,
      'profit (atl)': 0.01,
      gamesPlayed: 20,
      gamesWon: 12,
    }));

  const header = [
    '#',
    'username',
    'level',
    'wagered',
    'profit',
    'profit (ath)',
    'profit (atl)',
    'games played',
    'games won',
  ];

  return (
    <div className="w-[98%] sm:h-[86vh] md:h-[86vh] p-2 md:w-[70vw] h-full mx-auto pt-6 sm:mt-0 gap-1">
      <header className="flex items-center gap-2">
        <TrophyIcon className="stroke-gray-400 fill-gray-400" />
        <h2 className="text-gray-400 text-md font-bold">Leaderboard</h2>
      </header>
      {/* <Table<TableValues, TableValue>
        head={[
          "#",
          "username",
          "level",
          "wagered",
          "profit",
          "profit (alt)",
          "games played",
          "games won",
        ]}
        body={games.map((game) => Object.entries(game))}
        title="Bets"
        fullData={games}
        itemBuilder={({ item, key }) => {
          const i = key;
          const tableItem = item as [
            TableValue,
            (typeof games)[0][keyof (typeof games)[0]]
          ];
          const itemKey = tableItem[0];
          const itemValue = tableItem[1];
          console.log("ITEM_BUILDER:", { item, tableItem, itemValue });

          if (itemKey === "username") {
            const item = itemValue as TableUser;
            console.log("NOT_NUMBER", { item, itemValue });
            return (
              <td
                className={clsx(
                  "whitespace-nowrap bg-dark-800 text-center overflow-ellipsis py-2 font-bold",
                  i === 0 && "rounded-l-lg",
                  i === games.length - 1 && "rounded-r-xl"
                )}
                key={key}
              >
                <div className="flex w-fit mx-auto items-center gap-2">
                  <img
                    src={item.photo}
                    alt=""
                    className="w-4 aspect-square rounded-full"
                  />
                  <p className="overflow-ellipsis">{item.name}</p>
                </div>
              </td>
            );
          }

          if (itemKey === "level") {
            const item = itemValue as number;
            console.log("NOT_NUMBER", { item, itemValue });
            return (
              <td
                className={clsx(
                  "whitespace-nowrap bg-dark-800 text-center overflow-ellipsis py-2 font-bold",
                  i === 0 && "rounded-l-lg",
                  i === games.length - 1 && "rounded-r-xl"
                )}
                key={key}
              >
                <div className="px-2 md:px-4 mx-auto h-fit w-fit py-[2px] rounded uppercase bg-gradient-to-br from-orange-500 to-pink-700 text font-bold bg-amber text-white">
                  {item}
                </div>
              </td>
            );
          }

          return (
            <td
              className={clsx(
                "whitespace-nowrap bg-dark-800 text-center overflow-ellipsis py-2 font-bold",
                i === 0 && "rounded-l-lg pl-3",
                i === games.length - 1 && "rounded-r-xl"
              )}
              key={key}
            >
              {tableItem[1] as React.ReactNode}
            </td>
          );
        }}
      /> */}
      <div className="h-full overflow-auto">
        <table className="table w-full overflow-auto border-separate border-spacing-y-1 clients-table table-fixed_">
          <thead className="@sticky text-gray-500 text-sm z-10 h-10 top-[2px] text-body-text">
            <tr className="w-full">
              {/* <th className="rounded-l-lg">
               <span>
                 <input
                   onChange={(e) => setCheckAll(e.target.checked)}
                   type="checkbox"
                   className="!border-primary"
                   title="select all"
                 />
               </span>
             </th> */}
              {header.map((prop, i) => (
                <th
                  key={i}
                  className={clsx(
                    'whitespace-nowrap bg-dark-800',
                    i === 0 && 'rounded-l-md',
                    i === header.length - 1 && 'rounded-r-md',
                  )}
                >
                  {capitalizeCamelCase(prop as string).toUpperCase()}
                </th>
              ))}
              {/* <th className="rounded-r-lg">...</th> */}
            </tr>
          </thead>
          <tbody className="text-base-black">
            {games.map((data, i) => (
              <tr
                onClick={() => {}}
                className="relative cursor-pointer hover:bg-base-black/5 outline-1"
              >
                <Td className={clsx('rounded-l-md pl-3')}>{i + 1}</Td>
                <Td key={i}>
                  <div className="flex w-fit mx-auto items-center gap-2">
                    <img
                      src={data.username.photo}
                      alt=""
                      className="w-4 aspect-square rounded-full"
                    />
                    <p className="overflow-ellipsis">{data.username.name}</p>
                  </div>
                </Td>
                <Td>
                  <div className="px-2 md:px-4 mx-auto h-fit w-fit py-[2px] rounded uppercase bg-gradient-to-br from-orange-500 to-pink-700 text font-bold bg-amber text-white">
                    {data.level}
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-1 items-center w-fit mx-auto">
                    <p className="text-gray-600 font-semibold">
                      {data.wagered}
                    </p>
                    <img src={SilverLockIcon} className="w-4 aspect-square" />
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-1 items-center w-fit mx-auto">
                    <p className="text-green-500 font-semibold">
                      {data.profit}
                    </p>
                    <img src={SilverLockIcon} className="w-4 aspect-square" />
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-1 items-center w-fit mx-auto">
                    <p className="text-green-500 font-semibold">
                      {data['profit (ath)']}
                    </p>
                    <img src={SilverLockIcon} className="w-4 aspect-square" />
                  </div>
                </Td>
                <Td>
                  <div className="flex gap-1 items-center w-fit mx-auto">
                    <p className="text-green-500 font-semibold">
                      {data['profit (atl)']}
                    </p>
                    <img src={SilverLockIcon} className="w-4 aspect-square" />
                  </div>
                </Td>
                <Td>{data.gamesPlayed}</Td>
                <Td className={clsx(i === games.length - 1 && 'rounded-r-xl')}>
                  {data.gamesWon}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
