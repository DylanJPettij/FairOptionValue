import { websocketClient } from "@polygon.io/client-js";

//create connect method

//
export const OptionDataWS = () => {
  // create a websocket client using the polygon client-js library
  const ws = websocketClient(
    "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL",
    "wss://delayed.polygon.io"
  ).options();

  // register a handler to log errors
  ws.onerror = (err: string) => console.log("Failed to connect", err);

  // register a handler to log info if websocket closes
  ws.onclose = (code: string, reason: string) =>
    console.log("Connection closed", code, reason);

  // register a handler when messages are received
  ws.onmessage = (msg: any) => {
    // parse the data from the message
    const parsedMessage = JSON.parse(msg.data);

    // wait until the message saying authentication was successful, then subscribe to a channel
    if (
      parsedMessage[0].ev === "status" &&
      parsedMessage[0].status === "auth_success"
    )
      console.log("Message received:", parsedMessage[0]);
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
    close: () => {
      ws.close();
    },
    //If I need another method to interact add that here
  };
};
