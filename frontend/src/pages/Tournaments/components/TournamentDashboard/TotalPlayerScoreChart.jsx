import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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

const TotaPlayerScoreChart = ({ labels, scoreData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scoreData.length >= 0) {
      setLoading(false);
    }
  }, [scoreData]);


  const data = {
    labels: labels, // X-axis labels
    datasets: [
      {
        label: "Score", // Label for the line
        data: scoreData, // Y-axis data points
        backgroundColor: "rgba(38, 43, 64)", // Line color
        borderColor: "rgba(38, 43, 64)", // Border color
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
        text: "Total Score", // Chart title
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
          text: "Score", // Label for Y-axis
          font: {
            weight: 'bold', // Make the Y-axis label bold
          },
        },
      },
    },
  };

  return (
    <div style={{ minHeight: "250px" }}>
      <h2>Total Score of Players</h2>
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
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default TotaPlayerScoreChart;
