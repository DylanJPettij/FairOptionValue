import { websocketClient } from "@polygon.io/client-js";
import type { StockPricingInfo } from "../Models/StockPricingInfo";

export const GetStockData = async (SetStockData: any, stockTicker: String) => {
  // create a websocket client using the polygon client-js library
  const ws = websocketClient(
    "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL",
    "wss://delayed.polygon.io"
  ).stocks();

  // register a handler to log errors
  ws.onerror = (err: String) => console.log("Failed to connect", err);

  // register a handler to log info if websocket closes
  ws.onclose = (code: String, reason: String) =>
    console.log("Connection closed", code, reason);

  // register a handler when messages are received
  ws.onmessage = (msg: any) => {
    // parse the data from the message
    const parsedMessage = JSON.parse(msg.data);

    // wait until the message saying authentication was successful, then subscribe to a channel
    if (
      parsedMessage[0].ev === "status" &&
      parsedMessage[0].status === "auth_success"
    ) {
      console.log(
        `Subscribing to the minute aggregates channel for ticker ${stockTicker}`
      );
      ws.send(
        JSON.stringify({ action: "subscribe", params: `"A.${stockTicker}"` })
      );
      // ws.send(JSON.stringify({"action":"subscribe", "params":"AM.*"})); // all tickers
      // ws.send(JSON.stringify({"action":"subscribe", "params":"AM.AAPL"})); // single ticker
      // ws.send(JSON.stringify({"action":"subscribe", "params":"AM.AAPL,AM.MSFT"})); // multiple tickers
    }
    if (parsedMessage[0].c !== undefined) {
      SetStockData(parsedMessage[0].c);
    }
  };
};
