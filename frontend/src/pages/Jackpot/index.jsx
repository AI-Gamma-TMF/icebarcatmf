import React, { useState } from "react";
import { Row, Col, Button, Tabs, Tab } from "@themesberg/react-bootstrap";
import HistoricalJackpotPools from "./components/HistoricalJackpotPools";
import useCheckPermission from "../../utils/checkPermission";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import JackportDashboard from "./components/JackportDashboard";
import "./_jackpot.scss";


const JackpotSettings = () => {
  const { isHidden } = useCheckPermission()
  const navigate = useNavigate()
  const [key, setKey] = useState('dashboard');


  return (
    <div className="jackpot-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col>
          <h3 className="jackpot-page__title">Progressive Jackpot</h3>
        </Col>

        <Col xs="auto" className="d-flex justify-content-end">
          <Button
            className="jackpot-page__action-btn"
            variant="success"
            hidden={isHidden({ module: { key: "Jackpot", value: "C" } })}
            size="sm"
            onClick={() => navigate(AdminRoutes.CreateJackpot)}
          >
            Create Jackpot
          </Button>
        </Col>
      </Row>

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="jackpot-tabs"
        id="jackpot-tabs"
      >
        <Tab eventKey="dashboard" title="Dashboard">
          <JackportDashboard isHitoricalTab={key} />
        </Tab>

        <Tab eventKey="historical-data" title="Historical data">
          <HistoricalJackpotPools isHitoricalTab={key} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default JackpotSettings;
