import Navbar from "./components/Navbar/Navbar";

import { TextColorClass } from "./components/Methods/TextColorClass";
import WatchList from "./components/WatchList/WatchList";
import OptionsChainTable from "./components/OptionsChain/OptionsChainTable";
const App = () => {
  return (
    <>
      <div className="flex gap-5">
        {/* <WatchList /> */}
        <OptionsChainTable />
      </div>
      {/* <div className="bg-white rounded p-4 font-bold shadow-xl">
          Data goes here: {`$` + stockData.toFixed(2)}
          <div className={TextColorClass(lastPrice?.currentPriceDiff)}>
            {stockData == null || stockData == lastPrice.currentPriceDiff
              ? "0.00"
              : lastPrice?.currentPriceDiff.toFixed(2)}
          </div>
        </div>
        <button
          className="text-white bg-black font-bold text-xl p-3 rounded shadow-xl hover:text-blue-300"
          onClick={handleClick}
        >
          Click me to start streaming data
        </button> */}
    </>
  );
};

export default App;
