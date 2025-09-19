// Type for a single option contract
export type OptionContract = {
  cfi: string;
  contract_type: string; // "call" | "put" could be more specific
  exercise_style: string; // "american" | "european"
  expiration_date: string; // ISO date string
  primary_exchange: string;
  shares_per_contract: number;
  strike_price: number;
  ticker: string;
  underlying_ticker: string;
};

// Type for the full API response
export type OptionsContractsResponse = {
  results: OptionContract[];
  status: string; // e.g. "OK"
  request_id: string;
  next_url?: string; // optional because sometimes pagination isn't present
};
