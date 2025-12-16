import React, { useState } from 'react';
import { Row } from '@themesberg/react-bootstrap'
import GrossGamingRevenue from "./FormulaDoc/GrossGamingRevenue";
import HoldPercentage from "./FormulaDoc/HoldPercentage";
import NetGamingRevenue from "./FormulaDoc/NetGamingRevenue";
import RedemptionToPurchaseRatio from "./FormulaDoc/RedeemToPurchase";
import ReinvestmentPercentage from "./FormulaDoc/ReinvestmentPercentage";
import TotalBets from "./FormulaDoc/TotalBet";
import TotalPurchase from "./FormulaDoc/TotalPurchase";
import TotalRedemption from "./FormulaDoc/TotalRedemption";
import VipAccordionForm from "./VipAccordian";
import './_vip.scss';
import TMFPlayerTierCriteria from './FormulaDoc/TmfCriteria';
import ScRewardBonus from './FormulaDoc/ScReward';
import BiggestWinnerAndLooserFormula from './FormulaDoc/BiggestWinnerLooser';

const VipDashboardHelp = () => {
  const [activeAccordion, setActiveAccordion] = useState({});
  const ACCORDION_CONSTANTS = {
    TOTAL_PURCHASE: "TOTAL_PURCHASE",
    TOTAL_REDEMPTION: "TOTAL_REDEMPTION",
    TOTAL_BETS: "TOTAL_BETS",
    GROSS_GAMING_REVENUE: "GROSS_GAMING_REVENUE",
    NET_GAMING_REVENUE: "NET_GAMING_REVENUE",
    HOLD_PERCENTAGE: "HOLD_PERCENTAGE",
    REDEMPTION_TO_PURCHASE: " REDEMPTION_TO_PURCHASE",
    REINVESTIMENT_PERCENTAGE: "REINVESTIMENT_PERCENTAGE",
    TMF_CRITERIA: "TMF_CRITERIA",
    SC_REWARD : "SC_REWARD",
    BIGGESt_WINNER_LOSER:"BIGGESt_WINNER_LOSER"
  };
  const handleToggleAccordian = (accordionKey) => {
    if (activeAccordion[accordionKey]) {
      setActiveAccordion({
        ...activeAccordion,
        [accordionKey]: false,
      });
    } else {
      setActiveAccordion({
        ...activeAccordion,
        [accordionKey]: true,
      });
    }
  };
  return (
    <>
      <Row className="mb-4">
        <h3 className="fw-semibold">Admin Insight : Metric Definitions & Formulas</h3>
        <p className="text-muted mb-0">Explore the formulas powering the numbers you see in the VIP dashboard.</p>
       
      </Row>

      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.SC_REWARD]
            ? ACCORDION_CONSTANTS.SC_REWARD
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.SC_REWARD}
        title="SC Reward Bonus"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.SC_REWARD)
        }
      >
        <ScRewardBonus />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.BIGGESt_WINNER_LOSER]
            ? ACCORDION_CONSTANTS.BIGGESt_WINNER_LOSER
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.BIGGESt_WINNER_LOSER}
        title="Biggest Winner and Loser"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.BIGGESt_WINNER_LOSER)
        }
      >
        <BiggestWinnerAndLooserFormula />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.TOTAL_PURCHASE]
            ? ACCORDION_CONSTANTS.TOTAL_PURCHASE
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.TOTAL_PURCHASE}
        title="Total Purchase"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.TOTAL_PURCHASE)
        }
      >
        <TotalPurchase />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.TOTAL_BETS]
            ? ACCORDION_CONSTANTS.TOTAL_BETS : ""
        }
        eventKey={ACCORDION_CONSTANTS.TOTAL_BETS}
        title="Total Bets"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.TOTAL_BETS)
        }
      >
        <TotalBets />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.TOTAL_REDEMPTION]
            ? ACCORDION_CONSTANTS.TOTAL_REDEMPTION
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.TOTAL_REDEMPTION}
        title="Total Redemption"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.TOTAL_REDEMPTION)
        }
      >
        <TotalRedemption />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.GROSS_GAMING_REVENUE]
            ? ACCORDION_CONSTANTS.GROSS_GAMING_REVENUE
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.GROSS_GAMING_REVENUE}
        title="Gross Gaming Revenue(GGR)"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.GROSS_GAMING_REVENUE)
        }
      >
        <GrossGamingRevenue />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.NET_GAMING_REVENUE]
            ? ACCORDION_CONSTANTS.NET_GAMING_REVENUE
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.NET_GAMING_REVENUE}
        title="Net Gaming Revenue(NGR)"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.NET_GAMING_REVENUE)
        }
      >
        <NetGamingRevenue />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.HOLD_PERCENTAGE]
            ? ACCORDION_CONSTANTS.HOLD_PERCENTAGE
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.HOLD_PERCENTAGE}
        title="Hold Percentage"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.HOLD_PERCENTAGE)
        }
      >
        <HoldPercentage />

      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.REDEMPTION_TO_PURCHASE]
            ? ACCORDION_CONSTANTS.REDEMPTION_TO_PURCHASE
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.REDEMPTION_TO_PURCHASE}
        title="Redemption To Purchase Ratio"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.REDEMPTION_TO_PURCHASE)
        }
      >
        <RedemptionToPurchaseRatio />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.REINVESTIMENT_PERCENTAGE]
            ? ACCORDION_CONSTANTS.REINVESTIMENT_PERCENTAGE
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.REINVESTIMENT_PERCENTAGE}
        title="Reinvestment Percentage"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.REINVESTIMENT_PERCENTAGE)
        }
      >
        <ReinvestmentPercentage />
      </VipAccordionForm>
      <VipAccordionForm
        activeKey={
          activeAccordion[ACCORDION_CONSTANTS.TMF_CRITERIA]
            ? ACCORDION_CONSTANTS.TMF_CRITERIA
            : ""
        }
        eventKey={ACCORDION_CONSTANTS.TMF_CRITERIA}
        title="TMF User Rating Criteria"
        onToggle={() =>
          handleToggleAccordian(ACCORDION_CONSTANTS.TMF_CRITERIA)
        }
      >
        <TMFPlayerTierCriteria/>
      </VipAccordionForm>
      <Row>
      <p >
          <storng>
           Note : Σ represent the sum of consecutive terms of a sequence. 
           </storng>
           </p>
      </Row>
     
    </>
  );
};

export default VipDashboardHelp;
