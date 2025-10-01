import axios from "axios";
import type { Option } from "../Models/Option";
import { formatString } from "./FormatStrings";
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "http://localhost:8080/options";
interface BSAndBinomialRequest {
  stockPrice: number;
  strikePrice: number;
  rfr: number;
  contDividendYield: number;
  timeToExpiry: number;
  volatility: number;
  steps: number;
  market: string;
  optionType: string;
}

export const GetCurrentRFR = async () => {
  const rate = await axios.get(`${BASE_URL}/rates`);

  return rate.data as number;
};

export const getStockDividend = async (
  option: Option,
  currentStockPrice: number
) => {
  const res = await axios.get(
    `https://api.polygon.io/v3/reference/dividends?ticker=${option.underlying_asset.ticker}&pay_date.gte=2024-09-30&dividend_type=CD&order=desc&limit=12&sort=ex_dividend_date&apiKey=${API_KEY}`
  );
  let annualDividend: number = 0;
  let div: string;
  for (let i = 0; i < res.data.results.length; i++) {
    annualDividend += res.data.results[i].cash_amount;
  }

  div = formatString(((annualDividend / currentStockPrice) * 100).toFixed(2));

  return Number.parseFloat(div);
};

export const GetBSAndBinomial = async (
  option: Option,
  currentStockPrice: number
) => {
  if (currentStockPrice == undefined || option == undefined) return;

  let request = {} as BSAndBinomialRequest;

  if (option.details.contract_type == "call") {
    request.optionType = "CALL";
  } else {
    request.optionType = "PUT";
  }

  request.market = "American";

  request.stockPrice = currentStockPrice;
  request.strikePrice = option.details.strike_price;
  request.contDividendYield = await getStockDividend(option, currentStockPrice);
  request.volatility = option.implied_volatility;

  //setting the number of steps for the binomial function
  request.steps = 100;
  request.rfr = await GetCurrentRFR();

  const expiration = new Date(option.details.expiration_date);
  const now = new Date();

  const msInDay = 1000 * 60 * 60 * 24;

  request.timeToExpiry = Math.max(
    0,
    Math.floor((expiration.getTime() - now.getTime()) / msInDay)
  );

  const calculations = await axios.post(`${BASE_URL}/fair`, request);

  return calculations.data;
};

export const checkStockValid = async (stock: string) => {
  try {
    await axios.get(
      `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${API_KEY}`
    );
    return true;
  } catch {
    return false;
  }
};
