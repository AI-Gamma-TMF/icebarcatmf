import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const CustomLegend = ({ labels, labelsData, colors }) => {
  return (
    <div className="vip-dashboard-viz-legend">
      {labels.map((label, index) => (
        <div key={index} className="vip-dashboard-viz-legend__row">
          <div
            className="vip-dashboard-viz-legend__pill"
            style={{ backgroundColor: colors[index] }}
          >
            {label}%
          </div>
          <div className="vip-dashboard-viz-legend__label">{labelsData[index]}</div>
        </div>
      ))}
    </div>
  );
};

export function PieChart({ redemptionToPurchaseRatio }) {
  const data = {
    labels: ['YTD Total NGR', 'Average Monthly Total NGR', 'MTD Total NGR', 'Last 7 Days Total NGR'],
    datasets: [
      {
        // label: '# of Votes',
        data: [
          redemptionToPurchaseRatio?.YEAR_TO_DATE,
          redemptionToPurchaseRatio?.MONTHLY_AVERAGE,
          redemptionToPurchaseRatio?.MONTH_TO_DATE,
          redemptionToPurchaseRatio?.LAST_WEEK,
        ],
        backgroundColor: ['#FFECFB', '#FFD9D9', '#E0FFDE', '#E6E6FF'],

        borderWidth: 2,
      },
    ],
  };
  return (
    <div className="vip-dashboard-viz-panel">
      <h4>Redemption to Purchase Ratio</h4>
      <div className='pie-chart'>
        <div className="vip-dashboard-viz-chart" style={{ width: '300px', height: '300px' }}>
          <Pie data={data} options={options} />
        </div>

        <CustomLegend
          labels={data.datasets[0].data}
          labelsData={data.labels}
          colors={data.datasets[0].backgroundColor}
        />
      </div>
    </div>
  );
}
