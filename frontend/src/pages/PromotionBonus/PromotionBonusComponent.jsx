import React, { useState } from "react";
import { Row, Col, Button, Tabs, Tab } from "@themesberg/react-bootstrap";
import useCheckPermission from "../../utils/checkPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import PromotionBonus from "./index";
import PromotionBonusDashboard from "./Graph/PromotionBonusDashboard";
import "./promotionBonusListing.scss";


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
    <div className="dashboard-typography affiliate-promo-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="affiliate-promo-page__title">Affiliate Promo Codes</h3>
          <p className="affiliate-promo-page__subtitle">
            Create and manage affiliate promo codes and their status
          </p>
        </div>
      </div>

      <Row className="mb-2">
        <Col lg={12}>
          <Tabs
            activeKey={key}
            onSelect={handleTabChange}
            className="affiliate-promo-page__tabs"
            id="affiliate-promo-tabs"
          >
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
    </div>
  );
};

export default PromotionBonusComponent;
