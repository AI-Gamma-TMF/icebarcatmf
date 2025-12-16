import React, { useState } from 'react';
import { Col, Row } from '@themesberg/react-bootstrap';
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
import { AdminRoutes } from '../../../routes';
import VipDashboardScRewardMetrics from './VipDashboardSCRewardMetrics';

const VipDashboard = () => {
  const [search, setSearch] = useState('');
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
    <div>
      <Row className='d-flex justify-content-between align-items-center '>
        <h3 className='w-auto'>Approved VIP Dashboard</h3>
        <Trigger message={'help'} id={'help-icon'} />
        <FontAwesomeIcon
          id='help-icon'
          style={{ cursor: 'pointer' }}
          className='w-auto '
          icon={faCircleInfo}
          onClick={() => navigate(`${AdminRoutes.VipDashboardHelp}`)}
        />
      </Row>
      <Row className='mt-3'>
        <Col sm={6} lg={4}>
          <GlobalSearchBar search={search} setSearch={setSearch} />
        </Col>
      </Row>

      <VipDashboardSummary isLoading={isVipDashboardSummaryLoading} vipDashbaordSummaryData={vipDashboardSummary} />

      <VipDashboardScRewardMetrics isLoading = {isScRewardMetricsLoading} VipScRewardData = {vipDashboardScRewardMetrics}/>

      <VipDashboardStats isLoading={isVipDashboardStatsLoading} vipDashbaordStatsData={vipDashboardStats} />

      <VipDashboardPerformanceMetrics
        isLoading={isPerformanceMetricsLoading}
        vipDashboardPerformanceMetricsData={vipDashboardPerformanceMetrics}
      />

      <BiggestWinnerAndLooser isLoading={isLoading} vipDashbaordWinnerLooser={biggestWinnerLooser} />
    </div>
  );
};
export default VipDashboard;
