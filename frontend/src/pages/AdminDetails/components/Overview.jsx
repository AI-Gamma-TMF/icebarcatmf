import { Col } from '@themesberg/react-bootstrap'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { profileConstants } from '../constants'

const Overview = ({ adminDetails }) => {
  const { t } = useTranslation(['staff'])
  return (
    <>
      {adminDetails && profileConstants.map(({ key, value, subValue }, index) => {
        return (
          value !== 'password' &&
            <Col lg={4} md={4} sm={6} className='my-2' key={index}>
              <div className='bg-light py-2 px-3 rounded'>
                <label className='fw-bold'>{t(`overviewConst.${key}`)}</label>
                <p className='mb-0'>
                  {key === 'Status'
                    ? (adminDetails[value] ? 'Active' : 'In-Active')
                    : subValue ? (typeof adminDetails[value] === 'object' ? adminDetails[value][subValue] : 'N/A') : adminDetails[value]}
                </p>
              </div>
            </Col>
        )
      })}
    </>
  )
}

export default Overview
