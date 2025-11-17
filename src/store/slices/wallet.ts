import { Notification } from "@/components";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type WalletState = {
  balance: number;
  currency: Currency;
};

const initialState: WalletState = {
  balance: 0,
  currency: "world-lock",
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateBalance(state, action: PayloadAction<number>) {
      console.log("BALANCE_PAYLOAD", action.payload, action.payload);
      state.balance = action.payload;
    },
    changeCurrency(state) {
      if (state.currency === "world-lock") {
        state.currency = "diamond-lock";
      } else {
        state.currency = "world-lock";
      }
      console.log("NEW_CURRENCY: ", state.currency);
      Notification.currencyChanged(state.currency);
    },
  },
  extraReducers: (builder) => {
    builder;
    // Handle signupUser and other async thunks similarly...
  },
});

export const { changeCurrency, updateBalance } = walletSlice.actions;
export default walletSlice;
