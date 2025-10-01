import { websocketClient } from "@polygon.io/client-js";
import type { Option } from "../Models/Option";
import type { OptionWSResponse } from "../Models/OptionWSResponse";
const apiKey = import.meta.env.VITE_API_KEY;

export const OptionDataWS = () => {
  const ws = websocketClient(apiKey, "wss://delayed.polygon.io").options();

  ws.onerror = (err: string) => console.log("Failed to connect", err);

  ws.onclose = (code: string, reason: string) =>
    console.log("Connection closed", code, reason);

  ws.onmessage = (msg: any) => {
    const parsedMessage = JSON.parse(msg.data);

    if (
      parsedMessage[0].ev === "status" &&
      parsedMessage[0].status === "auth_success"
    ) {
    }
  };
  return {
    send: (message: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log("WebSocket is open. Sending message:", message);
        ws.send(message);
      } else {
        console.error("WebSocket is not open. Ready state: " + ws.readyState);
      }
    },
    getOptionsData: (SetOptionsChain: any, OptionsChain: Option[]) => {
      ws.onmessage = (msg: any) => {
        const parsedMessage = JSON.parse(msg.data);

        if (parsedMessage[0].ev === "A") {
          const optionData: OptionWSResponse = parsedMessage[0];

          const optionIndex = OptionsChain.findIndex(
            (option) => option.details.ticker === optionData.sym
          );

          if (optionIndex !== -1) {
            const newOptionsChain = [...OptionsChain];

            newOptionsChain[optionIndex] = {
              ...newOptionsChain[optionIndex],
              day: {
                low: optionData.vw,
                high: optionData.h,
                change: (optionData.c - optionData.op) / optionData.c,
                change_percent: (optionData.c - optionData.op) / optionData.c,
                close: optionData.c,
                last_updated: optionData.s,
                open: optionData.op,
                previous_close: optionData.op,
                volume: optionData.av,
                vwap: optionData.v,
              },
              WSDetails: optionData,
            };

            SetOptionsChain(newOptionsChain);
          }
        }
      };
    },
    close: () => {
      ws.close();
    },
    unsubscribe: (tickers: string) => {
      console.log("Unsubscribing from tickers:", tickers);
      ws.send(JSON.stringify({ action: "unsubscribe", params: `${tickers}` }));
    },
    //If I need another method to interact add that here
  };
};
