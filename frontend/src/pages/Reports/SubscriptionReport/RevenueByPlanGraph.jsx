import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueByPlanGraph = ({ labels = [], monthlyData = [], yearlyData = [], subscriptionIds = [], loading }) => {

  const data = {
    labels,
    datasets: [
      { label: "Monthly", data: monthlyData, backgroundColor: "black" },
      { label: "Yearly", data: yearlyData, backgroundColor: "gray" }
    ]
  };

  const options = {
    responsive: true,
    maintainAscpectRatio: false,
    animation: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const subId = subscriptionIds[context.dataIndex] ?? "N/A";
            return `${context.dataset.label} Revenue: ${context.parsed.y} (Sub ID: ${subId})`;
          }
        }
      },
      title: { display: true, text: "Revenue by Plan Type", font: { weight: "bold" } }
    },
    scales: {
      x: { title: { display: true, text: "Subscription Name", font: { weight: "bold" } } },
      y: { title: { display: true, text: "Revenue", font: { weight: "bold" } }, beginAtZero: true }
    }
  };

  return <>
    <div style={{ minHeight: "250px" }}>
      <h2>Revenue by Plan Type</h2>
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
        <>
          <Bar data={data} options={options} />
        </>
      )}
    </div>
  </>
};


export default RevenueByPlanGraph;
