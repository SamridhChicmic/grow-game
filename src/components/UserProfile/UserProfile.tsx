import {
  CoinsIcon,
  CurrencyNote2Icon,
  DieIcon,
  HanCoinsIcon,
  StatsIcon,
  UserEditIcon,
  UserIcon,
} from "@/assets/svgs";
import { AuthForm, Button, Spinner, Wallet } from "..";
import { PropsWithChildren, useEffect, useState } from "react";
import "./userprofile.css";
import { SilverLockIcon } from "@/assets/icons";
import api from "@/api/axios";
import { AxiosError, AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { logout } from "@/services/auth";
import { closeModal, triggerModal } from "@/store/slices/modal";
import Edit from "./Edit";
import BackgroundImage from "./BackgroundImage";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserStats = {
  totalBets: "totalBets",
  gamesWon: "gamesWon",
  netProfit: "netProfit",
  totalWagered: "totalWagered",
  allTimeLow: "allTimeLow",
  allTimeHigh: "allTimeHigh",
} as const;

type UserStat = (typeof UserStats)[keyof typeof UserStats];

const userStats = new Map<UserStat, number>([
  ["totalBets", 2272],
  ["gamesWon", 825],
  ["netProfit", 448.06],
  ["totalWagered", -4.6],
  ["allTimeLow", 14.91],
  ["allTimeHigh", -6.48],
]);

console.log({ userStats });

export default function UserProfile({
  username,
  self,
}: {
  username: string;
  self?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [user, setUser] = useState<UserProfile | null>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log({ username });
  }, [username]);

  const auth = useAppSelector((state) => state.auth);

  const setSearchParams = useSearchParams()[1];

  // Check if the user profile being requested for belongs to the current user, to view as the owner of the account
  const ownAccount = self && username === auth.user?.username;

  const getUser = async (username: string) => {
    console.log("USERNAME: ", username);
    setLoading(true);
    try {
      const response: AxiosResponse<{ user: UserProfile }> = await api.get(
        `/users/${username}?${`account=${ownAccount && "self"}`}`,
      );
      const data = response.data;
      console.log("USER_PROFILE_DATA: ", data);
      setUser(data.user);
    } catch (error) {
      console.error("USER_PROFILE", { error });
    } finally {
      console.log("GET_USER_RUN");
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    console.log("USERNAME: ", username);
    setVerificationLoading(true);
    try {
      const response: AxiosResponse<{ message: string }> = await api.post(
        `/auth/request-verification`,
      );
      const data = response.data;
      console.log("REQUEST_VERIFICATION_DATA: ", data);
      if (response.status === 201)
        return toast.success(
          "An verification Link has been sent to your email",
        );
      if (response.status === 200) return toast.success(data.message);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("VERIFY_EMAIL: ", err);
      return toast.error(err.response?.data?.message);
    } finally {
      console.log("GET_USER_RUN");
      setVerificationLoading(false);
    }
  };

  useEffect(() => {
    // console.log('USER_STATS', userStats.entries(), { username });
    getUser(username);
  }, []);

  const ProfileWrapper = ({ children }: PropsWithChildren) => (
    <div className="overflow-y-auto sm:overflow-visible_ sm:mb-0 sm:w-[90vw] sm:h-[86vh]_ md:w-[65vw] md:h-[86vh]_ lg:w-[40vw] rounded space-y-1 px-2 pt-2 max-h-[95vh]">
      <div className="w-[98%] mx-auto pb-4 shrink-0 flex flex-col overflow-auto">
        <header className="shrink-0">
          <h2 className="font-semibold text-gray-400 capitalize">
            user profile
          </h2>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );

  return (
    <ProfileWrapper>
      {loading ? (
        <div className="flex items-center justify-center w-full h-24">
          <Spinner />
        </div>
      ) : user ? (
        <>
          <BackgroundImage>
            <div className="mx-auto sm:mx-0 sm:w-24 sm:ml-4">
              {user?.photo ? (
                <img
                  src={user?.photo}
                  className="object-cover w-full __user-photo__ h-[220px] sm:!h-auto"
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
              ) : (
                <UserIcon className="w-28 h-28 __user-photo__ aspect-square p-2_s !stroke-white fill-white" />
              )}
            </div>
            <div className="h-full w-[96%] mx-auto sm:mx-0 sm:p-6 sm:pl-4 space-y-2">
              <div className="flex items-center justify-center gap-1 sm:justify-start">
                <h2 className="text-3xl font-bold">{user?.username}</h2>
                <div className="p-1 h-fit py-[2px] rounded uppercase bg-[rgb(161,152,121)] text font-bold bg-amber text-gray-950 whitespace-nowrap">
                  {/* User Level */}
                  lvl {user.level}
                </div>
              </div>
              <div className="flex flex-col items-center w-full space-y-1 sm:items-start">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="uppercase  text-[#A3A6C2]">xp:</span>{" "}
                  <span>{"8,110/10,563"}</span>
                </div>
                <div className="relative w-full h-3 rounded-md after:bg-primary after:rounded overflow-clip after:absolute after:left-0 after:w-1/2 after:h-full bg-gray-800/60" />
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="uppercase text-[#A3A6C2]">join date:</span>{" "}
                  <span>
                    {/* NOTE: Format date */}
                    {new Date(user.joinDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </BackgroundImage>
          <div className="p-2 mt-3 space-y-1 rounded bg-dark-800">
            {ownAccount ? (
              <div className="bg-dark-800 gap-2 flex flex-col p-2.5 rounded-sm">
                <button
                  onClick={() => {
                    dispatch(
                      triggerModal({
                        children: <Edit />,
                        show: true,
                      }),
                    );
                  }}
                  className="text-sm rounded-sm sc-1xm9mse-0 lfSLTO text-nowrap"
                >
                  <span className="flex gap-1">
                    <UserEditIcon />
                    Edit Profile
                  </span>
                </button>
                <div className="text-sm font-semibold">
                  <div className="flex text-[0.95rem] flex-col gap-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500">Email:</span>
                      {user.email &&
                        user.email.slice(
                          0,
                          Math.min(user.email.indexOf("@"), 3),
                        ) +
                          "*".repeat(Math.max(0, user.email.indexOf("@") - 3)) +
                          user.email.slice(user.email.indexOf("@"))}
                      {ownAccount && !user.isVerified && (
                        <span className="text-xs font-semibold text-red-400">
                          (Not Verified)
                        </span>
                      )}
                    </span>
                    <button
                      onClick={verifyEmail}
                      className="text-sm rounded-sm sc-1xm9mse-0 lfSLTO text-nowrap"
                    >
                      {verificationLoading ? (
                        <Spinner />
                      ) : (
                        "Send Verification Email"
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    dispatch(
                      triggerModal({
                        children: <AuthForm route="reset-password" />,
                        show: true,
                      }),
                    );
                  }}
                  className="text-sm rounded-sm sc-1xm9mse-0 lfSLTO text-nowrap "
                >
                  Reset Password
                </button>
                <button
                  onClick={() => {
                    dispatch(
                      triggerModal({
                        message: {
                          title: "Logout",
                          text: "Are you sure you want to logout?",
                        },
                        confirm() {
                          logout();
                        },
                        cancel() {
                          dispatch(closeModal());
                        },
                        show: true,
                      }),
                    );
                  }}
                  className="gap-1 text-sm rounded-sm sc-1xm9mse-0 logout-btn text-nowrap"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="18"
                    width="18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path>
                    <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path>
                  </svg>{" "}
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <header>
                  <h3 className="text-sm font-semibold text-gray-400 capitalize sm:text-base">
                    actions
                  </h3>
                </header>
                <Button
                  onClick={() => {
                    setSearchParams({ modal: "tip", "tip-user": username });
                    dispatch(
                      triggerModal({ children: <Wallet />, show: true }),
                    );
                  }}
                  className="flex items-center capitalize gap-1 w-full !py-1"
                >
                  <CurrencyNote2Icon />
                  <p>tip</p>
                </Button>
              </>
            )}
          </div>
          <div className="bg-dark-800 p-2.5 mt-3 rounded-sm gap-2 flex flex-col">
            <span className="text-[1rem] gap-1 font-semibold flex items-center text-gray-400">
              <StatsIcon />
              User Statistics
            </span>
            <div className="grid grid-cols-2 gap-2 auto-rows-auto">
              <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
                <span className="flex items-center gap-1">
                  <DieIcon />
                  <span>Total Bets</span>
                </span>
                <span className="flex items-center gap-1 text-white">
                  {user.totalBets}
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
                <span className="flex items-center gap-1">
                  <DieIcon />
                  <span>Games Won</span>
                </span>
                <span className="flex items-center gap-1 text-white">
                  {user.gamesWon}
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
                <span className="flex items-center gap-1">
                  <CoinsIcon />
                  <span>Total Wagered</span>
                </span>
                <span className="flex items-center gap-1 text-white">
                  {user.totalWagered}
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
                <span className="flex items-center gap-1">
                  <HanCoinsIcon />
                  <span>Net Profit</span>
                </span>
                <span className="flex items-center gap-1 text-white">
                  <span className="flex items-center gap-1">
                    {user.netProfit}
                    <img
                      src={SilverLockIcon}
                      width="18"
                      height="18"
                      className="sc-x7t9ms-0 dnLnNz"
                    />
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
                <span className="flex items-center gap-1">
                  <StatsIcon />
                  <span>All Time High</span>
                </span>
                <span className="flex items-center gap-1 text-white">
                  {user.allTimeHigh?.toFixed(2)}
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-dark-700 text-sm font-semibold p-2.5 rounded-sm items-center">
                <span className="flex items-center gap-1">
                  <StatsIcon />
                  <span>All Time Low</span>
                </span>
                <span className="flex items-center gap-1 text-white">
                  {user.allTimeLow}
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-40">
          <p className="text-4xl font-bold text-center text-gray-400">
            User Unavailable
          </p>
        </div>
      )}
    </ProfileWrapper>
  );
}
