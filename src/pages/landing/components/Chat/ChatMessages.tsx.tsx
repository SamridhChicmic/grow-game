import axiosInstance from "@/api/axios";
import { CurrencyNote, MenuHorizontalDotsIcon, UserIcon } from "@/assets/svgs";
import User1 from "@/assets/users/user-1.png";
import { AnimateInOut } from "@/components";
import { useAppSelector } from "@/hooks/store";
import { viewUserProfile } from "@/utils/actions";
import socket from "@/utils/constants";
import { Menu } from "@headlessui/react";
import { AxiosResponse } from "axios";
import clsx from "clsx";
import { Ref, useEffect, useRef, useState } from "react";

type MessageType = {
  senderInfo: {
    username: string;
    photo: string;
    level: number | string;
    uid: string;
  };
  content: string;
  date: Date;
};

const messages_: MessageType[] = Array(15)
  .fill(0)
  .map(() => ({
    senderInfo: {
      username: "noobish",
      photo: User1,
      level: 11,
      uid: Math.random().toString(),
    },
    content: "The best game is whatever one you prefer lol",
    date: new Date(),
  }));

console.log(messages_);

export default function ChatMessages() {
  const auth = useAppSelector((state) => state.auth);
  const messageRef = useRef<HTMLDivElement>();

  const [messages, setMessages] = useState<Message[]>([]);

  const getMessages = async () => {
    try {
      const response: AxiosResponse<{ messages: Message[] }> =
        await axiosInstance.get("/chat/messages?room=global");
      const prevMessages = response.data.messages;
      setMessages(prevMessages);
    } catch (error) {
      console.error("getMessages", { error });
    }
  };

  useEffect(() => {
    if (!messages.length) getMessages();

    socket.on("incoming_message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("incoming_message");
    };
  }, []);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-clip py-3 space-y-4">
      {messages.map((message, i) => {
        const date = new Date(message.date);

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        const formattedTime = `${hours}:${minutes}`;
        return (
          <div
            ref={messageRef as Ref<HTMLDivElement>}
            className="flex gap-2 mx-auto w-[95%]"
            key={i}
          >
            <div className="flex items-center">
              <figure className="w-8 aspect-square mt-3 rounded-full flex items-center justify-center bg-gray-600 overflow-clip">
                {message.senderInfo?.photo ? (
                  <img
                    src={
                      message.senderInfo.username === auth.user?.username
                        ? auth.user?.photo
                        : message.senderInfo?.photo
                    }
                  />
                ) : (
                  <UserIcon className="w-full aspect-square p-2_s !stroke-white" />
                )}
              </figure>
            </div>
            <div className="-space-y-[1px]">
              <div className="flex items-center gap-1">
                <h5
                  onClick={() => viewUserProfile(message.senderInfo?.username)}
                  className="font-semibold cursor-pointer"
                >
                  {message.senderInfo?.username}
                </h5>
                {/* NOTE: Make this level thing a component */}
                <span className="p-1 py-[2px] rounded uppercase h-fit bg-[rgb(161,152,121)] text-xs font-bold bg-amber text-gray-950">
                  lvl{message.senderInfo?.level}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {formattedTime}
                </span>
                <MessageMenu username={message.senderInfo?.username} />
              </div>
              <div className="p-2 rounded-md bg-dark-800 w-fit text-sm font-semibold">
                {message.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function MessageMenu({ username }: { username: string }) {
  return (
    <Menu>
      {({ open }) => (
        <div className="relative">
          <Menu.Button>
            <MenuHorizontalDotsIcon className="w-4 aspect-square" />
          </Menu.Button>
          <AnimateInOut
            show={open}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            // transition={{ type: "keyframes" }}
            className="absolute top-6 !-right-16 whitespace-nowrap h-full_ bg-dark-700 rounded items-center justify-center p-2 overflow-clip capitalize"
          >
            <button
              onClick={() => viewUserProfile(username)}
              className={clsx(
                "flex gap-2 transition-all duration-100 text-gray-500 font-semibold items-center w-full group",
              )}
            >
              <UserIcon
                className={clsx(
                  "!stroke-gray-500 !fill-gray-500 group-hover:!stroke-white group-hover:!fill-white",
                )}
              />
              <p className="group-hover:text-white">user profile</p>
            </button>
            <button
              className={clsx(
                "flex gap-2 transition-all duration-100 text-gray-500 font-semibold items-center group w-full",
              )}
            >
              <CurrencyNote
                className={clsx(
                  "!stroke-gray-500 !fill-gray-500 group-hover:!stroke-white group-hover:!fill-white",
                )}
              />
              <p className="group-hover:text-white">tip</p>
            </button>

            {/* </div> */}
          </AnimateInOut>
        </div>
      )}
    </Menu>
  );
}
