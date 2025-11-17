import { createSlice } from "@reduxjs/toolkit";

const menuBarSlice = createSlice({
  name: "menuBar",
  initialState: false,
  reducers: {
    toggleMenuBar(state) {
      // if (action?.payload !== undefined) {
      //   console.log("NOT_UNDEFINED=>", { payload: action.payload });
      //   state = action.payload;
      //   console.log("N_UND", state);
      //   return state;
      // }
      state = !state;

      return state;
    },
  },
});

export const { toggleMenuBar } = menuBarSlice.actions;
export default menuBarSlice;
