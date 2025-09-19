import { restClient } from "@polygon.io/client-js";

const apiKey = "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL";
const rest = restClient(apiKey, "https://api.polygon.io");

export async function getStocksOpen(stockTicker: string) {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];
    const response = await rest.getStocksOpenClose(
      stockTicker,
      formattedDate,
      true
    );
    return response.close;
  } catch (e) {
    console.error("An error happened:", e);
  }
}
