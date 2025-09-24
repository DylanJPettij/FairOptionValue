import OptionsChainTable from "./components/OptionsChain/OptionsChainTable";
import { useEffect } from "react";
import { OptionDataWS } from "./components/PolygonAI/OptionDataWS";
import { useRef } from "react";
import { GetStockData } from "./components/PolygonAI/StockDataWS";

const App = () => {
  const wsOptions = OptionDataWS();
  const optionRef = useRef(wsOptions);

  const wsStocks = GetStockData();
  const stockRef = useRef(wsStocks);

  useEffect(() => {
    return () => {
      wsOptions.close();
      wsStocks.close();
    };
  }, []);

  return (
    <>
      <div className="flex gap-5">
        {/* <WatchList /> */}
        <OptionsChainTable
          optionRef={optionRef.current}
          stockRef={stockRef.current}
        />
      </div>
    </>
  );
};

export default App;
