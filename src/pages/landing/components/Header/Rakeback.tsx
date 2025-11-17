import { SilverLockIcon } from "@/assets/icons";
import React from "react";

export default function Rakeback() {
  return (
    <div className="p-3 w-full max-w-[500px] flex flex-col overflow-y-auto max-h-[var(--app-height)] font-medium bg-dark-850 gap-2 rounded-md max-sm:max-w-full max-sm:w-full text-sm text-gray-400">
      <div className="flex justify-start relative items-center font-semibold text-[1rem] text-gray-400">
        <div className="flex gap-1.5 items-center">Rakeback</div>
      </div>
      <div className="flex flex-col gap-2.5">
        <span>
          Get a percent back from the house edge with Rakeback!
          <br />
          The more you wager on your account, the more{" "}
          <img
            src={SilverLockIcon}
            width="18"
            height="18"
            className="sc-x7t9ms-0 dnLnNz"
          />
          you will earn from Rakeback!
        </span>
        <span className="flex gap-1 items-center max-sm:flex-col">
          <span>Every 10 levels you get +1% up to a maximum of 10% at </span>
          <div className="sc-ji84sw-0 SrZAT">LVL 100</div>
        </span>
        <div className="flex flex-col items-center font-semibold text-sm gap-2">
          <span>Your Rakeback Percentage:</span>
          <span className="text-xl">0%</span>
          <span className="flex items-center gap-1">
            Available Rakeback: 0.00
            <img
              src={SilverLockIcon}
              width="18"
              height="18"
              className="sc-x7t9ms-0 dnLnNz"
            />
          </span>
          <span className="flex items-center gap-1">
            Total Rakeback Claimed: 0.00
            <img
              src={SilverLockIcon}
              width="18"
              height="18"
              className="sc-x7t9ms-0 dnLnNz"
            />
          </span>
        </div>
        <button
          aria-disabled="true"
          className="sc-1xm9mse-0 fzZXbl text-sm rounded-sm text-nowrap"
        >
          <span className="text-sm flex items-center gap-13">
            <span className="flex items-center gap-1">
              Minimum Claim is 0.10
              <img
                src={SilverLockIcon}
                width="20"
                height="20"
                className="sc-x7t9ms-0 dnNpLQ"
              />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
