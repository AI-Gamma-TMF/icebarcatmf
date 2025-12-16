import React from "react";
import { Row, Col, Card } from "@themesberg/react-bootstrap";
import "../_jackpot.scss";
import JackpotDashbaordSummary from "./JackpotDashbaordSummary";
import EditJackpot from "./EditJackpot";
import useJackpotListing from "../hooks/useJackpotListing";
import JackpotGraph from "./JackpotGraph";

const JackportDashboard = ({ isHitoricalTab }) => {
  const {
    currentJackpot,
    jackpotInfoLoading,
    jackpotInfo,
  } = useJackpotListing(isHitoricalTab);

  return (
    <>
      <Row className="mb-2 mt-4">
        <JackpotDashbaordSummary
          isLoading={jackpotInfoLoading}
          jackpotInfo={jackpotInfo}
        />

        <Col md={12} sm={12} className="my-3">
          <Card className=" tournament-card p-2">
            <JackpotGraph />
          </Card>
        </Col>

        {currentJackpot?.data?.runningJackpot && (
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
              <EditJackpot
                jackpotStatus="Running"
                jackpotDetail={currentJackpot?.data?.runningJackpot}
                runningJackpoTabs={currentJackpot?.data?.jackpotTabs}
              />
            </div>
          </Col>
        )}

        {currentJackpot?.data?.nextJackpot && (
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
              <EditJackpot
                jackpotStatus="Upcoming"
                jackpotDetail={currentJackpot?.data?.nextJackpot}
              />
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default JackportDashboard;
