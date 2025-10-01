import { Hero } from "./components/OptionsChain/Hero";
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
      <Hero optionRef={optionRef.current} stockRef={stockRef.current} />
    </>
  );
};

export default App;
