import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { InlineLoader } from '../../../components/Preloader';

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

const getRandomColor = (index) => {
  const colors = [
    '#FFECFB', '#FFD9D9', '#E0FFDE', '#E6E6FF',
    '#FFF2CC', '#D9EAD3', '#F4CCCC', '#C9DAF8',
    '#EAD1DC', '#D0E0E3', '#FCE5CD', '#D9D2E9',
  ];
  return colors[index % colors.length];
};

const CustomLegend = ({ labels, labelsData, colors }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px 8px', marginLeft: '20px' }}>
      {labels.map((label, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '70px',
              // width: '100px',
              height: '30px',
              backgroundColor: colors[index],
              borderRadius: '20px',
              boxShadow: '0 4px 4px rgba(0,0,0,0.2)',
            }}
          >
            {label}%
          </div>
          <div style={{ fontWeight: 'bold', color: '#333', fontSize: '13px' }}>{labelsData[index]}</div>
        </div>
      ))}
    </div>
  );
};

export function PieChart({ providerInfo, providerInfoLoading }) {

  const pieChartData = (providerInfo?.finalOutput || []).reduce((acc, item) => {
    acc[item.masterCasinoProviderName] = item.percentageTotalGGR;
    return acc;
  }, {});

  const labels = Object.keys(pieChartData) || {};
  const values = Object.values(pieChartData) || {};
  const backgroundColor = labels.map((_, index) => getRandomColor(index));

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderWidth: 2,
      },
    ],
  };


  console.log("chart data ::", pieChartData, providerInfoLoading);


  return (
    <div>
      <div className='pie-chart'>
        <div style={{ width: '300px', height: '300px' }}>
          <Pie data={data} options={options} />
        </div>
        <CustomLegend
          labels={values}
          labelsData={labels}
          colors={backgroundColor}
        />
      </div>
    </div>
  );
}
