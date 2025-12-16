import React from 'react';
import { Accordion, Col, Row } from '@themesberg/react-bootstrap';
import './_vip.scss';
import { PieChart } from '../charts/PieChart';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import { InlineLoader } from '../../../components/Preloader';
import { formatNumber } from '../../../utils/helper';

const VipDashboardPerformanceMetrics = ({ isLoading, vipDashboardPerformanceMetricsData }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row /*className='mt-4'*/ spacing={1}>
            <Col className='mt-4' sm={12} xl={6}>
              <Accordion defaultActiveKey='0' className='vip-dashboard'>
                <Accordion.Item className='light-yellow' eventKey='0'>
                  <Accordion.Header>Net Gaming Revenue (NGR)</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/total-icon.svg' alt='YTD-total-ngr' loading='lazy' />
                          <h4 className='pink-text'>
                            {formatNumber(vipDashboardPerformanceMetricsData?.SC_NGR_TOTAL?.YEAR_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>YTD Total NGR</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/average-icon.svg' alt='monthly-average-ngr' loading='lazy' />
                          <h4 className='blue-text'>
                            {formatNumber(vipDashboardPerformanceMetricsData?.SC_NGR_TOTAL?.MONTHLY_AVERAGE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Average Monthly Total NGR </p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/calendar-icon.svg' alt='MTD-total-ngr' loading='lazy' />
                          <h4 className='green-text'>
                            {formatNumber(vipDashboardPerformanceMetricsData?.SC_NGR_TOTAL?.MONTH_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>MTD Total NGR</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/last-day-icon.svg' alt='7-day-ngr' loading='lazy' />
                          <h4 className='yellow-text'>
                            {formatNumber(vipDashboardPerformanceMetricsData?.SC_NGR_TOTAL?.LAST_WEEK, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Last 7 Days Total NGR</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col className='mt-4' sm={12} xl={6}>
              <Accordion defaultActiveKey='1' className='vip-dashboard'>
                <Accordion.Item className='light-green' eventKey='1'>
                  <Accordion.Header>Hold Percentage</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/total-icon.svg' alt='YTD-total-hold' loading='lazy' />
                          <h4 className='pink-text'>
                            {' '}
                            {formatNumber(vipDashboardPerformanceMetricsData?.HOLD_PERCENTAGE?.YEAR_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            %
                          </h4>
                          <p>YTD Total Hold</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/average-icon.svg' alt='monthly-average-hold' loading='lazy' />
                          <h4 className='blue-text'>
                            {' '}
                            {formatNumber(vipDashboardPerformanceMetricsData?.HOLD_PERCENTAGE?.MONTHLY_AVERAGE, {
                              isDecimal: true,
                            })}{' '}
                            %
                          </h4>
                          <p>Average Monthly Total Hold</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/calendar-icon.svg' alt='MTD-total-hold' loading='lazy' />
                          <h4 className='green-text'>
                            {' '}
                            {formatNumber(vipDashboardPerformanceMetricsData?.HOLD_PERCENTAGE?.MONTH_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            %
                          </h4>
                          <p>MTD Total Hold</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/last-day-icon.svg' alt='7-day-hold' loading='lazy' />
                          <h4 className='yellow-text'>
                            {' '}
                            {formatNumber(vipDashboardPerformanceMetricsData?.HOLD_PERCENTAGE?.LAST_WEEK, {
                              isDecimal: true,
                            })}{' '}
                            %
                          </h4>
                          <p>Last 7 Days Total Hold</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col sm={12} lg={6}>
              <PieChart redemptionToPurchaseRatio={vipDashboardPerformanceMetricsData?.REDEMPTION_TO_PURCHASE_RATIO} />
            </Col>
            <Col sm={12} lg={6}>
              <VerticalBarChart reinvestmentPercentage={vipDashboardPerformanceMetricsData?.REINVESTMENT_PERCENTAGE} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default VipDashboardPerformanceMetrics;
