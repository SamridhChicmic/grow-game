import api from "@/api/axios";
import store from "@/store";
import { updateBalance } from "@/store/slices/wallet";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export async function getBalance() {
  try {
    const response = await api.get("/wallet");
    const data = response.data;

    console.log("getBalance", { data });
    return data;
  } catch (error) {
    console.error("getBalance", error);
    return null;
  }
}

export async function depositFunds(amount: number) {
  try {
    const response: AxiosResponse<number> = await api.post("/wallet/fund", {
      amount,
    });
    const data = response.data;

    console.log("depositFunds: ", data);

    if (!data) return false;

    // notify({ message: 'Funds deposited successfully' });
    toast.success("Funds deposited successfully");
    store.dispatch(updateBalance(data));
    console.log("depositFunds", { data });
    return true;
  } catch (error) {
    console.error("depositFunds", error);
    toast.error("Funds deposit failed");
    return false;
  }
}

export async function tipUser(params: { amount: number; username: string }) {
  try {
    if (!(params.username && params.amount)) {
      toast.error("Invalid input data");
      return false;
    }

    const response: AxiosResponse<{ message: string }> = await api.post(
      "/wallet/tip",
      params,
    );

    const data = response.data;

    // COMEBACK: get the exact messages from the server tip user function (make them better, and use codes or simple strings. Also use throw-catch to pass teh error messages), use them to enforce strict typing and maintain uniform...
    console.log("tipUser:service", { data });
    if (data.message === "success") {
      toast.success(`Tip sent to ${params.username} successfully`);
      return true;
    }

    toast.error(data.message);

    return false;
  } catch (error) {
    console.error("tipUser:service", error);
    return false;
  }
}
