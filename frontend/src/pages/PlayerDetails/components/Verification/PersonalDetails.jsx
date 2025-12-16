import React from "react";
import { Row, Col, Card, Form as BForm } from "@themesberg/react-bootstrap";
import { useTranslation } from 'react-i18next'
import { formatDateYMD } from "../../../../utils/dateFormatter";


const PersonalDetails = ({ basicInfo, handleCheckboxChange, personalInfoChecked, handleImagePreview }) => {
  const { t } = useTranslation('verification')

  const personalDetails = [
    { label: t('personalDetails.firstName'), value: basicInfo?.firstName },
    { label: t('personalDetails.middleName'), value: basicInfo?.middleName },
    { label: t('personalDetails.lastName'), value: basicInfo?.lastName },
    { label: t('personalDetails.dob'), value: formatDateYMD(basicInfo?.dateOfBirth) },
    { label: t('personalDetails.gender'), value: basicInfo?.gender },
    { label: t('personalDetails.addLine1'), value: basicInfo?.addressLine_1 },
    { label: t('personalDetails.addLine2'), value: basicInfo?.addressLine_2 },
    { label: t('personalDetails.city'), value: basicInfo?.city },
    { label: t('personalDetails.zipCode'), value: basicInfo?.zipCode },
    { label: t('personalDetails.state'), value: basicInfo?.state },
    { label: t('personalDetails.country'), value: basicInfo?.country },
    { label: t('personalDetails.proofOfID'), value: basicInfo?.idProof ? {name: 'PROOF_OF_ID' , url: basicInfo?.idProof} : 'NA' , isLink : basicInfo?.idProof},
    { label: t('personalDetails.proofOfAdd'), value: basicInfo?.addressProof ? {name: 'PROOF_OF_ADDRESS' ,url: basicInfo?.addressProof} : 'NA' , isLink : basicInfo?.addressProof}
  ];

  return (
    <>
      <Row className='my-5 w-100 m-auto'>
        <Row className='w-100 m-auto p-0'>
          <Col className='d-flex'>
            <h5>{t("personalDetails.title")}&nbsp;</h5>
            <BForm.Check
              type='checkbox'
              name='personalDetailsVerified'
              onChange={() => handleCheckboxChange('personalDetailsVerified')}
              checked={personalInfoChecked}
            />
          </Col>
        </Row>
        <Row className='w-100 m-auto p-0'>
          <Col className='col-padding'>
            <Card className='card-overview'>
              <div className='div-overview row'>
                {personalDetails?.map(({ label, value , isLink }) => {
                  const signature = ''
                  return (
                    <div key={label} className='col-lg-4 col-md-6 col-12'>
                    <div className="player-basic-info d-flex justify-content-between align-items-center mb-2">
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
                    </div>
                  )
                })}
              </div>
            </Card>
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default PersonalDetails;
