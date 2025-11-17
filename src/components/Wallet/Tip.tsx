import { SilverLockIcon } from "@/assets/icons";
import { AnimateInOut, Input } from "..";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { tipUser } from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { updateBalance } from "@/store/slices/wallet";

export default function Tip() {
  const searchParams = useSearchParams()[0];
  const isTip = searchParams.get("modal") === "tip";
  const userToTip = searchParams.get("tip-user");

  const [username, setUsername] = useState(userToTip || "");
  const [amount, setAmount] = useState(0);

  const dispatch = useAppDispatch();
  const { balance } = useAppSelector((state) => state.wallet);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const result = await tipUser({ username, amount });
      if (result) {
        dispatch(updateBalance(balance - amount));
        setUsername("");
        setAmount(0);
        return;
      }
    } catch (error) {
      console.error("Tip: ", error);
    }
  };

  return (
    <AnimateInOut
      show={isTip}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-white">Username</span>
          {/* <div className="bg-dark-700 h-[38px] text-gray-400 rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
            <input
              className="bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white"
              type="text"
              value=""
            />
          </div> */}
          <Input
            className="outline-none border-none p-1 text-[0.9rem] flex-grow text-white"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-white">Amount</span>
          <div className="bg-dark-700 h-[38px] text-gray-400 relative rounded-sm py-0.5 border transition-colors px-2 flex items-center gap-1.5 w-full border-dark-650">
            <div className="absolute flex items-center gap-2 w-fit left-2">
              <img
                src={SilverLockIcon}
                width="18"
                height="18"
                className="sc-x7t9ms-0 grLtgJ"
              />
            </div>
            <input
              className="indent-6 bg-transparent outline-none border-none p-1 text-[0.9rem] flex-grow text-white"
              type="text"
              value={amount?.toFixed(2)}
              onChange={(e) => {
                const value = e.target.value;
                if (value && value !== "NAN")
                  setAmount(parseFloat((value && value) || "0"));
              }}
            />
          </div>
        </div>
        <button
          disabled={!(amount && username)}
          aria-disabled="true"
          className="text-sm rounded-sm sc-1xm9mse-0 wallet-button"
        >
          Send Tip
        </button>
      </form>
    </AnimateInOut>
  );
}
