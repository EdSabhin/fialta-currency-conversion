import { useState, useEffect } from "react";
import { historyData } from "@service/historyData";
import { AreaChart } from "@tremor/react";
import { yearData } from "@service/yearData";
import DateInput from "./DateInput";
import ResetButton from "./ResetButton";

const dataFormatter = (number) => {
  return "$" + Intl.NumberFormat("us").format(number).toString();
};

const CurrencyChart = () => {
  const [history, setHistory] = useState("");
  const [dateData, setDateData] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    historyData().then(setHistory);
  }, []);

  useEffect(() => {
    dateFrom !== "" &&
      dateTo !== "" &&
      yearData(dateFrom, dateTo).then(setDateData);
  }, [dateFrom, dateTo]);

  let ratesHistory = "";

  if (dateData.rates) {
    ratesHistory = Object.entries(dateData.rates).map(([date, rates]) => ({
      date,
      USD: rates.USD,
      CAD: rates.CAD,
      AUD: rates.AUD,
      NZD: rates.NZD,
    }));
  } else if (history.rates) {
    ratesHistory = Object.entries(history.rates).map(([date, rates]) => ({
      date,
      USD: rates.USD,
      CAD: rates.CAD,
      AUD: rates.AUD,
      NZD: rates.NZD,
    }));
  }

  const resetDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="w-[70%] h-full flex">
      <div className="w-full h-full flex flex-col border border-slate-200 bg-white rounded-md">
        <h2 className="py-4 pl-5 text-2xl font-semibold bg-[#F2F7FF]">
          EUR Against Dollars Trends Since 2000.
        </h2>
        <AreaChart
          className="w-full py-8 px-4 bg-slate-50"
          data={ratesHistory}
          index="date"
          categories={["USD", "CAD", "AUD", "NZD"]}
          colors={["blue", "violet", "sky", "teal"]}
          valueFormatter={dataFormatter}
          curveType="natural"
          showYAxis={true}
          showGridLines={true}
          maxValue={2.75}
          allowDecimals={true}
        />
        <div className="w-full flex justify-center items-center gap-8 pt-8 pb-12">
          <div className="flex items-center relative">
            <h4 className="py-1 px-8 border-l border-blue-500 rounded-md text-md font-semibold">
              Time Period
            </h4>
            <p className="pb-1 text-3xl text-blue-700 animate-ping">→</p>
          </div>
          <DateInput
            title="From:"
            setDate={setDateFrom}
            value={dateFrom}
            currentDate={formattedDate}
            max={dateTo}
          />
          <DateInput
            title="To:"
            setDate={setDateTo}
            value={dateTo}
            min={dateFrom}
            max={formattedDate}
          />
        </div>
        <ResetButton resetDates={resetDates} />
      </div>
    </div>
  );
};

export default CurrencyChart;
