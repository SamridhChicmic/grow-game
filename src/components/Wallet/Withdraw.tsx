import {
  DiamondLockIcon,
  SilverLockIcon,
  YellowLockIcon,
} from "@/assets/icons";
import { AnimateInOut, Input } from "..";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Withdraw() {
  const searchParams = useSearchParams()[0];
  const isWithdraw = searchParams.get("modal") === "withdraw";

  const [growId, setGrowId] = useState("");
  const [amount, setAmount] = useState(0);

  return (
    <AnimateInOut
      show={isWithdraw}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col gap-2.5">
        <div>
          <p className="font-bold text-lg">How to withdraw?</p>
          <ol className="numbered-list">
            <li className="numbered-list-item">
              Type in your Growtopia GrowID that you would like to withdraw
              with, then press 'Start Withdraw'.
            </li>
            <li className="numbered-list-item">
              Wait for the loading to complete (it may take up to 30 seconds).
            </li>
            <li className="numbered-list-item">
              Enter the generated world in Growtopia.
            </li>
            <li className="numbered-list-item flex">
              Wait for the bot to drop your{" "}
              <img
                src={YellowLockIcon}
                width="20"
                height="20"
                className="sc-x7t9ms-0 dnNpLQ"
              />{" "}
              /{" "}
              <img
                src={SilverLockIcon}
                width="20"
                height="20"
                className="sc-x7t9ms-0 dnNpLQ"
              />{" "}
              /{" "}
              <img
                src={DiamondLockIcon}
                width="20"
                height="20"
                className="sc-x7t9ms-0 dnNpLQ"
              />{" "}
              and pick them up.
            </li>
            <li className="numbered-list-item">
              If you encounter any issues, message{" "}
              <a
                className="text-white font-semibold"
                target="_blank"
                href="https://discord.com"
              >
                Support
              </a>
              .
            </li>
          </ol>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">Withdraw</p>
          <div className="flex flex-col gap-0.5 font-semibold">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-white text-sm">GrowID</span>
              {/* <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
                  <input
                    className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white"
                    type="text"
                    value=""
                  />
                </div> */}
              <Input
                className=""
                type="text"
                value={growId}
                onChange={(e) => setGrowId(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 font-semibold">
            <span id="label">Withdraw Amount</span>
            <div className="flex flex-col gap-1">
              <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
                <div className="flex items-center gap-2">
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className={"sc-x7t9ms-0 grLtgJ"}
                  />
                </div>
                <input
                  className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && value !== "NAN")
                      setAmount(parseFloat((value && value) || "0"));
                  }}
                />
              </div>
            </div>
          </div>
          {/* <div>
            <div>
              <iframe
                src="https://newassets.hcaptcha.com/captcha/v1/04f9464/static/hcaptcha.html#frame=checkbox&amp;id=108aurkhcxzgc&amp;host=growdice.net&amp;sentry=true&amp;reportapi=https%3A%2F%2Faccounts.hcaptcha.com&amp;recaptchacompat=true&amp;custom=false&amp;hl=en&amp;tplinks=on&amp;pstissuer=https%3A%2F%2Fpst-issuer.hcaptcha.com&amp;sitekey=219fabe6-4390-4bfd-9a12-a72dd236b56f&amp;theme=dark&amp;origin=https%3A%2F%2Fgrowdice.net"
                tabIndex={0}
                //   frameBorder="0"
                //   scrolling="no"
                allow="private-state-token-issuance 'src'; private-state-token-redemption 'src'"
                title="Widget containing checkbox for hCaptcha security challenge"
                data-hcaptcha-widget-id="108aurkhcxzgc"
                data-hcaptcha-response=""
                className="pointer-events-auto w-[303px] h-[78px] overflow-hidden"
              ></iframe>
              <textarea
                id="g-recaptcha-response-108aurkhcxzgc"
                name="g-recaptcha-response"
                className="hidden"
              ></textarea>
              <textarea
                id="h-captcha-response-108aurkhcxzgc"
                name="h-captcha-response"
                className="hidden"
              ></textarea>
            </div>
          </div> */}
          <button
            disabled
            aria-disabled="true"
            className="sc-1xm9mse-0 wallet-button text-sm rounded-sm w-full h-[40px]"
          >
            Start Withdraw
          </button>
        </div>
        <div className="flex justify-between items-center pt-2 gap-3">
          <span className="flex gap-1 items-center">
            Minimum withdrawal is<b className="text-white">0.20</b>
            <img
              src={SilverLockIcon}
              width="18"
              height="18"
              className="sc-x7t9ms-0 dnLnNz"
            />
          </span>
          <span className="flex gap-1 items-center">
            Maximum withdrawal is<b className="text-white">15</b>
            <img
              src={DiamondLockIcon}
              width="18"
              height="18"
              className="sc-x7t9ms-0 dnLnNz"
            />
          </span>
        </div>
      </div>
    </AnimateInOut>
  );
}
