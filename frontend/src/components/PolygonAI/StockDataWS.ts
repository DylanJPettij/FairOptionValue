import { websocketClient } from "@polygon.io/client-js";
const apiKey = import.meta.env.VITE_API_KEY;
export const GetStockData = () => {
  // create a websocket client using the polygon client-js library
  const ws = websocketClient(apiKey, "wss://delayed.polygon.io").stocks();

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
    }
  };
  return {
    getStockPrice: (SetStockData: any, stockTicker: String) => {
      ws.send(
        JSON.stringify({ action: "subscribe", params: `"A.${stockTicker}"` })
      );
      ws.onmessage = (msg: any) => {
        // parse the data from the message
        const parsedMessage = JSON.parse(msg.data);
        // wait until the message saying authentication was successful, then subscribe to a channel
        if (
          parsedMessage[0].ev === "status" &&
          parsedMessage[0].status === "auth_success"
        ) {
          console.log("Message received:", parsedMessage[0]);
        }
        if (parsedMessage[0].c === undefined) {
          return;
        } else {
          SetStockData(parsedMessage[0].c);
        }
      };
    },
    close: () => {
      ws.close();
    },
    unsubscribe: (stock: string) => {
      ws.send(JSON.stringify({ action: "unsubscribe", params: `A.${stock}` }));
    },
  };
};
