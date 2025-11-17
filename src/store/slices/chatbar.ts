import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chatBarSlice = createSlice({
  name: "chatBar",
  initialState: false,
  reducers: {
    toggleChatBar(state, action: PayloadAction<boolean>) {
      console.log("STATE_2", { state, action: action?.payload });
      if (action?.payload !== undefined) {
        console.log("NOT_UNDEFINED=>", { payload: action.payload });
        state = action.payload;
        console.log("N_UND", state);
        return state;
      }
      state = !state;

      return state;
    },
  },
});

export const { toggleChatBar } = chatBarSlice.actions;
export default chatBarSlice;
