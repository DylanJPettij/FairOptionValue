import axios from "axios";
import { type Option } from "../Models/Option";

const API_KEY = "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL"; // Replace with your actual API key

async function getOptions(
  stockSymbol: string,
  currentPrice: number,
  expirationDate: string
): Promise<Option[]> {
  const callsAboveUrl = `https://api.polygon.io/v3/snapshot/options/${stockSymbol}?strike_price.gte=${currentPrice}&expiration_date.lte=${expirationDate}&contract_type=call&order=asc&limit=5&sort=strike_price&apiKey=${API_KEY}`;
  const callsBelowUrl = `https://api.polygon.io/v3/snapshot/options/${stockSymbol}?strike_price.lte=${currentPrice}&expiration_date.lte=${expirationDate}&contract_type=call&order=desc&limit=5&sort=strike_price&apiKey=${API_KEY}`;
  const putsAboveUrl = `https://api.polygon.io/v3/snapshot/options/${stockSymbol}?strike_price.gte=${currentPrice}&expiration_date.lte=${expirationDate}&contract_type=put&order=asc&limit=5&sort=strike_price&apiKey=${API_KEY}`;
  const putsBelowUrl = `https://api.polygon.io/v3/snapshot/options/${stockSymbol}?strike_price.lte=${currentPrice}&expiration_date.lte=${expirationDate}&contract_type=put&order=desc&limit=5&sort=strike_price&apiKey=${API_KEY}`;

  try {
    const [callsAbove, callsBelow, putsAbove, putsBelow] = await Promise.all([
      axios.get(callsAboveUrl),
      axios.get(callsBelowUrl),
      axios.get(putsAboveUrl),
      axios.get(putsBelowUrl),
    ]);

    return [
      ...callsAbove.data.results,
      ...callsBelow.data.results,
      ...putsAbove.data.results,
      ...putsBelow.data.results,
    ];
  } catch (error) {
    console.error("Error fetching options:", error);
    throw error;
  }
}

// Example usage
// getOptions('NVDA', 180, '2025-10-17').then(options => console.log(options));
export default getOptions;
