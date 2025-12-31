import React from "react";
import { InlineLoader } from "../../../components/Preloader";
import { formatNumber } from "../../../utils/helper";
import totalSeed from "../../../assets/img/total-seed-amount.svg";
import netRevenue from "../../../assets/img//net-revenue.svg";
import hourlyEarning from "../../../assets/img/hourly-earning.svg";
import masterWallet from "../../../assets/img/master-wallet.svg";

const displayValue = (value, isDecimal = false) => {
  const number = Number(value);
  if (isNaN(number)) return "0";
  return formatNumber(number, { isDecimal });
};

const ScratchCardDashbaordSummary = ({ isLoading, scratchCardGraphData }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <div className="scratch-card-summary dashboard-boxes-container">
          {[
            {
              label: "Claimed SC",
              value: displayValue(scratchCardGraphData?.totalClaimedScBonus, true),
              icon: masterWallet,
            },
            {
              label: "Claimed GC",
              value: displayValue(scratchCardGraphData?.totalClaimedGcBonus, true),
              icon: totalSeed,
            },
            {
              label: "Pending GC Bonus",
              value: displayValue(scratchCardGraphData?.pendingToClaimGcBonus, true),
              icon: netRevenue,
            },
            {
              label: "Pending SC Bonus",
              value: displayValue(scratchCardGraphData?.pendingToClaimScBonus, true),
              icon: hourlyEarning,
            },
          ].map((tile) => (
            <div key={tile.label} className="dashboard-box">
              <div className="ticker-label">
                <img src={tile.icon} alt={tile.label} loading="lazy" />
                <label>{tile.label}</label>
              </div>
              <div className="value-wrap">
                <div className="live-report-data">{tile.value}</div>
                <div className="new-icon">
                  <img src={tile.icon} alt="" loading="lazy" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ScratchCardDashbaordSummary;
