import type { Option } from "../Models/Option";

export const FilterOptions = (
  optionsChain: Option[],
  selectedExpiration: string
) => {
  optionsChain = optionsChain
    .filter((option) => option.details.expiration_date === selectedExpiration)
    .sort((a, b) => {
      const aVal = a.details.strike_price;
      const bVal = b.details.strike_price;
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });

  const calls = optionsChain.filter(
    (option) => option.details.contract_type === "call"
  );

  const puts = optionsChain.filter(
    (option) => option.details.contract_type === "put"
  );
  return { calls, puts };
};
