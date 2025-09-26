import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import OptionsChainTable from "../OptionsChain/OptionsChainTable.1";
import { Button } from "../ui/button";
import { useState } from "react";
const WatchList = () => {
  const [highlightedRowId, setHighlightedRowId] = useState<String | null>(null);

  const handleRowClick = (id: String) => {
    setHighlightedRowId(id);

    // Remove the highlight after 1500ms (1.5 seconds)
    setTimeout(() => {
      setHighlightedRowId(null);
    }, 1500);
  };

  interface Ticker {
    Stock: string;
    bid: number;
    ask: number;
    volume: number;
  }

  const stockTickers: Ticker[] = [
    {
      Stock: "AAPL",
      bid: 175.5,
      ask: 175.6,
      volume: 1254321,
    },
    {
      Stock: "MSFT",
      bid: 320.75,
      ask: 320.85,
      volume: 998765,
    },
    {
      Stock: "GOOGL",
      bid: 140.2,
      ask: 140.35,
      volume: 876543,
    },
    {
      Stock: "AMZN",
      bid: 135.9,
      ask: 136.0,
      volume: 1500000,
    },
    {
      Stock: "TSLA",
      bid: 215.15,
      ask: 215.25,
      volume: 876543,
    },
  ];

  return (
    <>
      <div className="w-1/5">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-center">Watch List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="border-b bg-muted/30 w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left p-2 font-bold">
                      Stock
                    </TableHead>
                    <TableHead className="text-left p-2 font-bold">
                      bid
                    </TableHead>
                    <TableHead className="text-left p-2 font-bold">
                      mid
                    </TableHead>
                    <TableHead className="text-left p-2 font-bold">
                      ask
                    </TableHead>
                    <TableHead className="">
                      <button className="font-bold text-green-500 text-xl hover:text-yellow-500">
                        +
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockTickers.map((stock) => (
                    <TableRow
                      key={stock.Stock}
                      onClick={() => handleRowClick(stock.Stock)}
                      className={`border-b cursor-pointer transition-colors duration-200 ${
                        highlightedRowId === stock.Stock
                          ? "bg-yellow-200"
                          : "hover:bg-blue-200"
                      }`}
                    >
                      <TableCell className="p-2 font-mono font-semibold">
                        {stock.Stock}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {stock.bid}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {((stock.bid + stock.ask) / 2).toFixed(2)}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {stock.ask}
                      </TableCell>
                      <TableCell className="justify-center">
                        <button className="text-black bg-transparent hover:text-red-500 font-bold text-l">
                          X
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WatchList;
