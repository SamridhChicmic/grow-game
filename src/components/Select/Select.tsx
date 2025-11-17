import { ExpandMoreIcon } from "@/assets/svgs";
import { Listbox } from "@headlessui/react";
import { AnimateInOut } from "..";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Select({
  label,
  options,
  getValue,
  value,
}: {
  label: string;
  options: { label: any; value: any }[];
  getValue?(val: any): any;
  value?: any;
}) {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    getValue?.(selected.value);
  }, [selected]);

  return (
    <Listbox
      value={selected}
      onChange={(selected) => {
        console.log("CHANGE: ", { selected });
        setSelected(selected);
      }}
    >
      {({ open }) => (
        <>
          <Listbox.Button className="flex flex-row items-center justify-between w-full gap-1 p-2 border border-gray-600 rounded bg-dark-700">
            <label className="text-white !font-semibold capitalize">
              <> {value || selected.label || label}</>
            </label>
            <ExpandMoreIcon
              className={`${
                open ? "rotate-180" : "rotate-0"
              } transform transition-transform duration-200 !stroke-white ml-auto`}
            />
          </Listbox.Button>
          <AnimateInOut
            show={open}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "keyframes" }}
            className="flex_ flex-col_ w-full pt-[5px] space-y-1 max-h-[15rem] overflow-auto rounded-b-lg px-1 bg-dark-700 py-1"
          >
            <Listbox.Options className="focus:outline-none space-y-1">
              {options.map((option, i) => (
                <Listbox.Option value={option} key={i}>
                  {({ active, selected }) => (
                    <button
                      type="button"
                      className={clsx(
                        "text-sm text-white block w-full text-left font-bold uppercase py-2 rounded px-2",
                        (active || selected) && "bg-primary",
                      )}
                      tabIndex={0}
                      key={i}
                    >
                      <label className="capitalize font-semibold">
                        {option.label as any}
                      </label>
                    </button>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </AnimateInOut>
        </>
      )}
    </Listbox>
  );
}
