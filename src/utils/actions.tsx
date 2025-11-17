import { UserProfile } from "@/components";
import store from "@/store";
import { triggerModal } from "@/store/slices/modal";

export const viewUserProfile = (username: string) => {
  store.dispatch(
    triggerModal({
      children: <UserProfile username={username} />,
      className: "h-[80%]",
      show: true,
    }),
  );
};
