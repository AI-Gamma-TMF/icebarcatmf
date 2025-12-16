import React from "react";
import { Row, Col, Card } from "@themesberg/react-bootstrap";
import PromotionBonusDashbaordSummary from "./PromotionBonusDashboardSummary";
import "./promotionBonus.scss";
import PromotionBonusGraph from "./PromotionBonusGraph";

const PromotionBonusDashboard = ({ isHitoricalTab }) => {
//   const {
//     currentPromotionBonus,
//     currentPromotionBonusLoading,
//     promotionBonusInfoLoading,
//     promotionBonusInfo,
//   } = usePromotionBonusListing(isHitoricalTab);

  return (
    <>
      <Row className="mb-2 mt-4">
        {/* <PromotionBonusDashbaordSummary
          isLoading={false}
          promotionBonusInfo={promotionBonusInfo}
        /> */}

        <Col md={12} sm={12} className="my-3">
          <Card className=" tournament-card p-2">
            <PromotionBonusGraph />
          </Card>
        </Col>

        {/* {currentPromotionBonus?.data?.runningPromotionBonus && (
          <Col className="mt-4" xs={12} md={12} lg={12}>
            <div
              style={{
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 4px #00000040",
                marginTop: "1rem",
                background: "#F4F6F8",
              }}
            >
              <EditPromotionBonus
                promotionBonusStatus="Running"
                promotionBonusDetail={currentPromotionBonus?.data?.runningPromotionBonus}
                runningJackpoTabs={currentPromotionBonus?.data?.promotionBonusTabs}
              />
            </div>
          </Col>
        )}

        {currentPromotionBonus?.data?.nextPromotionBonus && (
          <Col className="mt-4">
            <div
              style={{
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 4px #00000040",
                marginTop: "1rem",
                background: "#F4F6F8",


              }}
            >
              <EditPromotionBonus
                promotionBonusStatus="Upcoming"
                promotionBonusDetail={currentPromotionBonus?.data?.nextPromotionBonus}
              />
            </div>
          </Col>
        )} */}
      </Row>
    </>
  );
};

export default PromotionBonusDashboard;
