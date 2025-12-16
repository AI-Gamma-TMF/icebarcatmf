import { Card, Col, Row } from '@themesberg/react-bootstrap'
import React from 'react'
import { OverviewContainer } from '../style'
import '../playerdetails.scss'

const Overview = ({ basicInfo,
  //  userLimits, user, getUserDetails, t, alertInfo
   }) => {
  // const { userWallet } = user
  // function formatNumber(coin) {
  //   if (typeof coin !== 'number') {
  //     return coin
  //   }
  //   const formattedNumber = coin.toLocaleString('en-US', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   })
  //   return formattedNumber
  // }
  // const {
  //   data: casinoSearchData,
  // } = useGetPlayerCasinoQuery({
  //   params:
  //   {
  //     userId: user.userId,
  //   },
  // })
  // const convToStr = (value) => {
  //   if (typeof value === 'number') {
  //     return value.toFixed(2).toString()
  //   }
  //   else
  //     return Number(value).toFixed(2).toString()
  // }
  return (
    <OverviewContainer>
      <Row>
        <Col className='col-padding'>
          <Card className='card-overview my-3 mb-3'>
            <Row className='div-overview'>
              {basicInfo?.map(({ label, value, subValue }) => {
                return (
                  <Col xs={12} md={6} lg={3} key={label}>
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                      <h6 className='mb-0 me-2'>{label}</h6>
                      <span className={`${subValue} text-break`}>
                        {/* {value && label === 'Phone Code' ?`+${value}` : value || 'NA'} */}

                        {typeof value === 'boolean'
                          ? value ? 'Enabled' : 'Disabled' // Adjust this to display "Yes" or "No" for booleans
                          : label === 'Phone Code'
                            ? (`${value}`)
                            : value || 'NA'
                        }
                      </span>
                    </div>
                  </Col>
                )
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </OverviewContainer>
  )
}

export default Overview
