import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Tab } from "@themesberg/react-bootstrap";

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
    <Row className="mb-2">
      <Col>
        <h3>{t('casinoProviderDashboard.title')}</h3>
      </Col>

      <Col lg={12}>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className='ps-2' id='amoe-tabs'>
          {/* Dashboard Tab */}
          <Tab eventKey='dashboard' title='Dashboard'>
            <ProviderDashboard isHitoricalTab={key} />
          </Tab>

          {/* History and List Tab */}
          <Tab eventKey='provider-matrix' title='Provider rate matrix'>
            <ProviderRateMatrixList loading={false} isHitoricalTab={key} />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};

export default CasinoProviderDashboard;
