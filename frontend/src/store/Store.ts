import { configureStore } from "@reduxjs/toolkit";
import websocketReducer from "../Reducer/Reducer";

export const Store = configureStore({
  reducer: {
    ws: websocketReducer,
  },
});
