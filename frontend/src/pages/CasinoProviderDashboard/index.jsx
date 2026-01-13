import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Tab, Card } from "@themesberg/react-bootstrap";

import { useLocation, useNavigate } from "react-router-dom";
import ProviderDashboard from "./components/ProviderDashboard";
import { useTranslation } from 'react-i18next';
import useCheckPermission from "../../utils/checkPermission";
import ProviderRateMatrixList from "./components/ProviderRateMatrixList";


const CasinoProviderDashboard = () => {
  const { t } = useTranslation(['casino']);

  const { isHidden } = useCheckPermission()
  const navigate = useNavigate()
  const location = useLocation();
  const [key, setKey] = useState(location.state?.openMatrixOnce ? 'provider-matrix' : 'dashboard');

  useEffect(() => {
    if (location.state?.openMatrixOnce) {
      // Replace history state without reload
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="provider-dashboard-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col sm={8}>
          <h3 className="provider-dashboard-page__title">{t('casinoProviderDashboard.title')}</h3>
        </Col>
      </Row>

      <Card className="p-2 mb-2 provider-dashboard-page__card">
        <Card.Body className="provider-dashboard-page__card-body">
          <Tabs 
            activeKey={key} 
            onSelect={(k) => setKey(k)} 
            className="provider-dashboard-tabs" 
            id="provider-dashboard-tabs"
          >
            <Tab eventKey="dashboard" title="Dashboard">
              <ProviderDashboard isHitoricalTab={key} />
            </Tab>
            <Tab eventKey="provider-matrix" title="Provider rate matrix">
              <ProviderRateMatrixList loading={false} isHitoricalTab={key} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CasinoProviderDashboard;
