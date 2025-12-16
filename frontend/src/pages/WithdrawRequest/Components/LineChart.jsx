import React, { useState } from 'react'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale);

export default function LineChart({ graphTitle, graphData }) {  
  const [chartData, _setChartData] = useState({
    labels: graphData?.graphData.map((data) => data.date),
    datasets: [
      {
        label: "Approved ",
        backgroundColor: "#2DCE89",
        borderColor: "#2DCE89",
        borderWidth: 2,
        fontColor: "white",
        data: graphData?.graphData.map((data) => data?.approvedCount)
      },
      {
        label: "Pending ",
        backgroundColor: "#11CDEF",
        borderColor: "#11CDEF",
        borderWidth: 2,
        fontColor: "#11CDEF",
        data: graphData?.graphData.map((data) => data?.pendingCount)
      },
      {
        label: "Failed ",
        backgroundColor: "#FFB822",
        borderColor: "#FFB822",
        borderWidth: 2,
        fontColor: "white",
        data: graphData?.graphData.map((data) => data?.failedCount)
      },
      {
        label: "Declined ",
        backgroundColor: "#F4516C",
        borderColor: "#F4516C",
        borderWidth: 2,
        fontColor: "#11CDEF",
        data: graphData?.graphData.map((data) => data?.rejectCount),

      },
      {
        label: "Canceled ",
        backgroundColor: "#716ACA",
        borderColor: "#716ACA",
        borderWidth: 2,
        fontColor: "white",
        data: graphData?.graphData.map((data) => data?.cancelCount)
      }
    ]
  });


  // const optionsChart = {
  //   legend: {
  //     display: true,
  //     position: "top",
  //     labels: {
  //       fontColor: "#8898AA"
  //     }
  //   },
  //   scales: {
  //     yAxes: [
  //       {
  //         gridLines: {
  //           color: "#DEE2E6",
  //           zeroLineColor: "#DEE2E6"
  //         },
  //         ticks: {
  //           fontColor: "black",
  //           callback: function (value) {
  //             if (!(value % 2)) {
  //               //return '$' + value + 'k'
  //               return value;
  //             }
  //           }
  //         },
  //         stacked: true
  //       }
  //     ],
  //     xAxes: [
  //       {
  //         ticks: {
  //           fontColor: "black"
  //         },
  //         stacked: true
  //       }
  //     ]
  //   },
  //   // tooltips: { // Khi rê chuột hiển thị từng data
  //   //   callbacks: {
  //   //     label: function(item, data) {
  //   //       var label = data?.datasets[item.datasetIndex].label || "";
  //   //       var yLabel = item.yLabel;
  //   //       var content = "";
  //   //       if (data.datasets.length > 1) {
  //   //         content += label;
  //   //       }
  //   //       content += yLabel;
  //   //       return content;
  //   //     }
  //   //   }
  //   // }

  //   tooltips: {
  //     enabled: true,
  //     mode: "index",
  //     intersect: true
  //   }
  // };



  return (
    <div className="App">
      <div className="chart-container">
        <h5 style={{ textAlign: "center" }}>{graphTitle}</h5>
        <Line data={chartData} />
      </div>
    </div>
  );

}