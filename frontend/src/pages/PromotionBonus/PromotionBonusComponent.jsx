import React, { useState } from "react";
import { Row, Col, Button, Tabs, Tab } from "@themesberg/react-bootstrap";
import useCheckPermission from "../../utils/checkPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import PromotionBonus from "./index";
import PromotionBonusDashboard from "./Graph/PromotionBonusDashboard";


const PromotionBonusComponent = () => {
  const { isHidden } = useCheckPermission()
  const navigate = useNavigate()
  const location = useLocation();
  const validTabs = ["dashboard", "historical-data"]; // updated tab keys
  const queryTab = new URLSearchParams(location.search).get("tab");
  const initialTab = validTabs.includes(queryTab) ? queryTab : "dashboard";
  const [key, setKey] = useState(initialTab);

  const handleTabChange = (k) => {
    setKey(k);
    const params = new URLSearchParams(location.search);
    params.set("tab", k);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };


  return (
    <>
      <Row className="mb-2">
        <Col>
          <h3>Affiliate Promo Codes</h3>
        </Col>
        <Col lg={12}>
          <Tabs activeKey={key} onSelect={handleTabChange} className='ps-2' id='amoe-tabs'>
            {/* Dashboard Tab */}
            <Tab eventKey='dashboard' title='Dashboard'>
              <PromotionBonusDashboard isHitoricalTab={key} />
            </Tab>

            {/* History and List Tab */}
            <Tab eventKey='historical-data' title='Affiliate Promo data'>
              <PromotionBonus loading={false} isHitoricalTab={key} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default PromotionBonusComponent;
