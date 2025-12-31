import React from "react";
import { Row, Col, Card } from "@themesberg/react-bootstrap";
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
      <Row className="mb-2 mt-3">
        <JackpotDashbaordSummary
          isLoading={jackpotInfoLoading}
          jackpotInfo={jackpotInfo}
        />

        <Col md={12} sm={12} className="my-3">
          <Card className="jackpot-page__card p-2">
            <JackpotGraph />
          </Card>
        </Col>

        {currentJackpot?.data?.runningJackpot && (
          <Col className="mt-4" xs={12} md={12} lg={12}>
            <Card className="jackpot-page__card p-3">
              <EditJackpot
                jackpotStatus="Running"
                jackpotDetail={currentJackpot?.data?.runningJackpot}
                runningJackpoTabs={currentJackpot?.data?.jackpotTabs}
              />
            </Card>
          </Col>
        )}

        {currentJackpot?.data?.nextJackpot && (
          <Col className="mt-4">
            <Card className="jackpot-page__card p-3">
              <EditJackpot
                jackpotStatus="Upcoming"
                jackpotDetail={currentJackpot?.data?.nextJackpot}
              />
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default JackportDashboard;
