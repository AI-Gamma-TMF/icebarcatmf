import React, { useState } from "react";
import { Row, Col, Button, Tabs, Tab } from "@themesberg/react-bootstrap";
import HistoricalJackpotPools from "./components/HistoricalJackpotPools";
import useCheckPermission from "../../utils/checkPermission";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import JackportDashboard from "./components/JackportDashboard";


const JackpotSettings = () => {
  const { isHidden } = useCheckPermission()
  const navigate = useNavigate()
  const [key, setKey] = useState('dashboard');


  return (
    <>
      <Row className="mb-2">
        <Col>
          <h3>Progressive Jackpot</h3>
        </Col>

        <Col>
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              hidden={isHidden({ module: { key: 'Jackpot', value: 'C' } })}
              size="sm"
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(AdminRoutes.CreateJackpot);
              }}
            >
              Create Jackpot
            </Button>
          </div>
        </Col>

        <Col lg={12}>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className='ps-2' id='amoe-tabs'>
            {/* Dashboard Tab */}
            <Tab eventKey='dashboard' title='Dashboard'>
              <JackportDashboard isHitoricalTab={key} />
            </Tab>

            {/* History and List Tab */}
            <Tab eventKey='historical-data' title='Historical data'>
              <HistoricalJackpotPools loading={false} isHitoricalTab={key} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default JackpotSettings;
