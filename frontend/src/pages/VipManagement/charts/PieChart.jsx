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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginLeft: '20px' }}>
      {labels.map((label, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '126px',
              height: '58px',
              backgroundColor: colors[index],
              borderRadius: '20px',
              boxShadow: '0 4px 4px rgba(0,0,0,0.2)',
            }}
          >
            {label}%
          </div>
          <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>{labelsData[index]}</div>
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
    <div
      style={{
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0px 4px 4px 0px #00000040',
        marginTop: '1rem',
      }}
    >
      <h4>Redemption to Purchase Ratio</h4>
      <div className='pie-chart'>
        <div style={{ width: '300px', height: '300px' }}>
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
