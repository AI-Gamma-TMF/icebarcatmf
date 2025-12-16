import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        generateLabels: (chart) => {
          const dataset = chart.data.datasets[0];
          return chart.data.labels.map((label, index) => ({
            text: label,
            fillStyle: dataset.backgroundColor[index],
            strokeStyle: dataset.backgroundColor[index],
            lineWidth: 2,
            hidden: false,
            datasetIndex: null,
          }));
        },
      },
      onClick: () => {},
    },
    title: {
      display: true,
      text: 'Reinvestment Percentage (Amount of SC promo awarded)',
    },
    events: [],
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
};

export function VerticalBarChart({ reinvestmentPercentage }) {
  const data = {
    labels: ['YTD Reinvestment', 'Average Monthly Reinvestment', 'MTD Reinvestment', 'Last 7 Days Reinvestment'],
    datasets: [
      {
        label: undefined,
        data: [
          reinvestmentPercentage?.YEAR_TO_DATE,
          reinvestmentPercentage?.MONTHLY_AVERAGE,
          reinvestmentPercentage?.MONTH_TO_DATE,
          reinvestmentPercentage?.LAST_WEEK,
        ],
        backgroundColor: ['#FFECFB', '#FFD9D9', '#E6E6FF', '#E0FFDE'],
      },
    ],
  };
  return (
    <div
      style={{
        marginTop: '1rem',
        boxShadow: '0px 4px 4px 0px #00000040',
        borderRadius: '10px',
        padding: '2.7rem',
        width: '100%',
        margin: 'auto',
      }}
    >
      <div style={{ width: '100%', height: '340px' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
