import { MenuIcon } from "@/assets/svgs";
import { useSearchParams } from "react-router-dom";
import "./menubar.css";

export default function MenuButton() {
  const [searchParams, setSearchParams] = useSearchParams();

  const showMenu = searchParams.get("show-menu") === "true";

  return (
    <>
      <button
        className="sm:hidden"
        onClick={() => setSearchParams({ "show-menu": String(!showMenu) })}
      >
        <MenuIcon />
      </button>

      <button
        className="relative group hidden sm:block md:hidden"
        onClick={() => setSearchParams({ "show-menu": String(!showMenu) })}
      >
        <div
          className={`relative flex overflow-hidden items-center justify-center rounded-full w-[30px] h-[30px] transform transition-all duration-200`}
        >
          <div
            className={`flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden`}
          >
            <div
              className={`bg-white h-[3px] w-7 transform transition-all duration-300 origin-left ${
                showMenu ? "group-focus:translate-x-10" : ""
              }`}
            ></div>
            <div
              className={`bg-white h-[3px] w-7 rounded transform transition-all duration-300 ${
                showMenu ? "group-focus:translate-x-10" : ""
              } delay-75`}
            ></div>
            <div
              className={`bg-white h-[3px] w-7 transform transition-all duration-300 origin-left ${
                showMenu ? "group-focus:translate-x-10" : ""
              } delay-150`}
            ></div>

            <div
              className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 ${
                showMenu ? "group-focus:translate-x-0" : ""
              } flex w-0 ${showMenu ? "group-focus:w-12" : ""}`}
            >
              <div
                className={`absolute bg-white h-[3px] w-5 transform transition-all duration-500 rotate-0 delay-300 ${
                  showMenu ? "group-focus:rotate-45" : ""
                }`}
              ></div>
              <div
                className={`absolute bg-white h-[3px] w-5 transform transition-all duration-500 -rotate-0 delay-300 ${
                  showMenu ? "group-focus:-rotate-45" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}
