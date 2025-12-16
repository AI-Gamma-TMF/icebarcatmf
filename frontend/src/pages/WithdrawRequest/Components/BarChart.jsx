import React, { useState } from 'react'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale);

export default function BarChart({ graphTitle, graphData }) {
  const [chartData, _setChartData] = useState({
    labels: graphData?.graphData.map((data) => data.date),
    datasets: [
      {
        label: "Approved Amount",
        backgroundColor: "#2DCE89",
        borderColor: "#2DCE89",
        borderWidth: 2,
        fontColor: "white",
        data: graphData?.graphData.map((data) => data.approvedAmount)
      },
      {
        label: "Pending Amount",
        backgroundColor: "#11CDEF",
        borderColor: "#11CDEF",
        borderWidth: 2,
        fontColor: "#11CDEF",
        data: graphData?.graphData.map((data) => data.pendingAmount)
      },      
    ]
  });

  return (
    <div className="App">
      <div className="chart-container">
        <h5 style={{ textAlign: "center" }}>{graphTitle}</h5>
        <Bar data={chartData} />
      </div>
    </div>
  );

}