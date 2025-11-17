// import { SilverLockIcon } from "@/assets/icons";
// import { ComponentProps, useEffect, useState } from "react";
// import Input from "../Input";

// type Props = { inputProps: ComponentProps<typeof Input> };

// export default function BetInput({
//   inputProps: { onChange, ...props },
// }: Props) {
//   const { value: val, ...inputProps } = props;

//   const [value, setValue] = useState(parseFloat((val ? +val : 0)?.toFixed(3)));

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const inputValue = e.target.value;
//     // Allow only numbers and one decimal point
//     const regex = /^-?\d*\.?\d*$/;

//     if (regex.test(inputValue)) {
//       // setValue(parseFloat((!isNaN(value) ? value : 0)?.toFixed(3)));
//       setValue(parseFloat(inputValue));
//     }

//     const event: React.ChangeEvent<HTMLInputElement> = {
//       ...e,
//       target: { ...e.target, value: inputValue },
//     };
//     onChange?.(event);
//   };

//   const multiplyValue = (multiplier: number) => {
//     setValue(value * multiplier);
//   };

//   useEffect(() => {
//     console.log("VALUE: ", val);
//     // setValue((prev) => (val ? +val : prev));
//     setValue(
//       val !== undefined && !isNaN(+val)
//         ? parseFloat((+val as number)?.toFixed(3))
//         : 0,
//     );
//   }, [val]);

//   return (
//     <div className="relative flex items-center w-full">
//       <div className="absolute flex items-center gap-2 left-2">
//         <img
//           src={SilverLockIcon}
//           width="18"
//           height="18"
//           className="sc-x7t9ms-0 grLtgJ"
//         />
//       </div>
//       <Input
//         step="any"
//         placeholder="Bet"
//         className="outline-none indent-5 border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
//         type="number"
//         onChange={handleChange}
//         value={(!isNaN(value) ? value : 0)?.toFixed(3)}
//         {...inputProps}
//       />
//       <div className="absolute flex items-center gap-2 right-2">
//         <div className="flex gap-2.5 font-semibold">
//           <button
//             type="button"
//             onClick={() => multiplyValue(0.5)}
//             className="active:scale-90 transition-all duration-200 hover:text-white"
//           >
//             1/2
//           </button>
//           <button
//             type="button"
//             onClick={() => multiplyValue(2)}
//             className="active:scale-90 transition-all duration-200 hover:text-white"
//           >
//             2×
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { SilverLockIcon } from "@/assets/icons";
import { ComponentProps, useEffect, useState } from "react";
import Input from "../Input";

type Props = {
  inputProps: ComponentProps<typeof Input>;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export default function BetInput({
  inputProps: { onChange, ...props },
  leading,
  trailing,
}: Props) {
  const { value: val, ...inputProps } = props;

  const [value, setValue] = useState((val && val) || "0");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow only numbers and one decimal point
    const regex = /^-?\d*\.?\d*$/;

    if (regex.test(inputValue)) {
      setValue(inputValue);
    }

    const event: React.ChangeEvent<HTMLInputElement> = {
      ...e,
      target: { ...e.target, value: parseFloat(inputValue)?.toFixed(3) },
    };
    onChange?.(event);
  };

  const multiplyValue = (multiplier: number) => {
    setValue((prevValue) => {
      const numericValue = parseFloat(prevValue.toString());
      return (numericValue * multiplier).toString();
    });
  };

  useEffect(() => {
    console.log("VALUE: ", value);
    // setValue(
    //   val !== undefined && !isNaN(+val)
    //     ? parseFloat((+val as number)?.toFixed(3)).toString()
    //     : "0",
    // );
  }, [value]);

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute flex items-center gap-2 left-2">
        {leading ? (
          leading
        ) : (
          <img
            src={SilverLockIcon}
            width="18"
            height="18"
            className="sc-x7t9ms-0 grLtgJ"
          />
        )}
      </div>
      <Input
        step="any"
        placeholder="Bet"
        className="outline-none indent-6 border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
        type="text"
        onChange={handleChange}
        value={
          value && parseFloat(value as string) && !isNaN(+value)
            ? (+value)?.toFixed(3)
            : (0)?.toFixed(3)
        }
        {...inputProps}
      />
      {trailing ? (
        trailing
      ) : (
        <div className="absolute flex items-center gap-2 right-2">
          <div className="flex gap-2.5 font-semibold">
            <button
              type="button"
              onClick={() => multiplyValue(0.5)}
              className="active:scale-90 transition-all duration-200 hover:text-white"
            >
              1/2
            </button>
            <button
              type="button"
              onClick={() => multiplyValue(2)}
              className="active:scale-90 transition-all duration-200 hover:text-white"
            >
              2×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
