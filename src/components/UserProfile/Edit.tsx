import { Disclosure } from "@headlessui/react";
import AnimateInOut from "../AnimateInOut";
import Button from "../Button";
import { ExpandMoreIcon, GiftBoxIcon, UserIcon } from "@/assets/svgs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setUser } from "@/store/slices/auth";
import clsx from "clsx";
import BackgroundImage from "./BackgroundImage";
import store from "@/store";

type UserDetails = {
  username: string;
  avatar: string;
  background: string;
};

const detailsData = {
  avatar: [
    "none",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100246.jpg?t=st=1715495956~exp=1715499556~hmac=1bed96165ed3d1054e54391dd5cfcc83cbbb166acb3f85698f70667ce74eda00&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100273.jpg?t=st=1715495839~exp=1715499439~hmac=7398b56422db752754238a50fefe18e7ed5063056aa30ce46a034f898e9427aa&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100222.jpg?t=st=1715496203~exp=1715499803~hmac=8bdbcdf35c3a91bdd540d8632354b0762be4d4e65482a6aecd83122f80ef763b&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100164.jpg?t=st=1715496221~exp=1715499821~hmac=dddfaf1b1b37ea45e36a9b9f287cf095528e391dd171d6aaa46e699882997666&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100224.jpg?t=st=1715496233~exp=1715499833~hmac=c75506d248d72c2d8ff6f2b48e285803febbf2d71a0b89a9e838cd2f1d706562&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100165.jpg?t=st=1715496247~exp=1715499847~hmac=dced6f4bd0c074aa627abde928e4dcfa0ca97c23450369f4c7b133a6a4b5c897&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100228.jpg?t=st=1715496276~exp=1715499876~hmac=46ffb1eba75dc956b2e8259d655cdc0beb95791cc1b06510417127832b1e4445&w=740",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100207.jpg?t=st=1715496289~exp=1715499889~hmac=42f6b4c318185dd8707ff90c5a912ed0b1d11e156bdfc9a29cfce2a650e1c9a5&w=740",
  ],
  background: [
    "none",
    "https://images.unsplash.com/photo-1557411732-1797a9171fcf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGF0dGVybiUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGF0dGVybiUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGF0dGVybiUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhdHRlcm4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBhdHRlcm4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBhdHRlcm4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBhdHRlcm4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
  ],
  username: [store.getState().auth.user?.username || ""],
} as const;

