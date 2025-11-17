import { useAppDispatch } from "@/hooks/store";
import { closeModal } from "@/store/slices/modal";

export default function Rules() {
  const dispatch = useAppDispatch();
  return (
    <div className="max-w-[500px] p-3 flex flex-col overflow-y-auto max-h-[var(--app-height)] font-medium bg-dark-850 gap-2 rounded-md w-full max-sm:max-w-full max-sm:w-full text-sm text-gray-400 transform-none">
      <div className="flex justify-start relative items-center font-semibold text-[1rem] text-gray-400">
        <div className="flex gap-1.5 items-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V15H22V19C22 20.6569 20.6569 22 19 22ZM18 17V19C18 19.5523 18.4477 20 19 20C19.5523 20 20 19.5523 20 19V17H18ZM6 7V9H14V7H6ZM6 11V13H14V11H6ZM6 15V17H11V15H6Z"></path>
          </svg>
          Chat Rules
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <ol className="numbered-list">
          <li className="numbered-list-item">
            Don't spam &amp; don't use excessive capital letters.
          </li>
          <li className="numbered-list-item">
            Don't harass or be offensive to other players.
          </li>
          <li className="numbered-list-item">
            Don't share any personal information of you or other players.
          </li>
          <li className="numbered-list-item">Don't beg or ask for tips.</li>
          <li className="numbered-list-item">Don't share links.</li>
          <li className="numbered-list-item">Don't advertise.</li>
          <li className="numbered-list-item">
            Don't share your affiliate code.
          </li>
        </ol>
        <span className="text-sm font-semibold ">
          Breaking any of these rules will result in a mute!
        </span>
        <button
          onClick={() => dispatch(closeModal())}
          className="sc-1xm9mse-0 rules-button text-sm rounded-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
