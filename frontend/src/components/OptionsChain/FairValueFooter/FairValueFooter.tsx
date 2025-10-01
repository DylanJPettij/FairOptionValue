import type { Option } from "../../Models/Option";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useEffect, useState } from "react";
import { formatString } from "../../Methods/FormatStrings";
import { GetBSAndBinomial } from "../../Methods/Calculations";

interface FairValueFooterProps {
  selectedOption: Option | undefined;
  currentStockPrice: number;
}
interface Results {
  marketPrice: number;
  blackScholes: number;
  binomial: number;
}

const getValuationBadge = (theoretical: number, market: number) => {
  const difference = ((theoretical - market) / market) * 100;
  if (Math.abs(difference) < 5) {
    return (
      <Badge variant="secondary" className="bg-muted text-muted-foreground">
        Fair Value
      </Badge>
    );
  } else if (difference < 5) {
    return (
      <Badge variant="destructive" className="bg-red-500">
        Overvalued
      </Badge>
    );
  } else {
    return (
      <Badge variant="default" className="bg-green-500 text-primary">
        Undervalued
      </Badge>
    );
  }
};

export const FairValueFooter: React.FC<FairValueFooterProps> = ({
  selectedOption,
  currentStockPrice,
}) => {
  const [results, SetRes] = useState<Results>({
    marketPrice: 0,
    blackScholes: 0,
    binomial: 0,
  });

  useEffect(() => {
    if (selectedOption == undefined) return;
    const fetchRes = async () => {
      let res = await GetBSAndBinomial(
        selectedOption as Option,
        currentStockPrice
      );

      SetRes({
        marketPrice: selectedOption?.day.low as number,
        blackScholes: res.blackScholes as number,
        binomial: res.binomial as number,
      });
    };
    fetchRes();
  }, [selectedOption]);

  useEffect(() => {}, [results]);

  return (
    <>
      <Card>
        <CardHeader className="font-semibold p-2 justify-center">
          Fair Value Estimate
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Market Price */}
            <div className="text-center p-6 bg-secondary/50 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-secondary-foreground mb-2">
                Current Market Price
              </h3>
              {results.marketPrice == 0 ? (
                ""
              ) : (
                <div className="text-3xl font-bold text-secondary-foreground mb-2">
                  {formatString(results.marketPrice.toFixed(2), "$")}
                </div>
              )}
              {selectedOption?.day.low !== undefined ? (
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground"
                >
                  Live Price
                </Badge>
              ) : (
                <></>
              )}
            </div>

            {/* Black-Scholes */}
            <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Black-Scholes Model
              </h3>
              <div className="text-3xl font-bold text-primary mb-2">
                {selectedOption?.day.low == undefined
                  ? ""
                  : formatString(results.blackScholes.toFixed(2), "$")}
              </div>
              <div className="space-y-1">
                {selectedOption?.day.low !== undefined
                  ? getValuationBadge(results.blackScholes, results.marketPrice)
                  : ""}
                {selectedOption?.day.low !== undefined ? (
                  <div className="text-sm text-muted-foreground">
                    Diff:{" "}
                    {formatString(
                      (
                        ((results.blackScholes - results.marketPrice) /
                          results.marketPrice) *
                        100
                      ).toFixed(1),
                      "",
                      "%"
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* Binomial */}
            <div className="text-center p-6 bg-accent/10 rounded-lg border border-accent/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Binomial Model
              </h3>
              <div className="text-3xl font-bold text-accent mb-2">
                {selectedOption?.day.low !== undefined
                  ? formatString(results.binomial.toFixed(2), "$")
                  : ""}
              </div>
              {selectedOption?.day.low !== undefined ? (
                <div className="space-y-1">
                  {selectedOption?.day.low !== undefined
                    ? getValuationBadge(results.binomial, results.marketPrice)
                    : ""}
                  <div className="text-sm text-muted-foreground">
                    Diff:{" "}
                    {(
                      ((results.binomial - results.marketPrice) /
                        results.marketPrice) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2">
              Analysis Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  Average Theoretical Price:
                </span>
                <span className="ml-2 font-mono text-foreground">
                  {selectedOption?.day.low !== undefined
                    ? formatString(
                        ((results.blackScholes + results.binomial) / 2).toFixed(
                          2
                        ),
                        "$"
                      )
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
