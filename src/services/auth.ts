import api from "@/api/axios";
import store from "@/store";
import { clearUser } from "@/store/slices/auth";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export async function logout() {
  try {
    const response: AxiosResponse<{ message: string }> =
      await api.post("/auth/sign-out");

    const data = response.data;
    console.log("LogOut: ", { data });
    if (response.status == 201) {
      store.dispatch(clearUser());
      toast.success("You are now Logged Out");
    }
  } catch (error) {
    console.error("logout: ", error);
  }
}
