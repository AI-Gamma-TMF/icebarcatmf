import React from 'react';

const ShortLabelSquare = ({ label, value }) => {
  return (
    <div style={styles.container}>
      <div style={styles.square}></div>
      <div style={styles.content}>
        <div style={styles.label}>
          {value}
          <span style={styles.customSpan}>{` - ${label}`}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    fontSize: '8px',
    fontWeight: 600,
  },
  customSpan: {
    fontSize: '12px',
    color: '#4a5073',
    fontWeight: 600,
  },
  square: {
    width: 12,
    height: 12,
    backgroundColor: 'lightblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
  },
};

const CustomLegend = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <ShortLabelSquare key={index} label={item.label} value={item.value} />
      ))}
    </>
  );
};

// Example usage
const ChartLabelDetail = () => {
  const data = [
    { label: 'NEW REGISTRATION', value: 'NR' },
    { label: 'PHONE VERIFIED', value: 'PV' },
    { label: 'FIRST DEPOSIT', value: 'FD' },
    { label: 'FIRST DEPOSIT AMOUNT SUM', value: 'FDAS' },
    { label: 'PURCHASE AMOUNT SUM', value: 'PAS' },
    { label: 'PURCHASE AMOUNT COUNT', value: 'PAC' },
    { label: 'APPROVAL REDEMPTION AMOUNT SUM', value: 'ARAS' },
    { label: 'REQUEST REDEMPTION AMOUNT SUM', value: 'RRAS' },
    { label: 'PENDING REDEMPTION COUNT SUM', value: 'PRCS' },
  ];

  return <CustomLegend data={data} />;
};

export default ChartLabelDetail;
