import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { TextColorClass } from "../Methods/TextColorClass";
import { formatString } from "../Methods/FormatStrings";

interface headerProps {
  selectedStock: string;
  currentStockPrice: number;
  priceChangePercent: number;
}

export const Header: React.FC<headerProps> = ({
  selectedStock,
  currentStockPrice,
  priceChangePercent,
}) => {
  const handleNumber = (num: any) => {
    if (typeof num != "number") return num;

    return num.toFixed(2);
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Options Chain</h1>
          <div className="grid grid-cols-3 items-center gap-2 mt-2">
            {currentStockPrice != 0 ? (
              <>
                <span className="font-mono font-semibold">{selectedStock}</span>
                <span className="text-2x1 font-mono font-semibold">
                  {formatString(handleNumber(currentStockPrice), "$")}
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
                  {formatString(handleNumber(priceChangePercent), "", "%")}
                </Badge>
              </>
            ) : (
              <div className="p-3"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
