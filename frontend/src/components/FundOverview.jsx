import React, { useState } from "react";
import axios from "axios";
import EDASection from "./EDASection";
import NavTrend from "./NavTrend";
import DatasetTable from "./DatasetTable";
import PieCharts from "./PieCharts";

const FundOverview = () => {
  const [selectedFund, setSelectedFund] = useState("");
  const [edaData, setEdaData] = useState(null);
  const [chartData, setChartData] = useState([]);

  const loadNAVData = async () => {
    if (!selectedFund) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/fund/by-fund?fund=${selectedFund}`
      );

      console.log("API Response:", response.data);

      setEdaData(response.data);

      const formatted = response.data.dates.map((date, index) => ({
        date: date,
        nav: response.data.navValues[index],
      }));

      setChartData(formatted);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <select
        value={selectedFund}
        onChange={(e) => setSelectedFund(e.target.value)}
      >
        <option value="">Select Fund</option>
        <option value="hdfc_1y">HDFC 1Y</option>
        <option value="sbi_1y">SBI 1Y</option>
        <option value="axis_1y">AXIS 1Y</option>
      </select>

      <button onClick={loadNAVData}>Load NAV Data</button>

      <EDASection eda={edaData} />
      <NavTrend data={chartData} />
      <DatasetTable data={chartData} />
      <PieCharts eda={edaData} />
    </div>
  );
};

export default FundOverview;
