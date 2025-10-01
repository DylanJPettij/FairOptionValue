import type { OptionWSResponse } from "./OptionWSResponse";

interface Day {
  change: number;
  change_percent: number;
  close: number;
  high: number;
  last_updated: number;
  low: number;
  open: number;
  previous_close: number;
  volume: number;
  vwap: number;
}
interface Details {
  contract_type: string;
  exercise_style: string;
  expiration_date: string;
  shares_per_contract: number;
  strike_price: number;
  ticker: string;
}
interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}
interface UnderlyingAsset {
  ticker: string;
}
export interface Option {
  day: Day;
  details: Details;
  greeks: Greeks;
  implied_volatility: number;
  open_interest: number;
  underlying_asset: UnderlyingAsset;
  WSDetails?: OptionWSResponse;
}
export interface OptionsResponse {
  results: Option[];
  status: string;
  request_id: string;
  next_url: string;
}
