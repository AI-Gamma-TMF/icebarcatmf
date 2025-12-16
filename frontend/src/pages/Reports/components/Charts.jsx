import React, { useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';

// Utility to generate date strings (1 day apart)
const generateTimeData = (baseDate, values) => {
  return values.map((val, i) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    return {
      time: date.getTime(), // timestamp in ms
      value: val,
    };
  });
};

const values1 = [4.11, 2.39, 1.37, 1.16, 2.29, 3, 0.53, 2.52, 1.79, 2.94, 4.3, 4.41];
const values2 = [
  6.11, 1.39, 13.37, 6.16, 1.29, 7, 5.53, 9.52, 4.79, 3.94, 8.3, 1.41, 7.1, 6, 1, 4,
  7, 5, 7, 5, 4.11, 2.39, 1.37, 1.16, 2.29, 3, 0.53, 2.52, 1.79, 2.94,
];

const data1 = generateTimeData('2025-05-01', values1);
const data2 = generateTimeData('2025-05-01', values2);

const ZoomableLineChart = () => {
  const [selectedDataset, setSelectedDataset] = useState('data1');
  const [interval, setInterval] = useState(1);
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomDomain, setZoomDomain] = useState({ left: null, right: null });

  const data = selectedDataset === 'data1' ? data1 : data2;

  const xMin = Math.min(...data.map(d => d.time));
  const xMax = Math.max(...data.map(d => d.time));
  const yMin = Math.floor(Math.min(...data.map(d => d.value)));
  const yMax = Math.ceil(Math.max(...data.map(d => d.value)));

  const generateTimeTicks = (min, max, daysInterval) => {
    const ticks = [];
    for (let t = min; t <= max; t += daysInterval * 24 * 60 * 60 * 1000) {
      ticks.push(t);
    }
    return ticks;
  };

  const ticks = generateTimeTicks(xMin, xMax, interval);

  const domainX = [
    zoomDomain.left !== null ? zoomDomain.left : xMin,
    zoomDomain.right !== null ? zoomDomain.right : xMax,
  ];

  const handleZoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');  
      return;
    }

    let [left, right] = [refAreaLeft, refAreaRight];
    if (left > right) [left, right] = [right, left];
    setZoomDomain({ left, right });
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const zoomOut = () => {
    setZoomDomain({ left: null, right: null });
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  return (
    <div style={{ width: '100%', padding: 10 }}>
      <div style={{ marginBottom: 10 }}>
        <label>Choose Dataset: </label>
        <select value={selectedDataset} onChange={e => setSelectedDataset(e.target.value)}>
          <option value="data1">Data 1</option>
          <option value="data2">Data 2</option>
        </select>

        <label style={{ marginLeft: 20 }}>X-Axis Interval (days): </label>
        <select value={interval} onChange={e => setInterval(parseInt(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={5}>5</option>
        </select>

        <button style={{ marginLeft: 20 }} onClick={zoomOut}>Zoom Out</button>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          onMouseDown={e => e && setRefAreaLeft(e.activeLabel)}
          onMouseMove={e => refAreaLeft && e && setRefAreaRight(e.activeLabel)}
          onMouseUp={handleZoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={domainX}
            ticks={ticks}
            tickFormatter={time => new Date(time).toLocaleDateString()}
            allowDataOverflow
          />
          <YAxis domain={[yMin, yMax]} allowDecimals={false} />
          <Tooltip
            labelFormatter={time => new Date(time).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={selectedDataset === 'data1' ? '#8884d8' : '#4CAF50'}
            dot={false}
          />
          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ZoomableLineChart;
