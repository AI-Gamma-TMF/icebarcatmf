import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatLabel, transformDataArray } from '../utils';
import ChartLabelDetail from './ChartLabelDetail';
import {
  customerDashboardColors,
  customerDashboardOptions,
  customerLabelsShortKey,
} from '../../constants';
import { Row,Col } from '@themesberg/react-bootstrap';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerDataChart = ({ customerData }) => {
  const updatedCustomerData = transformDataArray(customerData);

  const customerChartData = {
    labels: customerLabelsShortKey,
    datasets: Object.keys(updatedCustomerData)
      .filter((key) => key !== 'label') // Exclude 'label' from datasets
      .map((key, index) => ({
        label: formatLabel(key),
        data: updatedCustomerData[key],
        backgroundColor:
          customerDashboardColors[index % customerDashboardColors.length],
      })),
  };

  return (
    <div className='customer-chart-container '>
      {' '}
       <Row className="w-100">
      <Col lg={9} sm={12} className='customer-chart'>
        <Bar options={customerDashboardOptions} data={customerChartData} />
      </Col>
       <Col lg={3} sm={12}className='customer-labels'>
        <ChartLabelDetail />
      </Col> 
      </Row>
    </div>
  );
};
export default CustomerDataChart;
