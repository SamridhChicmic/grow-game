"use client";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { toggleChatBar } from "@/store/slices/chatbar";
import { useCallback, useEffect, useState } from "react";
import { Overlay } from "@/components";
import Media from "react-media";
import ChatToggle from "./ChatToggle.tsx";
import ChatHeader from "./ChatHeader.tsx";
import { XClose } from "@/assets/svgs";
import ChatMessages from "./ChatMessages.tsx.tsx";
import ChatFooter from "./ChatFooter.tsx";
import socket from "@/utils/constants.ts";

export default function DashboardSideNavigation() {
  const [smallScreen, setSmallScreen] = useState(false);

  const showNav = useAppSelector((state) => state.chatBar);
  const auth = useAppSelector((state) => state.auth);
  const hideNav = !showNav;
  const dispatch = useAppDispatch();

  const toggleNav = useCallback(
    (state: boolean) => {
      dispatch(toggleChatBar(state));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!smallScreen) {
      // toggleNav(true);
      return;
    }

    // toggleNav(false);
  }, [smallScreen, toggleNav]);

  useEffect(() => {
    const currentUser =
      typeof window !== "undefined"
        ? localStorage.getItem("currentUser")
        : null;
    console.log(currentUser);

    // NOTE:COMEBACK
    // if(currentUser == null){
    //   location.href ='/signin'
    // }
  }, []);

  useEffect(() => {
    console.log("JOIN_CHAT");
    socket.emit("join_chat", "global", socket.id);

    socket.on("room_joined", (data) => {
      console.log("ROOM_JOINED", data);
    });

    socket.on(`user:${auth.user?.username}`, (data) => {
      console.log("SENT_TO_MEEEEEEE", data);
      alert("Okayyyy");
    });

    // return () => {
    //   socket.off("join_chat");
    // };
  }, [auth.user?.username]);

  const NavOverlay = () => {
    return (
      <Overlay
        show={showNav}
        handleShowOverlay={() => () => toggleNav(false)}
        closeOnClick
        className="z-[20]"
      />
    );
  };

  // const [loading, setLoading] = useState(false);

  return (
    <>
      {smallScreen && <NavOverlay />}
      <Media queries={{ small: { maxWidth: 768 } }}>
        {(matches) => {
          console.log({ smallScreen, matchesSmall: matches.small });
          if (matches.small !== smallScreen) {
            // console.log("CHANGED!");
            // NOTE: Yeah, I know this throws dirty warnings, but just let it be for now. It works, so we should prolly let it be until a better solution pops up.
            setSmallScreen(matches.small && true);
          }
          return (
            <div
              className={clsx(
                "w-full sm:w-[320px] fixed_ md:static_ z-[30] bg-[#15171e] h-full lg:block_ md:translate-x-0_ transition-all duration-300 flex flex-col overflow-y-auto_ border-r-2 border-gray-700/50",
                hideNav && "-translate-x-full fixed",
              )}
            >
              <div className="relative flex flex-col w-full h-full">
                {showNav && (
                  <div className="absolute right-0 hidden translate-x-full sm:block bg-body">
                    <ChatToggle icon={XClose} />
                  </div>
                )}
                <ChatHeader />
                <ChatMessages />
                <ChatFooter />
              </div>
            </div>
          );
        }}
      </Media>
    </>
  );
}
