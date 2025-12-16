import React from "react";
import { Card } from "@themesberg/react-bootstrap";

const DashboardCard = ({ dashboardData }) => {
  const formatPriceWithCommas = (price) => {
    if (price) {
      const roundedPrice = parseFloat(price).toFixed(2); // Round to 2 decimal places
      const finalPrice = roundedPrice.endsWith(".00")
        ? parseInt(roundedPrice)
        : roundedPrice; // Remove .00 if whole number
      return finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    }
    return "0";
  };

  return (
    <div className="tournament-detail-wrap redeem-request ">
      <Card className=" tournament-card p-2">
        <div>
          <h3>Approved Count</h3>
          <h3
          // style={{
          //   color:
          //     tournamentSummaryData?.tournamentSummary?.ggr < 0
          //       ? "red"
          //       : "green",
          // }}
          >
            {formatPriceWithCommas(dashboardData?.approvedCount)}
          </h3>
        </div>
        <div>
          <img src="/svg/approved-count.svg" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Approved Amount</h3>
          <h3>{formatPriceWithCommas(dashboardData?.approvedAmount)}</h3>
        </div>
        <div>
          <img src="/svg/approved-amount.svg" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Pending Count</h3>
          <h3>{formatPriceWithCommas(dashboardData?.pendingCount)}</h3>
        </div>
        <div>
          <img src="/svg/pending-count.svg" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Pending Amount</h3>
          <h3>{formatPriceWithCommas(dashboardData?.pendingAmount)}</h3>
        </div>
        <div>
          <img src="/svg/pending-amount.svg" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Scheduled Count</h3>
          <h3>{formatPriceWithCommas(dashboardData?.scheduledCount)}</h3>
        </div>
        <div>
          <img src="/svg/scheduled-count.svg" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Scheduled Amount</h3>
          <h3>{formatPriceWithCommas(dashboardData?.scheduledAmount)}</h3>
        </div>
        <div>
          {" "}
          <img src="/svg/scheduled-amount.svg" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Average Processing Time</h3>
          <h3>{dashboardData?.avgProcessingTime}</h3>
        </div>
        <div>
          {" "}
          <img src="/svg/avg-processing-time.svg" alt="ggr" />
        </div>
      </Card>
    </div>
  );
};

export default DashboardCard;
