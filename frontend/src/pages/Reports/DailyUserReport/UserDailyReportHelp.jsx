import { Row, Table } from "@themesberg/react-bootstrap";
import React from "react";
const UserDailyReportHelp = () => {
  const headers = [
    "Year",
    "Month",
    "Date",
    "Day",
    "Total SC Staked",
    "Total SC Staked DOW Average",
    "Delta SC Staked",
    "7DMA Total SC Staked",
    "30DMA Total SC Staked",
    "Total GGR",
    "7DMA GGR",
    "30DMA GGR",
    "Total SC Awarded",
    "7DMA Total SC Awarded",
    "30DMA Total SC Awarded",
    "Total NGR (GGR - Bonus)",
    "7DMA Total NGR",
    "30DMA Total NGR",
    "Unique Logins",
    "DAU",
    "ABPDAU",
    "ABPDAU 7DMA",
    "A(GGR)PDAU",
    "7DMA A(GGR)PDAU",
    "30DMA A(GGR)PDAU",
    "A(NGR)PDAU",
    "7DMA A(NGR)PDAU",
    "30DMA A(NGR)PDAU",
    "Total Deposits",
    "Avg Deposits on Day",
    "Delta Deposits",
    "7DMA Deposits",
    "30DMA Deposits",
    "Depositors",
    "7DMA Depositors",
    "30DMA Depositors",
    "Withdrawal Requested",
    "Withdrawal Completed",
    "New Registered Players",
    "7DMA New Registered",
    "30DMA New Registered",
    "First Time Purchaser",
    "7DMA First Purchasers",
    "30DMA First Purchasers",
  ];

  const data = [
    [
      "2025",
      "5",
      "1/5/2025",
      "Thursday",
      "Total SC Staked on this day",
      "Calculate the average Total SC Staked of the Last 10 Thursdays",
      "Formula = (Total SC Staked Today - DOW Average) / DOW Average",
      "Average Total SC Staked over Last 7 Days",
      "Average Total SC Staked over Last 30 Days",
      "Total GGR on this day",
      "Average Total GGR over Last 7 Days",
      "Average Total GGR over Last 30 Days",
      "Total SC Awarded on this day",
      "Average Total SC Awarded over Last 7 Days",
      "Average Total SC Awarded over Last 30 Days",
      "Formula = Total GGR - Total SC Awarded",
      "Average NGR over Last 7 Days",
      "Average NGR over Last 30 Days",
      "Total Unique Logins on this day",
      "Total Number of PLayers with at least one SC wager on this day",
      "Formula = Total SC Staked / DAU",
      "Formula = (Sum of Total SC Staked last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Formula = (Sum of Total GGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(GGR)PDAU over Last 7 Days",
      "Average A(GGR)PDAU over Last 30 Days",
      "Formula = (Sum of Total NGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(NGR)PDAU over Last 7 Days",
      "Average A(NGR)PDAU over Last 30 Days",
      "Total Deposits on this day",
      "Calculate the average Total Deposits of the Last 10 Thursdays",
      "Formula = (Total Deposits Today - DOW Average) / DOW Average",
      "Average Deposits over Last 7 Days",
      "Average Deposits over Last 30 Days",
      "Total Unique Depositors Today",
      "Average Unique Depositors over Last 7 Days",
      "Average Unique Depositors over Last 30 Days",
      "Total Amount of Withdrawals Requested Today",
      "Total Amount of Withdrawals Completed Today",
      "Count of Newly Registered Players",
      "Average New Registered over Last 7 Days",
      "Average New Registered over Last 30 Days",
      "Count of First Time Depositors",
      "Average First Purchaser over Last 7 Days",
      "Average First Purchaser over Last 30 Days",
    ],
    [
      "2025",
      "5",
      "2/5/2025",
      "Friday",
      "Total SC Staked on this day",
      "Calculate the average Total SC Staked of the Last 10 Fridays",
      "Formula = (Total SC Staked Today - DOW Average) / DOW Average",
      "Average Total SC Staked over Last 7 Days",
      "Average Total SC Staked over Last 30 Days",
      "Total GGR on this day",
      "Average Total GGR over Last 7 Days",
      "Average Total GGR over Last 30 Days",
      "Total SC Awarded on this day",
      "Average Total SC Awarded over Last 7 Days",
      "Average Total SC Awarded over Last 30 Days",
      "Formula = Total GGR - Total SC Awarded",
      "Average NGR over Last 7 Days",
      "Average NGR over Last 30 Days",
      "Total Unique Logins on this day",
      "Total Number of PLayers with at least one SC wager on this day",
      "Formula = Total SC Staked / DAU",
      "Formula = (Sum of Total SC Staked last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Formula = (Sum of Total GGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(GGR)PDAU over Last 7 Days",
      "Average A(GGR)PDAU over Last 30 Days",
      "Formula = (Sum of Total NGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(NGR)PDAU over Last 7 Days",
      "Average A(NGR)PDAU over Last 30 Days",
      "Total Deposits on this day",
      "Calculate the average Total Deposits of the Last 10 Thursdays",
      "Formula = (Total Deposits Today - DOW Average) / DOW Average",
      "Average Deposits over Last 7 Days",
      "Average Deposits over Last 30 Days",
      "Total Unique Depositors Today",
      "Average Unique Depositors over Last 7 Days",
      "Average Unique Depositors over Last 30 Days",
      "Total Amount of Withdrawals Requested Today",
      "Total Amount of Withdrawals Completed Today",
      "Count of Newly Registered Players",
      "Average New Registered over Last 7 Days",
      "Average New Registered over Last 30 Days",
      "Count of First Time Depositors",
      "Average First Purchaser over Last 7 Days",
      "Average First Purchaser over Last 30 Days",
    ],
    [
      "2025",
      "5",
      "3/5/2025",
      "Saturday",
      "Total SC Staked on this day",
      "Calculate the average Total SC Staked of the Last 10 Saturdays",
      "Formula = (Total SC Staked Today - DOW Average) / DOW Average",
      "Average Total SC Staked over Last 7 Days",
      "Average Total SC Staked over Last 30 Days",
      "Total GGR on this day",
      "Average Total GGR over Last 7 Days",
      "Average Total GGR over Last 30 Days",
      "Total SC Awarded on this day",
      "Average Total SC Awarded over Last 7 Days",
      "Average Total SC Awarded over Last 30 Days",
      "Formula = Total GGR - Total SC Awarded",
      "Average NGR over Last 7 Days",
      "Average NGR over Last 30 Days",
      "Total Unique Logins on this day",
      "Total Number of PLayers with at least one SC wager on this day",
      "Formula = Total SC Staked / DAU",
      "Formula = (Sum of Total SC Staked last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Formula = (Sum of Total GGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(GGR)PDAU over Last 7 Days",
      "Average A(GGR)PDAU over Last 30 Days",
      "Formula = (Sum of Total NGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(NGR)PDAU over Last 7 Days",
      "Average A(NGR)PDAU over Last 30 Days",
      "Total Deposits on this day",
      "Calculate the average Total Deposits of the Last 10 Thursdays",
      "Formula = (Total Deposits Today - DOW Average) / DOW Average",
      "Average Deposits over Last 7 Days",
      "Average Deposits over Last 30 Days",
      "Total Unique Depositors Today",
      "Average Unique Depositors over Last 7 Days",
      "Average Unique Depositors over Last 30 Days",
      "Total Amount of Withdrawals Requested Today",
      "Total Amount of Withdrawals Completed Today",
      "Count of Newly Registered Players",
      "Average New Registered over Last 7 Days",
      "Average New Registered over Last 30 Days",
      "Count of First Time Depositors",
      "Average First Purchaser over Last 7 Days",
      "Average First Purchaser over Last 30 Days",
    ],
    [
      "2025",
      "5",
      "4/5/2025",
      "Sunday",
      "Total SC Staked on this day",
      "Calculate the average Total SC Staked of the Last 10 Sundays",
      "Formula = (Total SC Staked Today - DOW Average) / DOW Average",
      "Average Total SC Staked over Last 7 Days",
      "Average Total SC Staked over Last 30 Days",
      "Total GGR on this day",
      "Average Total GGR over Last 7 Days",
      "Average Total GGR over Last 30 Days",
      "Total SC Awarded on this day",
      "Average Total SC Awarded over Last 7 Days",
      "Average Total SC Awarded over Last 30 Days",
      "Formula = Total GGR - Total SC Awarded",
      "Average NGR over Last 7 Days",
      "Average NGR over Last 30 Days",
      "Total Unique Logins on this day",
      "Total Number of PLayers with at least one SC wager on this day",
      "Formula = Total SC Staked / DAU",
      "Formula = (Sum of Total SC Staked last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Formula = (Sum of Total GGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(GGR)PDAU over Last 7 Days",
      "Average A(GGR)PDAU over Last 30 Days",
      "Formula = (Sum of Total NGR last 7 days ) / (Sum of DAUs Last 7 Days)",
      "Average A(NGR)PDAU over Last 7 Days",
      "Average A(NGR)PDAU over Last 30 Days",
      "Total Deposits on this day",
      "Calculate the average Total Deposits of the Last 10 Thursdays",
      "Formula = (Total Deposits Today - DOW Average) / DOW Average",
      "Average Deposits over Last 7 Days",
      "Average Deposits over Last 30 Days",
      "Total Unique Depositors Today",
      "Average Unique Depositors over Last 7 Days",
      "Average Unique Depositors over Last 30 Days",
      "Total Amount of Withdrawals Requested Today",
      "Total Amount of Withdrawals Completed Today",
      "Count of Newly Registered Players",
      "Average New Registered over Last 7 Days",
      "Average New Registered over Last 30 Days",
      "Count of First Time Depositors",
      "Average First Purchaser over Last 7 Days",
      "Average First Purchaser over Last 30 Days",
    ],
  ];
  return (
    <>
      <Row>
        <h3> Daily Report with Metrics & Formulas</h3>
      </Row>
      <Row>
        <p>
          This reference table provides descriptions and formulas for each
          metric column used in the User&apos;s daily report. It is intended as
          a guide and does not reflect live data values.
        </p>
      </Row>
      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-4"
      >
        <thead className="thead-dark">
          <tr>
            {headers?.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    border: "1px solid #eee",
                    padding: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UserDailyReportHelp;
