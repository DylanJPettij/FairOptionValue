import { restClient } from "@polygon.io/client-js";
import axios from "axios";
import type { Option } from "../Models/Option";
const apiKey = "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL";
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
    console.error("An error happened:", e);
  }
};

export const getCurrentPrice = async (stockTicker: string) => {
  try {
    const response = await rest.getStocksSnapshotTicker(stockTicker);
    return response.ticker?.min?.c;
  } catch (e) {
    console.error("An error happened:", e);
  }
};

export const getOptionLastPrice = async (
  stockTicker: string,
  optionTicker: string
) => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v3/snapshot/options/MARA/O:MARA251010P00015000?apiKey=rdgLSNEX93x_QBCIcfiA33KTQmPdomvL`
    );
    const option = {} as Option;
    const items = response.data; // Assuming response.data is an array
    items.forEach((item: Option) => {
      option.details = item.details;
      option.day = item.day;
      option.greeks = item.greeks;
      option.implied_volatility = item.implied_volatility;
      option.open_interest = item.open_interest;
      option.underlying_asset = item.underlying_asset;
    });
    console.log(option);
    return option;

    return response;
  } catch (e) {
    console.error("An error happened:", e);
  }
};