export default function Edit() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("PHOTo: ", auth.user?.photo);
  }, [auth.user?.photo]);

  const [details, setDetails] = useState<UserDetails>({
    avatar: "",
    background: "",
    username: "",
  });

  const updateProfile = async () => {
    if (!(details.avatar || details.background || details.username))
      return toast.warn("Please enter valid user details");

    console.log({ details });

    try {
      const response = await api.patch(
        `/users?avatar=${details.avatar ? "true" : ""}&background=${details.background ? "true" : ""}&username=${details.username ? "true" : ""}`,
        details,
      );
      const data = response.data;
      console.log("UPDATE_PROFILE: ", { data });

      if (response.status === 201) {
        const updatedUser = data.updatedUser;
        if (auth.user)
          dispatch(
            setUser({
              ...auth,
              user: {
                ...auth.user,
                photo:
                  updatedUser?.avatar ||
                  (updatedUser?.avatar === "none" ? "" : auth.user.photo),
                username: updatedUser?.username || auth.user.username,
                background: updatedUser?.background || auth.user.background,
              },
            }),
          );

        return toast.info(data.message);
      }
    } catch (error) {
      console.error("UPDATE_PROFILE: ", error);
      return toast.error("could not update profile");
    }
  };

  const initialDisclosureStatus = {
    avatar: { open: false },
    background: { open: false },
    username: { open: false },
  };

  const [disClosureStatus, setDisclosureStatus] = useState(
    initialDisclosureStatus,
  );

  useEffect(() => {
    console.log({ disClosureStatus });
  }, [disClosureStatus]);

  // const [activeDisclosure, setActiveDisclosure] = useState<number | null>(null);

  return (
    <div className="p-3 max-w-[600px] flex flex-col font-medium bg-dark-850 gap-2 w-full_ max-sm:max-w-full max-sm:w-full text-sm text-gray-400 overflow-y-auto sm:overflow-visible_ sm:mb-0 sm:w-[90vw] sm:h-[86vh]_ md:w-[65vw] md:h-[86vh]_ lg:w-[40vw] rounded space-y-1 px-2 pt-2 max-h-[95vh]">
      <div className="flex gap-1.5 items-center">Edit User Profile</div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-1.5 text-sm">
          <BackgroundImage variant="edit">
            {auth.user?.photo ? (
              <img
                // src="https://avatar.growdice.lol/700-270-1692-1502-38-448-00-04-1348237567.png"
                src={auth.user?.photo}
                alt="Preview"
                className="sc-134abzr-1 edit-modal-avatar"
              />
            ) : (
              <UserIcon className="w-28 h-28 aspect-square m-auto mt-10 !stroke-white" />
            )}
          </BackgroundImage>
          <Button
            onClick={updateProfile}
            className="w-full mt-3 !py-3 text-sm rounded-sm text-nowrap"
          >
            Save Changes
          </Button>

          {Object.keys(detailsData).map((detail) => {
            const disclosureOpen = disClosureStatus[detail].open === true;
            return (
              <div className="z-10 pt-4 bg-dark-850">
                <Disclosure>
                  {() => (
                    <>
                      <Disclosure.Button
                        onClick={() => {
                          if (disclosureOpen) {
                            console.log("IS_OPEN");
                            // close();
                            setDisclosureStatus({
                              ...initialDisclosureStatus,
                              [detail]: { open: false },
                            });
                            return;
                          }
                          setDisclosureStatus({
                            ...initialDisclosureStatus,
                            [detail]: { open: true },
                          });
                          // setActiveDisclosure(index);
                        }}
                        className="flex flex-row items-center justify-between gap-1 w-fit"
                      >
                        <p className="">{detail}</p>
                        <ExpandMoreIcon
                          className={`${disclosureOpen ? "rotate-180" : "rotate-0"} transform transition-transform duration-200 stroke-gray-300/70`}
                        />
                      </Disclosure.Button>

                      <AnimateInOut
                        show={disclosureOpen}
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ type: "keyframes" }}
                        className="rounded w-full pt-[5px] p-2 max-h-44 r overflow-auto"
                      >
                        {detail === "username" ? (
                          <div>
                            <div>
                              <input
                                value={details.username}
                                onChange={(e) =>
                                  setDetails((prev) => ({
                                    ...prev,
                                    username: e.target.value,
                                  }))
                                }
                                className="p-1 rounded-sm focus:outline outline-primary focus:outline-primary focus:border-none block text-white text-base bg-dark-800/50"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 rounded bg-dark-750 grid grid-cols-4 w-full pt-[5px] gap-3 h-full">
                            {detailsData[detail].map((item) => (
                              <button
                                onClick={() =>
                                  setDetails({ ...details, [detail]: item })
                                }
                                className={clsx(
                                  "rounded outline outline-1 outline-gray-500 aspect-square flex items-center justify-center overflow-clip",
                                  details[detail] === item &&
                                    "outline-primary outline-4",
                                )}
                              >
                                {/* {item} */}
                                {item === "none" ? (
                                  "none"
                                ) : (
                                  <img
                                    src={item}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </AnimateInOut>
                    </>
                  )}
                </Disclosure>
              </div>
            );
          })}
          {/* <div className="z-10 pt-4 bg-dark-850">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex flex-row items-center justify-between gap-1 w-fit">
                    <p className="">background</p>
                    <ExpandMoreIcon
                      className={`${
                        open ? "rotate-180" : "rotate-0"
                      } transform transition-transform duration-200 stroke-gray-300/70`}
                    />
                  </Disclosure.Button>

                  <AnimateInOut
                    show={open}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ type: "keyframes" }}
                    className="rounded w-full pt-[5px] p-2 max-h-44 r overflow-auto"
                  >
                    <div className="p-2 rounded bg-dark-750 grid grid-cols-4 w-full pt-[5px] gap-3 h-full">
                      {backgrounds.map((background) => (
                        <button
                          onClick={() => setDetails({ ...details, background })}
                          className={clsx(
                            "rounded outline outline-1 outline-gray-500 aspect-square flex items-center justify-center overflow-clip",
                            details.background === background &&
                              "outline-primary outline-4",
                          )}
                        >
                          {background === "none" ? (
                            "none"
                          ) : (
                            <img
                              src={background}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </AnimateInOut>
                </>
              )}
            </Disclosure>
          </div> */}
        </div>
      </div>
      <div></div>
    </div>
  );

  // function DetailUpdate({
  //   detail,
  //   index,
  // }: {
  //   detail: keyof typeof detailsData;
  //   index: number;
  // }) {

  //   const disclosureRef = useRef();

  //   return (

  //   );
  // }
}
