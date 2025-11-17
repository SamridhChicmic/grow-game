import { ChatBubbleIcon, XClose } from "@/assets/svgs";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { toggleChatBar } from "@/store/slices/chatbar";

export default function ChatToggle({
  icon,
}: {
  icon?: React.FC<React.SVGProps<SVGElement>>;
}) {
  const dispatch = useAppDispatch();
  const showChatBar = useAppSelector((state) => state.chatBar);

  console.log({ icon });
  const toggleChat = () => {
    dispatch(toggleChatBar(!showChatBar));
  };
  return (
    <div>
      <button className="" onClick={() => toggleChat()}>
        <ChatBubbleIcon className="sm:hidden" />
        <span className="hidden sm:inline-block">
          {showChatBar ? (
            <XClose className="!stroke-white" />
          ) : (
            <>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="25"
                width="25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M128 464v-80H56a24 24 0 01-24-24V72a24 24 0 0124-24h400a24 24 0 0124 24v288a24 24 0 01-24 24H245.74zM456 80z"></path>
              </svg>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
