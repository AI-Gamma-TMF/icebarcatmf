import React from "react";
import { Row, Col, Accordion } from "@themesberg/react-bootstrap";
import { InlineLoader } from "../../../components/Preloader";
import { formatNumber } from "../../../utils/helper";

const VipDashboardScRewardMetrics = ({ isLoading, VipScRewardData }) => {
  return (
    <>
      {isLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row className="mt-1" spacing={1}>
            <Col className="mt-4" sm={12} xl={6}>
              <Accordion defaultActiveKey="0" className="vip-dashboard">
                <Accordion.Item className="light-green" eventKey="0">
                  <Accordion.Header>
                  VIP Questionnaire Count
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/total-icon.svg"
                            alt="YTD-total-purchase"
                            loading="lazy"
                          />
                          <h4 className="pink-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_COUNT?.YEAR_TO_DATE, {isDecimal:true})}</h4>
                          <p>YTD Count</p>
                        </div>
                      </Col>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/average-icon.svg"
                            alt="monthly-average-purchase"
                            loading="lazy"
                          />
                          <h4 className="blue-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_COUNT?.MONTHLY_AVERAGE, {isDecimal:true})}</h4>
                          <p>Average Monthly Count</p>
                        </div>
                      </Col>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/calendar-icon.svg"
                            alt="MTD-total-purchase"
                            loading="lazy"
                          />
                          <h4 className="green-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_COUNT?.MONTH_TO_DATE, {isDecimal:true})}</h4>
                          <p>MTD Count</p>
                        </div>
                      </Col>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/last-day-icon.svg"
                            alt="7-day-purchase"
                            loading="lazy"
                          />
                          <h4 className="yellow-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_COUNT?.LAST_WEEK, {isDecimal:true})}</h4>
                          <p>Last 7 Days Count</p>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
 
            <Col className="mt-4" sm={12} xl={6}>
              <Accordion defaultActiveKey="0" className="vip-dashboard">
                <Accordion.Item className="light-blue" eventKey="0">
                  <Accordion.Header>
                  VIP Questionnaire Bonus
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/total-icon.svg"
                            alt="YTD-total-purchase"
                            loading="lazy"
                          />
                          <h4 className="pink-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_AMOUNT?.YEAR_TO_DATE, {isDecimal:true})} SC</h4>
                          <p>YTD SC Bonus</p>
                        </div>
                      </Col>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/average-icon.svg"
                            alt="monthly-average-purchase"
                            loading="lazy"
                          />
                          <h4 className="blue-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_AMOUNT?.MONTHLY_AVERAGE, {isDecimal:true})} SC</h4>
                          <p>Average Monthly SC Bonus</p>
                        </div>
                      </Col>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/calendar-icon.svg"
                            alt="MTD-total-purchase"
                            loading="lazy"
                          />
                          <h4 className="green-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_AMOUNT?.MONTH_TO_DATE, {isDecimal:true})} SC</h4>
                          <p>MTD SC Bonus</p>
                        </div>
                      </Col>
                      <Col>
                        <div className="accordion-card">
                          <img
                            src="/svg/last-day-icon.svg"
                            alt="7-day-purchase"
                            loading="lazy"
                          />
                          <h4 className="yellow-text">{formatNumber(VipScRewardData?.VIP_QUESTIONNAIRE_BONUS_AMOUNT?.LAST_WEEK, {isDecimal:true})} SC</h4>
                          <p>Last 7 Days SC Bonus</p>
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

export default VipDashboardScRewardMetrics;
