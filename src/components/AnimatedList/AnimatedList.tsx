import clsx from "clsx";
import React, { useEffect, useState } from "react";

interface ListItem {
  id?: string;
  text: string;
}

interface AnimatedListProps {
  items: ListItem[];
}

export default function AnimatedList({ items }: AnimatedListProps) {
  const [displayedItems, setDisplayedItems] = useState<ListItem[]>([]);

  useEffect(() => {
    console.log({ items });
    setDisplayedItems(items);
  }, [items]);

  return (
    // <div className="bg-red-700 w-full ">
    <ul className="flex gap-3 w-full p-1 shrink-0 h-full items-center overflow-hidden">
      {displayedItems.map((item) => (
        <li
          key={item.id}
          className={clsx(
            "flex items-center justify-center font-semibold rounded h-full w-[100px] shrink-0 shadow animate-slide-in",
            parseFloat(item.text) > 0 ? "bg-game-green" : "bg-dark-700",
          )}
        >
          {item.text}×
        </li>
      ))}
    </ul>
    // </div>
  );
}
