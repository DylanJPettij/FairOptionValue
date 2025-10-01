import { restClient } from "@polygon.io/client-js";

const apiKey = import.meta.env.VITE_API_KEY;
const rest = restClient(apiKey, "https://api.polygon.io");

export const getStocksOpen = async (stockTicker: string) => {
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
    // console.error("An error happened:", e);
  }
};

export const getCurrentPrice = async (stockTicker: string) => {
  try {
    const response = await rest.getStocksSnapshotTicker(stockTicker);
    return response.ticker?.min?.c;
  } catch (e) {
    // console.error("An error happened:", e);
  }
};
