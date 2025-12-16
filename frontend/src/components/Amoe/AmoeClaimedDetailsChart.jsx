import React from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AmoeClaimedDetailsChart = ({ labels = [], claimedData, isLoadingAmoeData }) => {
  const data = {
    labels: labels, // X-axis labels (dates)
    datasets: [
      {
        label: "Registered Detail Count", // Label for the line
        data: claimedData, // Y-axis data points (counts)
        borderColor: "black", // Line color
        borderWidth: 2, // Line width
        fill: false, // Do not fill under the line
        tension: 0, // Straight line
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Registered Detail Date", // Chart title
        font: {
          weight: 'bold', // Make the X-axis label bold
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date", // Label for X-axis
          font: {
            weight: 'bold', // Make the X-axis label bold
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Count", // Label for Y-axis
          font: {
            weight: 'bold', // Make the X-axis label bold
          },
        },
      },
    },
  };

  return (
    <div style={{ minHeight: "250px" }}>
      <h3>Registered Details Chart</h3>
      {isLoadingAmoeData ? (
        <div className="loader" style={{ textAlign: "center", padding: "50px", height: "470px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </span>
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default AmoeClaimedDetailsChart;
