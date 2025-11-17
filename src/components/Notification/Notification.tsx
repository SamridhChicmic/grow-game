import { SilverLockIcon, YellowLockIcon } from "@/assets/icons";
import { toast } from "react-toastify";

const Notification = {
  currencyChanged(currency: Currency) {
    return toast(
      <div className="flex items-center gap-2 capitalize">
        <p>Switched currency mode to</p>
        <div className="inline-block w-5 aspect-square">
          <img
            className="w-full h-full"
            src={currency === "diamond-lock" ? SilverLockIcon : YellowLockIcon}
          />
        </div>
      </div>,
      {
        progressStyle: {
          background: "blue",
          accentColor: "yellow",
        },
      },
    );
  },
};

export default Notification;
