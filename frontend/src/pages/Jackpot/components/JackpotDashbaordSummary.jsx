import React from "react";
import { Card, Col } from "@themesberg/react-bootstrap";
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
        <>
          <Col xl={3} lg={4} md={6} sm={6} className="mt-1">
            <Card className="vip-card light-pink">
              <img src={masterWallet} alt="wallet-credit" loading="lazy" />
              <div className="card-text">
                <p>Master Wallet Credit</p>
                <h5>
                  {displayValue(jackpotInfo?.masterWalletCreditSum, true)}
                </h5>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={4} md={6} sm={6} className="mt-1">
            <Card className="vip-card light-blue">
              <img src={totalSeed} alt="seed-amount" loading="lazy" />
              <div className="card-text">
                <p>Seed Amount Total</p>
                <h5>{displayValue(jackpotInfo?.seedAmountSum, true)} </h5>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={4} md={6} sm={6} className="mt-1">
            <Card className="vip-card light-green">
              <img src={netRevenue} alt="net-revenue" loading="lazy" />
              <div className="card-text">
                <p>Net Revenue</p>
                <h5>{displayValue(jackpotInfo?.netRevenue, true)} </h5>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={4} md={6} sm={6} className="mt-1">
            <Card className="vip-card light-purple">
              <img src={hourlyEarning} alt="hourly-earning" loading="lazy" />
              <div className="card-text">
                <p>Hourly Earning Rate</p>
                <h5>{displayValue(jackpotInfo?.hourlyEarningRate, true)}</h5>
              </div>
            </Card>
          </Col>

          <Col xl={3} lg={4} md={6} sm={6} className="mt-1">
            <Card className="vip-card light-red">
              <img src={maxRevenue} alt="max-revenue" loading="lazy" />
              <div className="card-text">
                <p>Max Revenue</p>
                <h5>{displayValue(jackpotInfo?.maxRevenue, true)} </h5>
              </div>
            </Card>
          </Col>
          <Col xl={3} lg={4} md={6} sm={6} className="mt-1">
            <Card className="vip-card light-yellow">
              <img src={totalSpins} alt="total-spins" loading="lazy" />
              <div className="card-text">
                <p>Total Spins</p>
                <h5>{displayValue(jackpotInfo?.totalSpinCounts)}</h5>
              </div>
            </Card>
          </Col>
        </>
      )}
    </>
  );
};

export default JackpotDashbaordSummary;
