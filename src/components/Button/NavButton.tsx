"use client";
import { useAppDispatch } from "@/hooks/store";
import { LeftAlignIcon } from "@/assets/svgs";
import { toggleChatBar } from "@/store/slices/chatbar";

export default function NavButton() {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => {
        dispatch(toggleChatBar(true));
      }}
      className="h-[44px] w-[44px] rounded-[8px] p-[10px] grid place-items-center bg-[#FEF6F4] active:scale-90 transition-all duration-150 md:hidden"
    >
      <figure>
        <LeftAlignIcon />
      </figure>
    </button>
  );
}
