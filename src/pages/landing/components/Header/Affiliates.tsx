import { SilverLockIcon, YellowLockIcon } from "@/assets/icons";

export default function Affiliates() {
  return (
    <div className="p-3 max-w-[600px] flex flex-col overflow-y-auto max-h-[var(--app-height)] font-medium bg-dark-850 gap-2 rounded-md w-full max-sm:max-w-full max-sm:w-full text-sm text-gray-400 transform-none">
      <div className="flex justify-start relative items-center font-semibold text-[1rem] text-gray-400">
        <div className="flex gap-1.5 items-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M448 400H64a16 16 0 010-32h384a16 16 0 010 32zm-32 48H96a16 16 0 010-32h320a16 16 0 010 32zM32 272H16v48a32 32 0 0032 32h48v-16a64.07 64.07 0 00-64-64z"></path>
            <path d="M480 240h16v-64h-16a96.11 96.11 0 01-96-96V64H128v16a96.11 96.11 0 01-96 96H16v64h16a96.11 96.11 0 0196 96v16h256v-16a96.11 96.11 0 0196-96zm-224 64a96 96 0 1196-96 96.11 96.11 0 01-96 96z"></path>
            <circle cx="256" cy="208" r="64"></circle>
            <path d="M416 336v16h48a32 32 0 0032-32v-48h-16a64.07 64.07 0 00-64 64zm64-192h16V96a32 32 0 00-32-32h-48v16a64.07 64.07 0 0064 64zM96 80V64H48a32 32 0 00-32 32v48h16a64.07 64.07 0 0064-64z"></path>
          </svg>
          Affiliates
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2.5 text-gray-400">
          <span>
            After you've successfully created an affiliate code, now is the time
            to share your affiliate link with other people. Where do you want to
            share that and how do you want to invite other people to our site,
            we leave that to you.
          </span>
          <p className="gap-2">
            Our standard commission is 10% of the House Edge and if the House
            Edge is 4%, that means you will earn 0.4% of every bet your referees
            make. For example, if your referee wagers 10
            <span className="inline-block">
              <img
                src={SilverLockIcon}
                width="18"
                height="18"
                className="sc-x7t9ms-0 dnLnNz"
              />
            </span>{" "}
            on a game that has a 4% House Edge, you will earn 4{" "}
            <span className="inline-block">
              <img
                src={YellowLockIcon}
                width="18"
                height="18"
                className="sc-x7t9ms-0 dnLnNz"
              />
            </span>
            .
          </p>
          <span className="flex gap-1 items-center">
            Your referees will also get a 10
            <img
              src={YellowLockIcon}
              width="18"
              height="18"
              className="sc-x7t9ms-0 dnLnNz my-[0.25rem] mx-0"
            />
            bonus on register.
          </span>
          <div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-white text-sm">
                Affiliate Code
              </span>
              <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
                <input
                  className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white"
                  type="text"
                  value=""
                />
              </div>
            </div>
          </div>
          <button
            disabled
            aria-disabled="true"
            className="sc-1xm9mse-0 fsbplj text-sm rounded-sm"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
