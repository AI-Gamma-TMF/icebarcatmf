import React from "react";
import { Row, Col,Card, Form as BForm } from "@themesberg/react-bootstrap";
import { useTranslation } from 'react-i18next'

const BankVerificationDetails = ( {bankListData, bankDetailsChecked, handleCheckboxChange, 
  // basicInfo, userDocuments,
   handleImagePreview}) => {
  const { t } = useTranslation('verification')

  const bankDetails = [
    { label: t('bankDetails.routing'), value: bankListData?.routingNumber },
    { label: t('bankDetails.bankName'), value: bankListData?.name },
    { label: t('bankDetails.accountNo'), value: bankListData?.accountNumber },
    { label: t('bankDetails.name'), value: bankListData?.holderName },
    { label: t('bankDetails.bankStatement'), value: bankListData?.document ? {name: 'BANK_CHECKING' , url : bankListData?.document} : 'NA' , isLink : bankListData?.document },
];

  return (
    <>
        <Row className='my-5'>
          <Row>
            <Col className='d-flex'>
              <h5>{t("bankDetails.title")}&nbsp;</h5>
              <BForm.Check
                      type='checkbox'
                      name='bankDetails'
                      onChange={() => handleCheckboxChange('bankDetails')}
                      checked={bankDetailsChecked}

                      />
            </Col>
          </Row>
          <Row>
            <Col>
            <Row>
      <Col className='col-padding'>
        <Card className='card-overview'>
          <div className='div-overview'>
            {bankDetails?.map(({ label, value, isLink }) => {
              const signature =''
              return (
                <div key={label} className='d-flex justify-content-between m-1'>
                  <h6>{label}</h6>
                  {isLink ? 
                      <span
                      onClick={() => {
                        handleImagePreview(
                          value?.url,
                          value?.name,
                          signature
                        );
                      }}
                      className='text-link'
                      style={{ cursor: "pointer" }}
                    >
                      View Here
                    </span>
                      : 
                      <span>{value || 'NA'}</span>} 
                    </div>
                  )
                })}
          </div>
        </Card>
      </Col>
    </Row>
            </Col>
          </Row>
          </Row>
          </>
  );
};

export default BankVerificationDetails;
