import React from 'react';
import { Accordion, Col, Row } from '@themesberg/react-bootstrap';
import { InlineLoader } from '../../../components/Preloader';
import { formatNumber } from '../../../utils/helper';

const VipDashboardStats = ({ isLoading, vipDashbaordStatsData }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row /* className='mt-3'*/ spacing={1}>
            <Col className='mt-4' sm={12} xl={6}>
              <Accordion defaultActiveKey='0' className='vip-dashboard'>
                <Accordion.Item className='light-pink' eventKey='0'>
                  <Accordion.Header>Total Purchase</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/total-icon.svg' alt='YTD-total-purchase' loading='lazy' />
                          <h4 className='pink-text'>
                            {formatNumber(vipDashbaordStatsData?.PURCHASE_AMOUNT_SUM?.YEAR_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>YTD Total Purchase</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/average-icon.svg' alt='monthly-average-purchase' loading='lazy' />
                          <h4 className='blue-text'>
                            {formatNumber(vipDashbaordStatsData?.PURCHASE_AMOUNT_SUM?.MONTHLY_AVERAGE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Average Monthly Total Purchase</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/calendar-icon.svg' alt='MTD-total-purchase' loading='lazy' />
                          <h4 className='green-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.PURCHASE_AMOUNT_SUM?.MONTH_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>MTD Total Purchase</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/last-day-icon.svg' alt='7-day-purchase' loading='lazy' />
                          <h4 className='yellow-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.PURCHASE_AMOUNT_SUM?.LAST_WEEK, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Last 7 Days Total Purchase</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col className='mt-4' sm={12} xl={6}>
              <Accordion defaultActiveKey='1' className='vip-dashboard'>
                <Accordion.Item className='light-purple' eventKey='1'>
                  <Accordion.Header>Total Redemption</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/total-icon.svg' alt='YTD-total-redemption' loading='lazy' />
                          <h4 className='pink-text'>
                            {formatNumber(vipDashbaordStatsData?.APPROVAL_REDEMPTION_AMOUNT_SUM?.YEAR_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>YTD Total Redemption</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/average-icon.svg' alt='monthly-average-redemption' loading='lazy' />
                          <h4 className='blue-text'>
                            {formatNumber(vipDashbaordStatsData?.APPROVAL_REDEMPTION_AMOUNT_SUM?.MONTHLY_AVERAGE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Average Monthly Total Redemption</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/calendar-icon.svg' alt='MTD-total-purchase' loading='lazy' />
                          <h4 className='green-text'>
                            {formatNumber(vipDashbaordStatsData?.APPROVAL_REDEMPTION_AMOUNT_SUM?.MONTH_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>MTD Total Redemption</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/last-day-icon.svg' alt='7-day-redemption' loading='lazy' />
                          <h4 className='yellow-text'>
                            {formatNumber(vipDashbaordStatsData?.APPROVAL_REDEMPTION_AMOUNT_SUM?.LAST_WEEK, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Last 7 Days Total Redemption</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
          <Row /*className='mt-4'*/ spacing={1}>
            <Col className='mt-4' sm={12} xl={6}>
              <Accordion defaultActiveKey='0' className='vip-dashboard'>
                <Accordion.Item className='light-blue' eventKey='0'>
                  <Accordion.Header>Total Bets</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/total-icon.svg' alt='YTD-total-bets' loading='lazy' />
                          <h4 className='pink-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.TOTAL_SC_BET_AMOUNT_SUM?.YEAR_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>YTD Total Bets</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/average-icon.svg' alt='monthly-average-bets' loading='lazy' />
                          <h4 className='blue-text'>
                            {formatNumber(vipDashbaordStatsData?.TOTAL_SC_BET_AMOUNT_SUM?.MONTHLY_AVERAGE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Average Monthly Total Bets</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/calendar-icon.svg' alt='MTD-total-bets' loading='lazy' />
                          <h4 className='green-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.TOTAL_SC_BET_AMOUNT_SUM?.MONTH_TO_DATE, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>MTD Total Bets</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/last-day-icon.svg' alt='7-day-bets' loading='lazy' />
                          <h4 className='yellow-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.TOTAL_SC_BET_AMOUNT_SUM?.LAST_WEEK, {
                              isDecimal: true,
                            })}{' '}
                            SC
                          </h4>
                          <p>Last 7 Days Total Bets</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col className='mt-4' sm={12} xl={6}>
              <Accordion defaultActiveKey='1' className='vip-dashboard'>
                <Accordion.Item className='light-pink' eventKey='1'>
                  <Accordion.Header>Gross Gaming Revenue (GGR)</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/total-icon.svg' alt='YTD-total-ggr' loading='lazy' />
                          <h4 className='pink-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.SC_GGR_TOTAL?.YEAR_TO_DATE, { isDecimal: true })} SC
                          </h4>
                          <p>YTD Total GGR</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/average-icon.svg' alt='monthly-average-ggr' loading='lazy' />
                          <h4 className='blue-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.SC_GGR_TOTAL?.MONTHLY_AVERAGE, { isDecimal: true })} SC
                          </h4>
                          <p>Average Monthly Total GGR</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/calendar-icon.svg' alt='MTD-total-ggr' loading='lazy' />
                          <h4 className='green-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.SC_GGR_TOTAL?.MONTH_TO_DATE, { isDecimal: true })} SC
                          </h4>
                          <p>MTD Total GGR</p>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div className='accordion-card'>
                          <img src='/svg/last-day-icon.svg' alt='7-day-ggr' loading='lazy' />
                          <h4 className='yellow-text'>
                            {' '}
                            {formatNumber(vipDashbaordStatsData?.SC_GGR_TOTAL?.LAST_WEEK, { isDecimal: true })} SC{' '}
                          </h4>
                          <p>Last 7 Days Total GGR</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default VipDashboardStats;
