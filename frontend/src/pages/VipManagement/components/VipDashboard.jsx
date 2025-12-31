import React from 'react';
import { Button, Card, Col, Row } from '@themesberg/react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useVipDashboard from '../hooks/useVipDashboard';
import GlobalSearchBar from './GlobalSearch';
import VipDashboardSummary from './VipDashbaordSummary';
import VipDashboardStats from './VipDashboardStats';
import VipDashboardPerformanceMetrics from './VipDashboardPerformanceMetrics';
import BiggestWinnerAndLooser from './WinnerAndLooser';
import Trigger from '../../../components/OverlayTrigger/index';
import './_vip.scss';
import './vipDashboard.scss';
import { AdminRoutes } from '../../../routes';
import VipDashboardScRewardMetrics from './VipDashboardSCRewardMetrics';

const VipDashboard = () => {
  const navigate = useNavigate();
  const {
    biggestWinnerLooser,
    isLoading,
    vipDashboardSummary,
    isVipDashboardSummaryLoading,
    vipDashboardStats,
    isVipDashboardStatsLoading,
    vipDashboardPerformanceMetrics,
    isPerformanceMetricsLoading,
    vipDashboardScRewardMetrics,
    isScRewardMetricsLoading
  } = useVipDashboard();

  return (
    <div className="vip-dashboard-page dashboard-typography">
      <Row className="vip-dashboard-page__header align-items-center mb-3">
        <Col xs={12} md={8}>
          <h3 className="vip-dashboard-page__title">Approved VIP Dashboard</h3>
          <div className="vip-dashboard-page__subtitle">
            Monitor VIP performance metrics, questionnaire stats, and top winners/losers.
          </div>
        </Col>
        <Col xs={12} md={4} className="vip-dashboard-page__actions">
          <Trigger message={'help'} id={'vip-help-icon'} />
          <Button
            id="vip-help-icon"
            variant="secondary"
            className="vip-dashboard-page__icon-btn"
            onClick={() => navigate(`${AdminRoutes.VipDashboardHelp}`)}
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </Button>
        </Col>
      </Row>

      <Card className="vip-dashboard-page__filters dashboard-filters p-3 mb-3">
        <Row className="g-3 align-items-start">
          <Col xs={12} md={6} lg={5}>
            <div className="vip-dashboard-page__filter-label">Global Search</div>
            <GlobalSearchBar />
          </Col>
        </Row>
      </Card>

      <div className="vip-dashboard-page__section">
        <VipDashboardSummary
          isLoading={isVipDashboardSummaryLoading}
          vipDashbaordSummaryData={vipDashboardSummary}
        />
      </div>

      <div className="vip-dashboard-page__section">
        <VipDashboardScRewardMetrics
          isLoading={isScRewardMetricsLoading}
          VipScRewardData={vipDashboardScRewardMetrics}
        />
      </div>

      <div className="vip-dashboard-page__section">
        <VipDashboardStats
          isLoading={isVipDashboardStatsLoading}
          vipDashbaordStatsData={vipDashboardStats}
        />
      </div>

      <div className="vip-dashboard-page__section">
        <VipDashboardPerformanceMetrics
          isLoading={isPerformanceMetricsLoading}
          vipDashboardPerformanceMetricsData={vipDashboardPerformanceMetrics}
        />
      </div>

      <div className="vip-dashboard-page__section">
        <BiggestWinnerAndLooser
          isLoading={isLoading}
          vipDashbaordWinnerLooser={biggestWinnerLooser}
        />
      </div>
    </div>
  );
};
export default VipDashboard;
