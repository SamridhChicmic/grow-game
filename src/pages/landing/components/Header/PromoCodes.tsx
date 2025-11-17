import { Button } from "@/components";
import React from "react";

export default function PromoCodes() {
  return (
    <div className="p-3 max-w-[450px] flex flex-col overflow-y-auto max-h-[var(--app-height)] font-medium bg-dark-850 p-3 gap-2 rounded-md w-full max-sm:max-w-full max-sm:w-full text-sm text-gray-400">
      <div className="flex justify-start relative items-center font-semibold text-[1rem] text-gray-400">
        <div className="flex gap-1.5 items-center">Promo Codes</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-center gap-1.5 text-sm font-semibold">
          <button className="transition-colors px-2 py-1.5 hover:bg-dark-800 rounded-sm  text-white">
            Use Promo Code
          </button>
          <button className="transition-colors px-2 py-1.5 hover:bg-dark-800 rounded-sm text-inherit ">
            Manage Promo Codes
          </button>
        </div>
        <div className="w-full max-w-[500px]">
          <div>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-white text-sm">
                  Promo Code
                </span>
                <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
                  <input
                    placeholder="Enter Promo Code"
                    className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white font-medium"
                    type="text"
                    value=""
                  />
                </div>
              </div>
              <div>
                {/* <iframe
                  src="https://newassets.hcaptcha.com/captcha/v1/3f5d589/static/hcaptcha.html#frame=checkbox&amp;id=2ptniwh515sj&amp;host=growdice.net&amp;sentry=true&amp;reportapi=https%3A%2F%2Faccounts.hcaptcha.com&amp;recaptchacompat=true&amp;custom=false&amp;hl=en&amp;tplinks=on&amp;pstissuer=https%3A%2F%2Fpst-issuer.hcaptcha.com&amp;sitekey=219fabe6-4390-4bfd-9a12-a72dd236b56f&amp;theme=dark&amp;origin=https%3A%2F%2Fgrowdice.net"
                  tabindex="0"
                  frameborder="0"
                  scrolling="no"
                  allow="private-state-token-issuance 'src'; private-state-token-redemption 'src'"
                  title="Widget containing checkbox for hCaptcha security challenge"
                  data-hcaptcha-widget-id="2ptniwh515sj"
                  data-hcaptcha-response=""
                  style="pointer-events: auto; width: 303px; height: 78px; overflow: hidden;"
                ></iframe> */}
                <textarea
                  id="g-recaptcha-response-2ptniwh515sj"
                  name="g-recaptcha-response"
                ></textarea>
                <textarea
                  id="h-captcha-response-2ptniwh515sj"
                  name="h-captcha-response"
                ></textarea>
              </div>
              <Button
                aria-disabled="true"
                className="sc-1xm9mse-0 fzZXbl text-sm rounded-sm text-nowrap w-full !py-2"
              >
                Claim Promo Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
