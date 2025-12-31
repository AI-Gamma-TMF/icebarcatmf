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
    <div className="dashboard-typography">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h3>{t('casinoProviderDashboard.title')}</h3>
          <p className="text-muted mb-0">Provider analytics and rate matrices</p>
        </div>
      </div>

      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="ps-2" id="amoe-tabs">
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
