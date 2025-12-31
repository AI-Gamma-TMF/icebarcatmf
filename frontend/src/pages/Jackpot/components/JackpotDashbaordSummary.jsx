import React from "react";
import { InlineLoader } from "../../../components/Preloader";
import { formatNumber } from "../../../utils/helper";
import maxRevenue from "../../../assets/img/max-revenue.svg";
import totalSpins from "../../../assets/img/total-spins.svg";
import totalSeed from "../../../assets/img/total-seed-amount.svg";
import netRevenue from "../../../assets/img//net-revenue.svg";
import hourlyEarning from "../../../assets/img/hourly-earning.svg";
import masterWallet from "../../../assets/img/master-wallet.svg";

const displayValue = (value, isDecimal = false) => {
  const number = Number(value);
  if (isNaN(number)) return "0";
  return formatNumber(number, { isDecimal });
};

const JackpotDashbaordSummary = ({ isLoading, jackpotInfo }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <div className="jackpot-summary dashboard-boxes-container">
          {[
            {
              label: "Master Wallet Credit",
              value: displayValue(jackpotInfo?.masterWalletCreditSum, true),
              icon: masterWallet,
            },
            {
              label: "Seed Amount Total",
              value: displayValue(jackpotInfo?.seedAmountSum, true),
              icon: totalSeed,
            },
            {
              label: "Net Revenue",
              value: displayValue(jackpotInfo?.netRevenue, true),
              icon: netRevenue,
            },
            {
              label: "Hourly Earning Rate",
              value: displayValue(jackpotInfo?.hourlyEarningRate, true),
              icon: hourlyEarning,
            },
            {
              label: "Max Revenue",
              value: displayValue(jackpotInfo?.maxRevenue, true),
              icon: maxRevenue,
            },
            {
              label: "Total Spins",
              value: displayValue(jackpotInfo?.totalSpinCounts),
              icon: totalSpins,
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

export default JackpotDashbaordSummary;
