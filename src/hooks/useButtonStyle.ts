type ButtonStyleProps = {
  full?: boolean;
  color?: "primary" | "accent" | "error" | "gray";
  disabled?: boolean;
  text?: "xs" | "sm" | "lg" | "xl";
};

export default function useButtonStyle({
  color,
  disabled,
  full,
  text,
}: ButtonStyleProps) {
  let btnColor: string;
  let textColor: string;
  let shadowColor: string;

  switch (color) {
    case "accent":
      btnColor = "bg-accent";
      textColor = "text-gray-500";
      shadowColor = "hover:shadow-accent/30";
      break;
    case "error":
      btnColor = "bg-red-400";
      textColor = "text-gray-500";
      shadowColor = "hover:shadow-red-800/30";

      break;
    case "gray":
      btnColor = "bg-gray-100";
      textColor = "text-gray-500";
      shadowColor = "hover:shadow-gray-500/30";

      break;
    default:
      btnColor = "bg-primary";
      textColor = "text-gray-500";
      shadowColor = "hover:shadow-primary/30";

      break;
  }

  return `${btnColor} ${
    color === "gray" ? textColor : "text-white"
  } whitespace-nowrap font-bold hover:shadow-lg ${shadowColor} hover:opacity-80 transition-all ease-in-out text-${
    text ? text : "base"
  } ${full ? "w-full h-full" : "rounded-md"} ${
    disabled && "cursor-not-allowed"
  } ${
    !disabled && !full && "active:scale-95 active:opacity-100"
  } text-center flex items-center justify-center cursor-pointer p-3 px-2 py-6 active:scale-90 active:transition-all active:duration-200 || flex justify-center items-center px-4 py-2 transition duration-100 ease-in-out text-white bg-blue-500 shadow-inner inset-y-0 border border-transparent font-semibold text-sm text-center text-shadow-xs cursor-pointer select-none`;
}
