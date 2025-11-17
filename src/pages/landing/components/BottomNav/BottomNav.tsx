import { WalletIcon } from "@/assets/svgs";
import ChatToggle from "../Chat/ChatToggle";
import MenuButton from "../MenuButton";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { triggerModal } from "@/store/slices/modal";
import { Wallet } from "@/components";

export default function BottomNav() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const setSearchParams = useSearchParams()[1];

  return (
    <footer className="w-full fixed relative_ bottom-0 h-16 flex justify-around items-center z-[1000] shadow-md shadow-black sm:hidden justify-around_ bg-dark-850">
      <div className="">
        <ChatToggle />
      </div>
      <button
        onClick={() => {
          setSearchParams({
            modal: auth.isAuthenticated ? "deposit" : "sign-in",
          });
          auth.isAuthenticated &&
            dispatch(
              triggerModal({
                children: <Wallet />,
                show: true,
              }),
            );
        }}
      >
        <WalletIcon />
      </button>
      <MenuButton />
    </footer>
  );
}
