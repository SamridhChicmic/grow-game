import { combineReducers } from "redux";
import authSlice from "./slices/auth";
import chatBarSlice from "./slices/chatbar";
import modalSlice from "./slices/modal";
import notificationSlice from "./slices/notification";
import menuBarSlice from "./slices/menubar";
import walletSlice from "./slices/wallet";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  chatBar: chatBarSlice.reducer,
  menuBar: menuBarSlice.reducer,
  modal: modalSlice.reducer,
  notification: notificationSlice.reducer,
  wallet: walletSlice.reducer,
  // Add other slices here
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
