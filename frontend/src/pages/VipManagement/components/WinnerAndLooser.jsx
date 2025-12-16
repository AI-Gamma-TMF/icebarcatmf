import React from 'react';
import { Accordion, Col, Row } from '@themesberg/react-bootstrap';
import { capitalizeFirstLetter, formatNumber } from '../../../utils/helper';
import { InlineLoader } from '../../../components/Preloader';
const BiggestWinnerAndLooser = ({ isLoading, vipDashbaordWinnerLooser }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row className='mt-4'>
            <Accordion defaultActiveKey='2' className='vip-dashboard'>
              <Accordion.Item eventKey='2'>
                <Accordion.Header>Biggest Winner *</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {vipDashbaordWinnerLooser?.topWinners.map((winners) => {
                      return (
                        <Col sm={4} md={3} lg={2} key={winners.userId}>
                          <div className='winner-cards'>
                            <h4>
                              {winners?.firstName && winners?.lastName
                                ? `${capitalizeFirstLetter(winners?.firstName)} ${capitalizeFirstLetter(
                                    winners?.lastName,
                                  )}`
                                : 'NA'}
                            </h4>
                            <div className='d-flex align-items-center'>
                              <img src='/entry-amount-sc.png' alt='winner-sc-amount' loading='lazy' />
                              <h6 className='ms-3 sc-text'>
                                {formatNumber(winners.netAmount, { isDecimal: true })} SC
                              </h6>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
          <Row className='mt-4'>
            <Accordion defaultActiveKey='2' className='vip-dashboard'>
              <Accordion.Item eventKey='2'>
                <Accordion.Header>Biggest Loser * </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {vipDashbaordWinnerLooser?.topLooser.map((looser, _index) => {
                      return (
                        <Col sm={4} md={3} lg={2} key={looser?.userId}>
                          <div className='winner-cards'>
                            <h4>
                              {looser?.firstName && looser?.lastName
                                ? `${capitalizeFirstLetter(looser?.firstName)} ${capitalizeFirstLetter(
                                    looser?.lastName,
                                  )}`
                                : 'NA'}
                            </h4>
                            <div className='d-flex align-items-center'>
                              <img src='/entry-amount-sc.png' alt='looser-sc-amount' loading='lazy' />
                              <h6 className='ms-3 sc-text'>
                                {formatNumber(looser?.netAmount, { isDecimal: true })} SC
                              </h6>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
          <Row className='ms-1 mt-2 fw-bold'>
            * Note : The data for the biggest winner and biggest loser is updated every 24 hours. All other data is refreshed every 30 minutes, except for the total VIP count, which is updated immediately.
          </Row>
        </>
      )}
    </>
  );
};

export default BiggestWinnerAndLooser;
