import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { SearchIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useRef } from "react";
import { getCurrentPrice, getStocksOpen } from "../PolygonAI/TickerSummary";
import { checkStockValid } from "../Methods/Calculations";

export const SearchBar: React.FC<any> = ({
  setSearchTerm,
  setSelectedStock,
  searchTerm,
  setOpeningPrice,
  selectedExpiration,
  setSelectedExpiration,
  stockRef,
  SetCurrentStockPrice,
  selectedStock,
}) => {
  const textInputRef = useRef<HTMLInputElement>(null);
  const EXPIRATION_DATES = [
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
  const handleInputChange = (event: any) => {
    if (event.key === "Enter" && textInputRef.current) {
      setSearchTerm(textInputRef.current.value.toUpperCase());

      textInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchTerm.trim() === "") {
      return;
    }

    if (!(await checkStockValid(searchTerm.toUpperCase()))) return;

    handleClick(searchTerm.toUpperCase());

    //get the form data from the envent
    const formData = new FormData(e.currentTarget);
    if (formData != null) {
      setSelectedStock(
        formData.get("search")?.toString().toUpperCase() as string
      );
    }
  };

  const handleClick = async (stockTicker: string) => {
    if (stockTicker === "") {
      return;
    }

    try {
      let currentPrice = await getCurrentPrice(stockTicker);

      if (currentPrice === undefined) return;

      SetCurrentStockPrice(currentPrice as number);

      stockRef.unsubscribe(selectedStock);

      setSelectedStock(stockTicker);

      let data = await getStocksOpen(stockTicker);

      if (data === undefined) data = currentPrice;

      setOpeningPrice(data as number);

      //subscribe to the stock ticker for real-time updates
      stockRef.getStockPrice(SetCurrentStockPrice, stockTicker);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (
    <>
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
                  ref={textInputRef}
                  onKeyDown={handleInputChange}
                  disabled={selectedExpiration === ""}
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
                {EXPIRATION_DATES.map((date) => (
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
    </>
  );
};
