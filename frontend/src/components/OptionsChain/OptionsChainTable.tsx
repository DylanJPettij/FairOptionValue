import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { TextColorClass } from "../Methods/TextColorClass";
import { Badge } from "../ui/badge";
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { SelectItem } from "../ui/select";
import { use, useEffect, useState } from "react";
import type { StockPricingInfo } from "../../components/Models/StockPricingInfo";
import {
  getCurrentPrice,
  getOptionLastPrice,
  getStocksOpen,
} from "../PolygonAI/TickerSummary";
import type { Option } from "../Models/Option";
import getOptions from "../PolygonAI/ListOptions";

const OptionsChainTable = (props: any) => {
  const [selectedExpiration, setSelectedExpiration] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedOption, setSelectedOption] = useState<Option>();

  const [optionsChain, SetOptionsChain] = useState<Option[]>();
  const [stockData, SetStockData] = useState<number>(0);
  const [openingPrice, setOpeningPrice] = useState<number>(0);

  const [lastStock, setLastStock] = useState<string>("");

  const [lastPrice, SetLastPrice] = useState<StockPricingInfo>({
    currentPriceDiff: 0,
    currentStockPrice: 0,
  });

  useEffect(() => {
    SetLastPrice({
      currentStockPrice: stockData,
      currentPriceDiff: ((stockData - openingPrice) / openingPrice) * 100,
    });
  }, [stockData]);

  const ChangeChain = async () => {
    let options = await getOptions(
      lastStock,
      Math.round(stockData),
      selectedExpiration
    );
    SetOptionsChain(options);
  };

  //having to call another function within the useEffect to use an async function
  useEffect(() => {
    if (selectedStock !== "") {
      ChangeChain();
    }
  }, [selectedExpiration]);

  //
  const handleClick = async (stockTicker: string) => {
    // if (stockTicker === lastStock) {
    //   return;
    // }
    if (stockTicker === "") {
      return;
    }
    try {
      let currentPrice;
      await getCurrentPrice(stockTicker).then((data) => (currentPrice = data));
      if (currentPrice === undefined) {
        return;
      }
      SetStockData(currentPrice as number);
      props.stockRef.unsubscribe(lastStock);
      setLastStock(stockTicker);
      getStocksOpen(stockTicker).then((data) =>
        setOpeningPrice(data as number)
      );

      //subscribe to the stock ticker for real-time updates
      props.stockRef.getStockPrice(SetStockData, stockTicker);

      let optionsChain = await getOptions(
        stockTicker,
        currentPrice,
        selectedExpiration
      );

      if (optionsChain === undefined) {
        optionsChain = [];
      }

      SetOptionsChain(optionsChain);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      return;
    }
    handleClick(searchTerm.toUpperCase());
    SetLastPrice({
      currentStockPrice: 0,
      currentPriceDiff: 0,
    });

    //get the form data from the envent
    const formData = new FormData(e.currentTarget);
    if (formData != null) {
      setSelectedStock(
        formData.get("search")?.toString().toUpperCase() as string
      );

      setSearchTerm("");
    }
  };

  //handle search term input
  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  //select option
  const handleRowClick = (e: Option) => {
    console.log(e);
    setSelectedOption(e);
  };
  //default expiration dates for testing
  const ExpirationDates = [
    "2025-10-03",
    "2025-10-10",
    "2025-10-17",
    "2025-10-24",
    "2025-10-31",
    "2025-11-21",
    "2025-12-19",
    "2026-01-16",
    "2026-02-20",
    "2026-03-20",
    "2026-04-17",
    "2026-05-15",
    "2026-06-18",
    "2026-08-21",
    "2026-09-18",
    "2026-12-18",
    "2027-01-15",
    "2027-06-17",
    "2027-12-17",
    "2028-01-21",
  ];

  const currentPrice = stockData;
  const priceChangePercent =
    ((currentPrice - openingPrice) / openingPrice) * 100;

  let filteredData = optionsChain ? [...optionsChain] : [];

  filteredData = filteredData
    .filter((option) => option.details.expiration_date === selectedExpiration)
    .sort((a, b) => {
      const aVal = a.details.strike_price;
      const bVal = b.details.strike_price;
      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

  const calls = filteredData.filter(
    (option) => option.details.contract_type === "call"
  );
  const puts = filteredData.filter(
    (option) => option.details.contract_type === "put"
  );

  return (
    <>
      {/* Header */}
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Fair Option Value
            </h1>
            <div className="grid grid-cols-3 items-center gap-2 mt-2">
              <span className="font-mono font-semibold">{selectedStock}</span>
              <span className="text-2x1 font-mono font-semibold">
                ${Math.round(currentPrice * 100) / 100}
              </span>
              <Badge
                variant="default"
                className={TextColorClass(priceChangePercent)}
              >
                {priceChangePercent > 0 ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {priceChangePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Search Stock..."
                    id="search"
                    name="search"
                    className="w-48"
                    value={searchTerm}
                    disabled={selectedExpiration === ""}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                </form>
              </div>
              <Select
                value={selectedExpiration}
                onValueChange={setSelectedExpiration}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Expiration" />
                </SelectTrigger>
                <SelectContent className="max-h-45 overflow-y-auto">
                  {ExpirationDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* this is where the options chains begin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-chart-1 text-center">Calls</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/30">
                    <TableHead className="text-left p-2">Strike</TableHead>
                    <TableHead className="text-left p-2">Last</TableHead>
                    <TableHead className="text-left p-2">Volume</TableHead>
                    <TableHead className="text-left p-2">OI</TableHead>
                    <TableHead className="text-left p-2">IV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((option, index) => (
                    <TableRow
                      key={option.details.ticker}
                      onClick={() => handleRowClick(option)}
                      className={`border-b cursor-pointer hover:border-orange-300 hover:shadow-[0_0_0_3px_theme('colors.orange.300')] hover:bg-blue-200 hover:outline-offset-2
                    transition-colors ${
                      option?.details?.strike_price <= currentPrice
                        ? "bg-chart-1/5"
                        : ""
                    }`}
                    >
                      <TableCell className="p-2 font-mono font-semibold">
                        ${option?.details?.strike_price}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        ${option?.day?.low?.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {option?.day?.volume?.toLocaleString()}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {option?.open_interest?.toLocaleString()}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {(option?.implied_volatility * 100).toFixed(1) + "%"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive text-center">
                Puts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b bg-muted/30">
                      <TableHead className="text-left p-2">Strike</TableHead>
                      <TableHead className="text-left p-2">Last</TableHead>
                      <TableHead className="text-left p-2">Volume</TableHead>
                      <TableHead className="text-left p-2">OI</TableHead>
                      <TableHead className="text-left p-2">IV</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {puts.map((option, index) => (
                      <TableRow
                        key={option.details.ticker}
                        onClick={() => handleRowClick(option)}
                        className={`border-b cursor-pointer hover:border-orange-300 hover:shadow-[0_0_0_3px_theme('colors.orange.300')] hover:bg-blue-200 hover:outline-offset-2
                    transition-colors ${
                      option.details.strike_price >= currentPrice
                        ? "bg-destructive/5"
                        : ""
                    }`}
                      >
                        <TableCell className="p-2 font-mono font-semibold">
                          ${option?.details?.strike_price}
                        </TableCell>
                        <TableCell className="p-2 font-mono">
                          ${option?.day?.low?.toFixed(2)}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-sm">
                          {option?.day?.volume?.toLocaleString()}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-sm">
                          {option?.open_interest?.toLocaleString()}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-sm">
                          {(option?.implied_volatility * 100).toFixed(1) + "%"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="font-semibold p-2 justify-center">
            Fair Value Estimate
          </CardHeader>
          <CardContent>
            <div>{selectedOption?.underlying_asset.ticker}</div>
            <div>{selectedOption?.details.contract_type}</div>
            <div>{selectedOption?.details.expiration_date}</div>
            <div>${selectedOption?.day.low}</div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded flex flex-col items-center justify-center">
                <div className="p-4 bg-gray-300 rounded border-b w-1/7">
                  <div className="text-2xl font-bold font-mono">11.95</div>
                </div>
                <div className="text-sm text-muted-foreground font-semibold">
                  Black-Scholes
                </div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded lg">
                <div className="text-center p-4 bg-muted/30 rounded flex flex-col items-center justify-center">
                  <div className="p-4 bg-gray-300 rounded border-b w-1/7">
                    <div className="text-2xl font-bold font-mono">11.95</div>
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    Binomial
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OptionsChainTable;
