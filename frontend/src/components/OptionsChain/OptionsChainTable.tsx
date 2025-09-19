import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { HeaderSettings, TextColorClass } from "../Methods/TextColorClass";
import { Badge } from "../ui/badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  SearchIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { SelectItem } from "../ui/select";
import { GetStockData } from "../../components/PolygonAI/StockDataWS";
import { useEffect, useState } from "react";
import { type OptionsContractsResponse } from "../../components/Models/ContractDefinition";
import type { StockPricingInfo } from "../../components/Models/StockPricingInfo";
import { getStocksOpen } from "../PolygonAI/TickerSummary";
import getOptions from "../PolygonAI/ListOptions";
interface OptionContract {
  strike: number;
  expiration: string;
  type: "call" | "put";
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

const mockOptionsData: OptionContract[] = [
  // Calls
  {
    strike: 150,
    expiration: "2024-01-19",
    type: "call",
    bid: 12.5,
    ask: 12.8,
    volume: 1250,
    openInterest: 3420,
    impliedVolatility: 0.28,
    delta: 0.75,
    gamma: 0.012,
    theta: -0.08,
    vega: 0.15,
  },
  {
    strike: 155,
    expiration: "2024-01-19",
    type: "call",
    bid: 8.2,
    ask: 8.5,
    volume: 890,
    openInterest: 2150,
    impliedVolatility: 0.31,
    delta: 0.62,
    gamma: 0.015,
    theta: -0.09,
    vega: 0.18,
  },
  {
    strike: 160,
    expiration: "2024-01-19",
    type: "call",
    bid: 4.8,
    ask: 5.1,
    volume: 2340,
    openInterest: 4680,
    impliedVolatility: 0.35,
    delta: 0.45,
    gamma: 0.018,
    theta: -0.11,
    vega: 0.22,
  },
  {
    strike: 165,
    expiration: "2024-01-19",
    type: "call",
    bid: 2.3,
    ask: 2.6,
    volume: 1680,
    openInterest: 3210,
    impliedVolatility: 0.38,
    delta: 0.28,
    gamma: 0.016,
    theta: -0.12,
    vega: 0.25,
  },
  {
    strike: 170,
    expiration: "2024-01-19",
    type: "call",
    bid: 0.95,
    ask: 1.25,
    volume: 950,
    openInterest: 1890,
    impliedVolatility: 0.42,
    delta: 0.15,
    gamma: 0.012,
    theta: -0.1,
    vega: 0.2,
  },
  {
    strike: 172.5,
    expiration: "2024-01-19",
    type: "call",
    bid: 0.95,
    ask: 1.25,
    volume: 950,
    openInterest: 1890,
    impliedVolatility: 0.42,
    delta: 0.15,
    gamma: 0.012,
    theta: -0.1,
    vega: 0.2,
  },
  {
    strike: 175,
    expiration: "2024-01-19",
    type: "call",
    bid: 0.95,
    ask: 1.25,
    volume: 950,
    openInterest: 1890,
    impliedVolatility: 0.42,
    delta: 0.15,
    gamma: 0.012,
    theta: -0.1,
    vega: 0.2,
  },
  {
    strike: 185,
    expiration: "2024-01-19",
    type: "call",
    bid: 0.95,
    ask: 1.25,
    volume: 950,
    openInterest: 1890,
    impliedVolatility: 0.42,
    delta: 0.15,
    gamma: 0.012,
    theta: -0.1,
    vega: 0.2,
  },

  // Puts
  {
    strike: 150,
    expiration: "2024-01-19",
    type: "put",
    bid: 2.1,
    ask: 2.4,
    volume: 780,
    openInterest: 2340,
    impliedVolatility: 0.29,
    delta: -0.25,
    gamma: 0.012,
    theta: -0.07,
    vega: 0.16,
  },
  {
    strike: 155,
    expiration: "2024-01-19",
    type: "put",
    bid: 4.5,
    ask: 4.8,
    volume: 1120,
    openInterest: 3560,
    impliedVolatility: 0.32,
    delta: -0.38,
    gamma: 0.015,
    theta: -0.08,
    vega: 0.19,
  },
  {
    strike: 160,
    expiration: "2024-01-19",
    type: "put",
    bid: 7.8,
    ask: 8.1,
    volume: 1890,
    openInterest: 4120,
    impliedVolatility: 0.36,
    delta: -0.55,
    gamma: 0.018,
    theta: -0.1,
    vega: 0.23,
  },
  {
    strike: 165,
    expiration: "2024-01-19",
    type: "put",
    bid: 12.2,
    ask: 12.5,
    volume: 1450,
    openInterest: 2890,
    impliedVolatility: 0.39,
    delta: -0.72,
    gamma: 0.016,
    theta: -0.11,
    vega: 0.26,
  },
  {
    strike: 170,
    expiration: "2024-01-19",
    type: "put",
    bid: 17.5,
    ask: 17.8,
    volume: 680,
    openInterest: 1560,
    impliedVolatility: 0.43,
    delta: -0.85,
    gamma: 0.012,
    theta: -0.09,
    vega: 0.21,
  },
  {
    strike: 172.5,
    expiration: "2024-01-19",
    type: "put",
    bid: 17.5,
    ask: 17.8,
    volume: 680,
    openInterest: 1560,
    impliedVolatility: 0.43,
    delta: -0.85,
    gamma: 0.012,
    theta: -0.09,
    vega: 0.21,
  },
  {
    strike: 180,
    expiration: "2024-01-19",
    type: "put",
    bid: 17.5,
    ask: 17.8,
    volume: 680,
    openInterest: 1560,
    impliedVolatility: 0.43,
    delta: -0.85,
    gamma: 0.012,
    theta: -0.09,
    vega: 0.21,
  },
  {
    strike: 185,
    expiration: "2024-01-19",
    type: "put",
    bid: 17.5,
    ask: 17.8,
    volume: 680,
    openInterest: 1560,
    impliedVolatility: 0.43,
    delta: -0.85,
    gamma: 0.012,
    theta: -0.09,
    vega: 0.21,
  },
];

const OptionsChainTable = () => {
  const [selectedExpiration, setSelectedExpiration] = useState("2024-01-19");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  //const [showWeeklies, SetShowWeeklies] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<keyof OptionContract>("strike");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedOption, setSelectedOption] = useState<OptionContract>();

  //
  const [data, SetData] = useState<OptionsContractsResponse>();
  const [stockData, SetStockData] = useState<number>(0);
  const [openingPrice, setOpeningPrice] = useState<number>(0);
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

  //
  const handleClick = async (stockTicker: string) => {
    await GetStockData(SetStockData, stockTicker);
    await getStocksOpen(stockTicker).then((data) => {
      setOpeningPrice(data as number);
    });
    console.log(await getOptions("NVDA", 176, "2025-10-17"));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClick(searchTerm.toUpperCase());
    //get the form data from the envent
    const formData = new FormData(e.currentTarget);
    if (formData != null) {
      setSelectedStock(
        formData.get("search")?.toString().toUpperCase() as string
      );
      //console.log(formData.get("search"));
      setSearchTerm("");
    }
  };

  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleRowClick = (e: OptionContract) => {
    console.log(e);
    setSelectedOption(e);
  };

  const currentPrice = stockData;
  const priceChangePercent = lastPrice.currentPriceDiff;

  const filteredData = mockOptionsData
    .filter((option) => option.expiration === selectedExpiration)
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

  const calls = filteredData.filter((option) => option.type === "call");
  const puts = filteredData.filter((option) => option.type === "put");

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
                ${currentPrice.toFixed(2)}
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
                <SelectContent>
                  <SelectItem value="2024-01-19">Jan 19, 2024</SelectItem>
                  <SelectItem value="2024-02-16">Feb 16, 2024</SelectItem>
                  <SelectItem value="2024-03-15">Mar 15, 2024</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Srikes" defaultValue={10} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
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
                    <TableHead className="text-left p-2">Bid</TableHead>
                    <TableHead className="text-left p-2">Ask</TableHead>
                    <TableHead className="text-left p-2">Volume</TableHead>
                    <TableHead className="text-left p-2">OI</TableHead>
                    <TableHead className="text-left p-2">IV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((option, index) => (
                    <TableRow
                      key={`call-${option.strike}`}
                      onClick={() => handleRowClick(option)}
                      className={`border-b cursor-pointer hover:border-orange-300 hover:shadow-[0_0_0_3px_theme('colors.orange.300')] hover:bg-blue-200 hover:outline-offset-2
                    transition-colors ${
                      option.strike <= currentPrice ? "bg-chart-1/5" : ""
                    }`}
                    >
                      <TableCell className="p-2 font-mono font-semibold">
                        ${option.strike}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        ${option.bid.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        ${option.ask.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {option.volume.toLocaleString()}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {option.openInterest.toLocaleString()}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {(option.impliedVolatility * 100).toFixed(1) + "%"}
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
                      <TableHead className="text-left p-2">Bid</TableHead>
                      <TableHead className="text-left p-2">Ask</TableHead>
                      <TableHead className="text-left p-2">Volume</TableHead>
                      <TableHead className="text-left p-2">OI</TableHead>
                      <TableHead className="text-left p-2">IV</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {puts.map((option, index) => (
                      <TableRow
                        key={`put-${option.strike}`}
                        onClick={() => handleRowClick(option)}
                        className={`border-b cursor-pointer hover:border-orange-300 hover:shadow-[0_0_0_3px_theme('colors.orange.300')] hover:bg-blue-200 hover:outline-offset-2
                    transition-colors ${
                      option.strike >= currentPrice ? "bg-destructive/5" : ""
                    }`}
                      >
                        <TableCell className="p-2 font-mono font-semibold">
                          ${option.strike}
                        </TableCell>
                        <TableCell className="p-2 font-mono">
                          ${option.bid.toFixed(2)}
                        </TableCell>
                        <TableCell className="p-2 font-mono">
                          ${option.ask.toFixed(2)}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-sm">
                          {option.volume.toLocaleString()}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-sm">
                          {option.openInterest.toLocaleString()}
                        </TableCell>
                        <TableCell className="p-2 font-mono text-sm">
                          {(option.impliedVolatility * 100).toFixed(1) + "%"}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded flex flex-col items-center justify-center">
                <div className="p-4 bg-gray-300 rounded border-b w-1/4">
                  <div className="text-2xl font-bold font-mono">11.95</div>
                </div>
                <div className="text-sm text-muted-foreground font-semibold">
                  Black-Scholes
                </div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded lg">
                <div className="text-center p-4 bg-muted/30 rounded flex flex-col items-center justify-center">
                  <div className="p-4 bg-gray-300 rounded border-b w-1/4">
                    <div className="text-2xl font-bold font-mono">11.95</div>
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    Binomial
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded lg">
                <div className="text-center p-4 bg-muted/30 rounded flex flex-col items-center justify-center">
                  <div className="p-4 bg-gray-300 rounded border-b w-1/4">
                    <div className="text-2xl font-bold font-mono">11.95</div>
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    Monte-Carlo
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
