import clsx from "clsx";
import { EyeIcon, EyeSlashIcon } from "@/assets/svgs";
import { useState } from "react";

export default function Input(props: InputProps) {
  const { type, className, ...prop } = props;

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisibility((prev) => !prev);

  switch (type) {
    case "password": {
      return (
        <div
          className={clsx(
            "flex justify-between bg-dark-700 items-center text-[#B3B3B3] max-w-[382px]_ lg:max-w-[420px]_ rounded outline-none font-normal md:tracking-[0.32px] text-base gap-3 relative",
            className,
          )}
        >
          <input
            className="flex-1 p-2 px-3 rounded bg-dark-700 outline-none focus:outline-primary focus:outline-1 outline-1"
            type={passwordVisibility ? "text" : type}
            {...prop}
          />
          <button
            type="button"
            className="transition-all inline-block z-20 right-4 absolute duration-300 active:scale-[0.96] "
            onClick={togglePasswordVisibility}
          >
            {passwordVisibility ? (
              <EyeIcon
                className="!stroke-white
              "
              />
            ) : (
              <EyeSlashIcon
                className="!stroke-white
              "
              />
            )}
          </button>
        </div>
      );
    }
    case "email": {
      return (
        <input
          className={clsx(
            "block max-w-[382px]_ lg:max-w-[420px]_ p-2 px-3 rounded text-[#B3B3B3] bg-dark-700 outline-none font-normal md:tracking-[0.32px] text-base",
            className,
          )}
          {...prop}
        />
      );
    }
    default: {
      return (
        <input
          className={clsx(
            "block max-w-[382px]_ lg:max-w-[420px]_ p-2 px-3  rounded text-[#B3B3B3] bg-dark-700 outline-none font-normal md:tracking-[0.32px] text-base focus:outline-primary focus:outline-1",
            className,
          )}
          {...prop}
        />
      );
    }
  }
}
