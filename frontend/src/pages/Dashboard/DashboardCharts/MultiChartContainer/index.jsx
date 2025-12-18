import React, { useState } from "react";
import { formatNumber } from "../../../../utils/dateFormatter";
import SCBonusModal from "../Charts/SCBonusModal";

// const filterData = (data, label) => data.filter((row) => row.label === label);
const DashboardBox = ({ icon, label, data, boxClass, showTooltip, tooltipData, onClickModal, refetchBonus }) => {
  const validData = data != null ? data : 0;
  return (
    <div
      className={`dashboard-box ${boxClass}`}
      onClick={() => {
        if (onClickModal) onClickModal();
        if (refetchBonus) refetchBonus();
      }}
      style={{ cursor: onClickModal ? "pointer" : "default" }}
    >
      <label>{label}</label>
      <div className="value-wrap">
        <div className="live-report-data">{formatNumber(validData)}</div>
        <div className="new-icon">
          {/* <FontAwesomeIcon icon={icon} /> */}
          <img src={icon} />
        </div>
      </div>
      {showTooltip && <span>
        {`${tooltipData?.DASHBOARD_REPORT?.scGgr}(GGR) - ${tooltipData?.DASHBOARD_REPORT?.scAwardedTotalSumForToday}(SC Bonus) + ${tooltipData?.DASHBOARD_REPORT?.jackpotRevenue}(Jackpot Revenue)`}
      </span>
      }
    </div>
  );
};

const MultiChartContainer = ({ data, bonusDataV2, bonusRefetchV2 }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="dashboard-boxes-container">
        <DashboardBox
          icon="/total-sc-staked.svg"
          label="Today SC Staked"
          data={data?.DASHBOARD_REPORT?.scStakedTodayCount}
          boxClass="sc-stack"
        />
        <DashboardBox
          icon="/today-sc-wins.svg"
          label="Today SC wins"
          data={data?.DASHBOARD_REPORT?.scWinTodayCount}
          boxClass="sc-win"
        />
        <DashboardBox
          icon="/total-ggr-sc.svg"
          label="Today GGR SC"
          data={data?.DASHBOARD_REPORT?.scGgr}
          boxClass="scr-sc"
        />
        <DashboardBox
          icon="/sc-awarded-total.svg"
          label="SC Awarded Total"
          data={data?.DASHBOARD_REPORT?.scAwardedTotalSumForToday}
          boxClass="usc-balance"
          onClickModal={() => setShowModal(true)}
          refetchBonus={bonusRefetchV2}
        />
        <SCBonusModal
          show={showModal}
          onClose={() => setShowModal(false)}
          bonusDataV2={bonusDataV2}
        />
        <DashboardBox
          icon="/gc-awarded-total.svg"
          label="GC Awarded Total"
          data={data?.DASHBOARD_REPORT?.gcAwardedTotalSumForToday}
          boxClass="rsc-balance"
        />
        <DashboardBox
          icon="/total-net-ggr-sc.svg"
          label="Today Net GGR SC"
          data={data?.DASHBOARD_REPORT?.netScGgr}
          boxClass="ggrsc-balance"
          showTooltip={true}
          tooltipData={data}
        />
        <DashboardBox
          icon="/jackpot-revenue.svg"
          label="Jackpot Revenue"
          data={data?.DASHBOARD_REPORT?.jackpotRevenue}
          boxClass="sc-jackpot"
        />
        {/* <DashboardBox
          icon={faDollarSign}
          label='Total Wallet SC'
          data={data?.DASHBOARD_REPORT?.
            totalWalletScCoin}
          boxClass='sc-win'
        /> */}
      </div>
    </>
  );
};

export default MultiChartContainer;
