import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table } from "../ui/table";
import { formatString } from "../Methods/FormatStrings";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import type { Option } from "../Models/Option";
import { useState } from "react";
import { FilterOptions } from "../Methods/FilterOptions";
import getOptions from "../PolygonAI/ListOptions";

interface OptionsChainProps {
  selectedStock: string;
  selectedExpiration: string;
  currentStockPrice: number;
  optionRef: any | null;
  SetSelectedOption: React.Dispatch<React.SetStateAction<Option | undefined>>;
}

export const OptionsChain: React.FC<OptionsChainProps> = ({
  selectedStock,
  selectedExpiration,
  currentStockPrice,
  optionRef,
  SetSelectedOption,
}) => {
  // const [optionFV, setOptionFV] = useState<number[]>();
  const [optionsChainState, setOptionsChainState] = useState<String>("");
  const [chainSelect, SetChainSelect] = useState(false);
  const [optionsChain, SetOptionsChain] = useState<Option[]>();
  //select option
  const handleRowClick = (e: Option) => {
    SetSelectedOption(e);
  };
  let optionsList: string;

  useEffect(() => {
    getOptionsChain(selectedStock, currentStockPrice);
  }, [selectedStock, selectedExpiration]);

  const getOptionsChain = async (stockTicker: string, currentPrice: number) => {
    if (selectedStock === "") return;
    if (optionsChainState !== "") {
      optionRef.unsubscribe(optionsChainState);
      setOptionsChainState("");
    }

    let options = await getOptions(
      stockTicker,
      currentPrice,
      selectedExpiration
    );

    if (options === undefined) options = [];

    SetOptionsChain(options);

    options.forEach((option: Option) => {
      optionsList = optionsList
        ? optionsList + `, A.${option.details.ticker}`
        : `A.${option.details.ticker}`;
    });
    setOptionsChainState(optionsList);
    SetChainSelect(!chainSelect);
    HandleWS(optionsList);
  };

  useEffect(() => {
    optionRef.getOptionsData(SetOptionsChain, optionsChain);
  }, [optionsChain]);

  useEffect(() => {}, [optionsChain]);

  const HandleWS = (options: string) => {
    if (optionRef) {
      optionRef.send(
        JSON.stringify({
          action: "subscribe",
          params: options,
        })
      );
    }
  };
  //split options into two arrays calls and puts
  const { calls, puts } = FilterOptions(optionsChain || [], selectedExpiration);
  return (
    <>
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
                {calls.map((option: Option) => (
                  <TableRow
                    key={option.details.ticker}
                    onClick={() => handleRowClick(option)}
                    className={`border-b cursor-pointer hover:border-orange-300 hover:shadow-[0_0_0_3px_theme('colors.orange.300')] hover:bg-blue-200 hover:outline-offset-2
                    transition-colors ${
                      option?.details?.strike_price <= currentStockPrice
                        ? "bg-chart-1/5"
                        : ""
                    }`}
                  >
                    <TableCell className="p-2 font-mono font-semibold">
                      {formatString(
                        option?.details?.strike_price.toFixed(2),
                        "$"
                      )}
                    </TableCell>
                    <TableCell className="p-2 font-mono font-semibold">
                      {formatString(option?.day?.low?.toFixed(2), "$")}
                    </TableCell>

                    <TableCell className="p-2 font-mono font-semibold">
                      {formatString(option?.day?.volume?.toLocaleString())}
                    </TableCell>
                    <TableCell className="p-2 font-mono font-semibold">
                      {formatString(option?.open_interest?.toLocaleString())}
                    </TableCell>
                    <TableCell className="p-2 font-mono font-semibold">
                      {formatString(
                        (option?.implied_volatility * 100).toFixed(1),
                        "",
                        "%"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive text-center">Puts</CardTitle>
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
                  {puts.map((option: Option) => (
                    <TableRow
                      key={option.details.ticker}
                      onClick={() => handleRowClick(option)}
                      className={`border-b cursor-pointer hover:border-orange-300 hover:shadow-[0_0_0_3px_theme('colors.orange.300')] hover:bg-blue-200 hover:outline-offset-2
                    transition-colors ${
                      option.details.strike_price >= currentStockPrice
                        ? "bg-destructive/5"
                        : ""
                    }`}
                    >
                      <TableCell className="p-2 font-mono font-semibold">
                        {formatString(
                          option?.details?.strike_price.toFixed(2),
                          "$"
                        )}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {formatString(option?.day?.low.toFixed(2))}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {formatString(option?.day?.volume?.toLocaleString())}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {formatString(option?.open_interest?.toLocaleString())}
                      </TableCell>
                      <TableCell className="p-2 font-mono font-semibold">
                        {formatString(
                          (option?.implied_volatility * 100).toFixed(1),
                          "",
                          "%"
                        )}
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
