import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopTenPlayerChart = ({ labels = [], winData = [], betData = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (winData.length >= 0 && betData.length >= 0) {
      setLoading(false);
    }
  }, [winData, betData]);

  const data = {
    labels: labels, // X-axis labels
    datasets: [
      {
        label: "Bet", // Label for the first bar
        data: betData, // Y-axis data points
        backgroundColor: "rgba(38, 43, 64)", // Bar color
        borderColor: "rgba(38, 43, 64)", // Border color
        borderWidth: 1, // Border width
      },
      {
        label: "Win", // Label for the second bar
        data: winData, // Y-axis data points
        backgroundColor: "rgba(204, 204, 204, 1)", // Bar color
        borderColor: "rgba(204, 204, 204, 1)", // Border color
        borderWidth: 1, // Border width
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
        text: "Top Ten Players", // Chart title
        font: {
          weight: 'bold', // Make the title bold
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Username", // Label for X-axis
          font: {
            weight: 'bold', // Make the X-axis label bold
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Values", // Label for Y-axis
          font: {
            weight: 'bold', // Make the X-axis label bold
          },
        },
      },
    },
  };

  // Directly check for empty data in the return block
  return (
    <div style={{ minHeight: "250px" }}>
      <h2>Top Ten Players</h2>
      {loading ? (
        <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
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

export default TopTenPlayerChart;
