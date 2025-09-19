import { websocketClient } from "@polygon.io/client-js";

export const Streamer = () => {
  // Connection Type:
  const optionsWS = websocketClient(
    "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL",
    "wss://delayed.polygon.io"
  ).options(); // stocks 15-min delay
  //const ws = new WebSocket('wss://socket.polygon.io/stocks') // stocks real-time
  //const ws = new WebSocket('wss://socket.polygon.io/forex') // forex

  // register a handler to log errors
  optionsWS.onerror = (err: any) => console.log("Failed to connect", err);

  // register a handler to log info if websocket closes
  optionsWS.onclose = (code: any, reason: any) =>
    console.log("Connection closed", code, reason);
    
  // register a handler when messages are received
  optionsWS.onmessage = (msg: any) => {
    // parse the data from the message
    const parsedMessage = JSON.parse(msg.data);

    // wait until the message saying authentication was successful, then subscribe to a channel
    if (
      parsedMessage[0].ev === "status" &&
      parsedMessage[0].status === "auth_success"
    ) {
      console.log(
        "Subscribing to the minute aggregates channel for ticker AAPL"
      );
      optionsWS.send(
        JSON.stringify({ action: "subscribe", params: "AM.AAPL" })
      );
    }
    optionsWS.on("message", (data: any) => {
      data = JSON.parse(data);
      console.log(data);
    });

    console.log("Message received:", parsedMessage);
  };
};
