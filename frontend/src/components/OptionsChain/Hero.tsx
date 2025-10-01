import { useEffect, useState } from "react";
import type { Option } from "../Models/Option";
import { Header } from "./Header";
import { FairValueFooter } from "./FairValueFooter/FairValueFooter";
import { SearchBar } from "./SearchBar";
import { OptionsChain } from "./OptionsChain";

export const Hero = (props: any) => {
  //default expiration dates for testing

  const [selectedExpiration, setSelectedExpiration] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedOption, SetSelectedOption] = useState<Option>();
  const [currentStockPrice, SetCurrentStockPrice] = useState(0);
  const [openingPrice, setOpeningPrice] = useState<number>(0);
  //handle search term input

  return (
    <>
      {/* Header */}
      <div className="container mx-auto p-6 space-y-6">
        <Header
          selectedStock={selectedStock}
          currentStockPrice={currentStockPrice}
          priceChangePercent={
            ((currentStockPrice - openingPrice) / openingPrice) * 100
          }
        />
        {/* Filters */}
        <SearchBar
          setSearchTerm={setSearchTerm}
          setSelectedStock={setSelectedStock}
          searchTerm={searchTerm}
          setOpeningPrice={setOpeningPrice}
          selectedExpiration={selectedExpiration}
          setSelectedExpiration={setSelectedExpiration}
          stockRef={props.stockRef}
          SetCurrentStockPrice={SetCurrentStockPrice}
          selectedStock={selectedStock}
        />

        {/* this is where the options chains begin */}
        <OptionsChain
          selectedStock={selectedStock}
          selectedExpiration={selectedExpiration}
          currentStockPrice={currentStockPrice}
          optionRef={props.optionRef}
          SetSelectedOption={SetSelectedOption}
        />
        <FairValueFooter
          selectedOption={selectedOption}
          currentStockPrice={currentStockPrice}
        />
      </div>
    </>
  );
};
