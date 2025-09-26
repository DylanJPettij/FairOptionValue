import { createSlice } from "@reduxjs/toolkit";
import type { IWebsocketClient } from "@polygon.io/client-js";

export interface WebSocketState {
  optionSocket: IWebsocketClient | null;
  stockSocket: IWebsocketClient | null;
}

const websocketReducer = createSlice({
  name: "ws",
  initialState: {
    optionSocket: null,
    stockSocket: null,
  },
  reducers: {
    setStockWS: (state, action) => {
      state.optionSocket = action.payload;
    },
    setOptionWS: (state, action) => {
      state.stockSocket = action.payload;
    },
  },
});

export const { setOptionWS, setStockWS } = websocketReducer.actions;

export default websocketReducer.reducer;
