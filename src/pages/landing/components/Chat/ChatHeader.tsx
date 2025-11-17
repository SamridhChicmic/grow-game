import { Button } from "@/components";
import YellowLockIcon from "@/assets/icons/yellow-lock.webp";

export default function ChatHeader() {
  return (
    <header className="shrink-0 space-y-2 w-[94%] mx-auto pb-3 pt-1">
      <div className="flex">
        <div className="flex items-center w-full gap-2">
          <h2 className="text-lg font-bold uppercase flex items-center gap-1.5 text-gray-400">
            IT'S RAINING
          </h2>
          <span className="w-6 aspect-square">
            <img src={YellowLockIcon} alt="yellow-lock" />
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500 ml-auto font-bold">
            {"52"} joined
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-gray-300 flex items-center gap-1 font-semibold text-sm">
          Join for a chance to win 10
        </p>
        <span className="w-5 aspect-square">
          <img src={YellowLockIcon} alt="yellow-lock" />
        </span>
      </div>

      {/* NOTE: Male this a reusable component */}
      <div className="w-full relative after:bg-primary after:rounded-sm overflow-clip after:absolute after:left-0 after:w-1/2 after:h-full  bg-gray-800/60 h-2 rounded-sm" />

      <div>
        <Button className="w-full !py-1">Join</Button>
      </div>
    </header>
  );
}
