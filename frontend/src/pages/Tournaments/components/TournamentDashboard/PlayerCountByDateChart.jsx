import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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

const PlayerCountByDateChart = ({ labels = [], countData }) => {
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (countData.length >= 0 ) {
        setLoading(false);
      }
    }, [countData]);

  const data = {
    labels: labels, // X-axis labels (dates)
    datasets: [
      {
        label: "Count", // Label for the line
        data: countData, // Y-axis data points (counts)
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
        text: "Player Count by Join Date", // Chart title
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
      <h2>Player Count By Join Date</h2>
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

export default PlayerCountByDateChart;
