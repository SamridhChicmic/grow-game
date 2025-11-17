import { useEffect, useRef, useState } from "react";
import { capitalizeCamelCase } from "@/utils/strings";
import clsx from "clsx";
import SilverLockIcon from "@/assets/icons/silver-lock.webp";

export default function Table<TableValues, TableValue>({
  body,
  head,
  onDataClick,
  fullData = [],
  title,
  moreOptions,
  itemBuilder,
}: {
  head: TableValue[];
  body: unknown[][][]; // NOTE:Nested array in body should have exactly the same length as head array
  fullData?: TableValues[];
  title?: string;
  onDataClick?(data: any): any;
  moreOptions?: React.ComponentProps<typeof More>["options"];
  itemBuilder?({
    key,
    item,
  }: {
    key: string | number;
    item: any;
  }): React.ReactNode;
}) {
  // const [checkAll, setCheckAll] = useState(false);

  // let blacklistedIndexes: number[] = useMemo(() => [], []);
  const blacklistedIndexes = useRef<number[]>([]);

  const tableHeadItems = head.filter((item, i) => {
    Array.isArray(fullData![0][item as string]) &&
      blacklistedIndexes.current?.push(i);
    return !Array.isArray(fullData![0][item as string]);
  });

  useEffect(() => {
    console.log({ blacklistedIndexes });
  }, [blacklistedIndexes]);

  // cleanup
  useEffect(() => {
    () => {
      blacklistedIndexes.current = [];
    };
  }, []);

  return (
    <div className="w-full overflow-auto">
      <table className="w-full overflow-auto border-separate border-spacing-y-1 clients-table table-fixed_">
        <thead className="@sticky bg-dark-800 text-gray-500 text-sm z-10 h-10 top-[2px] text-body-text">
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
            {tableHeadItems.map((prop, i) => (
              <th key={i} className="whitespace-nowrap">
                {capitalizeCamelCase(prop as string).toUpperCase()}
              </th>
            ))}
            {/* <th className="rounded-r-lg">...</th> */}
          </tr>
        </thead>
        <tbody className="text-base-black">
          {body.map((data, i) => (
            <DataRow
              blacklistedIndexes={blacklistedIndexes?.current}
              moreOptions={moreOptions}
              title={title}
              onClick={onDataClick}
              key={i}
              data={data}
              itemBuilder={itemBuilder}
              // checked={checkAll}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataRow({
  data,
  onClick,
  title,
  moreOptions,
  // checked = false,
  itemBuilder,

  blacklistedIndexes,
}: {
  data: any[];
  onClick?(data: any): any;
  title?: string;
  moreOptions?: React.ComponentProps<typeof More>["options"];
  itemBuilder?: React.ComponentProps<typeof Table>["itemBuilder"];
  // checked: boolean;
  blacklistedIndexes: number[];
}) {
  const [showMore, setShowMore] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [isInteractingWithMore, setIsInteractingWithMore] = useState(false);

  // useEffect(() => {
  //   if (!showMore || isInteractingWithMore) return;
  //   const timeout = setTimeout(() => {
  //     setShowMore(false);
  //   }, 3000);
  //   return () => clearTimeout(timeout);
  // }, [showMore, isInteractingWithMore]);

  return (
    <tr
      onClick={() => onClick && onClick(data)}
      className="relative cursor-pointer hover:bg-base-black/5 outline-1"
    >
      {data
        .filter((_, i) => !blacklistedIndexes.includes(i))
        .map((item, i) => {
          const itemKey = item[0] as string;
          return (
            itemBuilder?.({ key: i, item }) || (
              <td
                key={i}
                className={clsx(
                  "whitespace-nowrap bg-dark-800 text-center overflow-ellipsis py-2 font-bold",
                  title === "invoice" && i === 1 ? "text-primary" : "",
                  i === 0 && "rounded-l-xl",
                  i === data.length - 1 && "rounded-r-xl",
                )}
              >
                {itemKey.toLocaleLowerCase() === "bet" ||
                itemKey.toLocaleLowerCase() === "profit" ? (
                  <div className="flex items-center gap-1 w-fit mx-auto">
                    {item[1]}
                    <img src={SilverLockIcon} className="w-4 " />
                  </div>
                ) : (
                  item[1]
                )}
                {/* {typeof item === "number" && i
              ? `USD ${item.toLocaleString()}`
              : Array.isArray(item)
              ? ""
              : item && item.toString()} */}
              </td>
            )
          );
        })}
      {/* <td className="p-0 rounded-r-lg bg-dark-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMore((prev) => !prev);
          }}
        >
          <MenuHorizontalDotsIcon className="align-middle" />
        </button>
      </td> */}
      {moreOptions && showMore && (
        <More
          setIsInteracting={setIsInteractingWithMore}
          options={moreOptions}
        />
      )}
    </tr>
  );
}

function More({
  options,
  setIsInteracting,
}: {
  options: { label: string | React.ReactNode; action(): void }[];
  setIsInteracting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      className="absolute min-w-[12rem] right-0 z-10 bg-white border shadow-md top-full rounded-xl"
    >
      {options?.map((option, i) => (
        <button
          key={i}
          onClick={() => option.action()}
          className="block w-full px-4 py-2 whitespace-nowrap text-body-text hover:bg-body-text/10"
        >
          <p className="w-[96%] mx-auto text-start font-medium">
            {option.label}
          </p>
        </button>
      ))}
    </div>
  );
}
