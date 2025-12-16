import React from "react";
import { Row, Col, Card, Form as BForm } from "@themesberg/react-bootstrap";
import { useTranslation } from 'react-i18next'
import { VERIFFSTATUS } from "../../constants";

const Veriff = ({ basicInfo, handleCheckboxChange, veriffChecked }) => {
  const { t } = useTranslation('verification')
  return (
    <>
    <Row className='my-5 w-100 m-auto'>
      <Row className='w-100 m-auto px-0'>
        <Col className='d-flex'>
          <h5>{t("veriff.title")}&nbsp;</h5>
          <BForm.Check
            type='checkbox'
            name='veriff'
            onChange={() => handleCheckboxChange('veriff')}
            checked={veriffChecked}
          />
        </Col>
      </Row>
      <Row className='w-100 m-auto px-0'>
      {(basicInfo?.veriffStatus !== VERIFFSTATUS.PENDING || basicInfo?.veriffStatus === VERIFFSTATUS.REJECTED) &&

        <Col className='col-padding col-lg-6 col-12 mb-3 mb-lg-0'>
          <Card className='card-overview'>
            <div className='div-overview'>
              {t('veriff.info')}
            </div>
          </Card>
        </Col>}
        {(basicInfo?.veriffStatus === VERIFFSTATUS.PENDING || basicInfo?.veriffStatus === VERIFFSTATUS.REJECTED) &&

        <Col className='col-padding col-lg-6 col-12'>
          <Card className='card-overview'>
            <div className='div-overview'>
            {basicInfo?.moreDetails?.veriffReason ? basicInfo?.moreDetails?.veriffReason : 'No Message Available'}
            </div>
          </Card>
        </Col>}
      </Row>
      </Row>
    </>
  );
};

export default Veriff;
