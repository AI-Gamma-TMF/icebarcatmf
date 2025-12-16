import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const GameGGRChart = ({ labels = [], totalWin = [], totalBet = [], ggr }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (totalBet.length > 0 && totalWin.length > 0) {
      setLoading(false);
    }
  }, [totalBet, totalWin]);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Bet",
        data: totalBet,
        backgroundColor: "rgba(38, 43, 64, 0.5)", // Bar color
        borderColor: "rgba(38, 43, 64)", // Border color
        borderWidth: 1,
        type: "bar", // Bar chart for total bet
      },
      {
        label: "Total Win",
        data: totalWin,
        backgroundColor: "rgba(204, 204, 204, 0.5)", // Bar color
        borderColor: "rgba(204, 204, 204, 1)", // Border color
        borderWidth: 1,
        type: "bar", // Bar chart for total win
      },
      {
        label: "GGR (Total Bet - Total Win)",
        data: ggr,
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)", // Line color for GGR
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth line
        type: "line", // Line chart for GGR
        yAxisID: "y2", // Assign to secondary Y-axis
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tournament Game GGR",
        font: { weight: "bold" },
      },
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Game Name",
          font: { weight: "bold" },
        },
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: "Total Bet / Total Win",
          font: { weight: "bold" },
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
        beginAtZero: true,
      },
      y2: {
        title: {
          display: true,
          text: "GGR",
          font: { weight: "bold" },
        },
        position: "right", // Secondary Y-axis on the right side for GGR
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ minHeight: "250px" }}>
      <h2>Tournament Game GGR</h2>
      {loading ? (
        <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
          <Spinner animation="border" size="sm" role="status" />
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default GameGGRChart;