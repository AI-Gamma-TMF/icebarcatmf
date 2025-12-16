import React from 'react';
import { Card, Col, Row } from '@themesberg/react-bootstrap';
import { InlineLoader } from '../../../components/Preloader';
import { formatNumber } from '../../../utils/helper';

const VipDashboardSummary = ({ isLoading, vipDashbaordSummaryData }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row className='mt-1' spacing={1}>
            <Col lg={4} sm={6}>
              <Card className='vip-card light-blue'>
                <img src='/svg/pending-vip.svg' alt='pending-vip' loading='lazy' />
                <div className='card-text'>
                  <p>Total Pending-VIP</p>
                  <h5>{formatNumber(vipDashbaordSummaryData?.PENDING_VIP_COUNT?.TILL_DATE)}</h5>
                </div>
              </Card>
            </Col>
            <Col lg={4} sm={6}>
              <Card className='vip-card light-green'>
                <img src='/svg/approved-vip.svg' alt='approved-vip' loading='lazy' />
                <div className='card-text'>
                  <p>Total Approved-VIP</p>
                  <h5>{formatNumber(vipDashbaordSummaryData?.APPROVED_VIP_COUNT?.TILL_DATE)}</h5>
                </div>
              </Card>
            </Col>
            <Col lg={4} sm={6}>
              <Card className='vip-card light-yellow'>
                <img src='/svg/vip-ggr.svg' alt='vip-ggr' loading='lazy' />
                <div className='card-text'>
                  <p>Total GGR </p>
                  <h5>{formatNumber(vipDashbaordSummaryData?.SC_GGR_TOTAL?.TILL_DATE, { isDecimal: true })} SC </h5>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className='mt-1'>
            <Col lg={4} sm={6}>
              <Card className='vip-card light-purple'>
                <img src='/svg/vip-ngr.svg' alt='vip-ngr' loading='lazy' />
                <div className='card-text'>
                  <p> Total NGR</p>
                  <h5>{formatNumber(vipDashbaordSummaryData?.SC_NGR_TOTAL?.TILL_DATE, { isDecimal: true })} SC</h5>
                </div>
              </Card>
            </Col>
            <Col lg={4} sm={6}>
              <Card className='vip-card light-red'>
                <img src='/svg/vip-total-win.svg' alt='vip-total-win' loading='lazy' />
                <div className='card-text'>
                  <p>Total Win</p>
                  <h5>
                    {formatNumber(vipDashbaordSummaryData?.TOTAL_SC_WIN_AMOUNT_SUM?.TILL_DATE, { isDecimal: true })} SC
                  </h5>
                </div>
              </Card>
            </Col>
            <Col lg={4} sm={6}>
              <Card className='vip-card light-purple'>
                <img src='/svg/game-players-icon.svg' alt='vip-total-questions-filled' loading='lazy' />
                <div className='card-text'>
                  <p> Total VIP Questionnaire Count </p>
                  <h5>
                    {formatNumber(vipDashbaordSummaryData?.VIP_QUESTIONNAIRE_BONUS_COUNT?.TILL_DATE, { isDecimal: true })} 
                  </h5>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
          <Col lg={4} sm={6}>
              <Card className='vip-card light-yellow'>
                <img src='/svg/approved-amount.svg' alt='vip-total-sc-reward' loading='lazy' />
            
                <div className='card-text'>
                  <p>Total VIP Questionnaire Bonus</p>
                  <h5>
                    {formatNumber(vipDashbaordSummaryData?.VIP_QUESTIONNAIRE_BONUS_AMOUNT?.TILL_DATE, { isDecimal: true })} SC
                  </h5>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default VipDashboardSummary;
