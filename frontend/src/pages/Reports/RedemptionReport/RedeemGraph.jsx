import React, { useState, useEffect } from 'react'
import {
  Row,
  Button,
  Col,
  Spinner,
  Accordion
} from '@themesberg/react-bootstrap'
import { Line } from 'react-chartjs-2'
import Datetime from 'react-datetime'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import Trigger from '../../../components/OverlayTrigger'
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import GraphYDropDown from './GraphYDropDown'
import {
  createLineChartDataSet,
  getGraphTitle,
  getYAxisLabel
} from './redeemGraphUtils'

import { formatNumber } from '../../../utils/helper'
import useRedeemReport from './useRedeemReport'
import RedeemGraphInfoPopup from './RedeemGraphInfo'
import RedeemReport from './RedeemReport'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const RedeemGraph = () => {
  const [jackpotGraphData, setJackpotGraphData] = useState({
    labels: [],
    datasets: []
  })
  const [showInfoBox, setShowInfoBox] = useState(false)
  const isMobile = window.innerWidth <= 768

  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const handleAccordionToggle = () => {
    setIsAccordionOpen((prev) => !prev)
  }

  const {
    redeemReportData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    jackpotMetrics,
    setJackpotMetrics,
    dateError,
    setDateError,
    loading,
    setLimit,
    setPageNo,
    totalPages,
    limit,
    pageNo,downloadInProgress,handleDownloadClick
  } = useRedeemReport()

  useEffect(() => {
    if (redeemReportData) {
      const formattedData = createLineChartDataSet(
        redeemReportData?.rows,
        jackpotMetrics,
        'MM-DD'
      )
      setJackpotGraphData(formattedData)
    }
  }, [redeemReportData, jackpotMetrics])

  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate)
      const end = moment(endDate)

      if (start.isAfter(end)) {
        setDateError('Start date cannot be after End date.')
      } else {
        setDateError('')
      }
    } else {
      setDateError('')
    }
  }, [startDate, endDate])

  const integerOnlyMetrics = ['spinCount', 'totalBetCount', 'newlyOptedInUsers']
  const shouldUseIntegerY = jackpotMetrics.every((metric) =>
    integerOnlyMetrics.includes(metric.value)
  )

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: getGraphTitle(jackpotMetrics),
        font: { weight: 'bold', size: 14 }
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex
            const rawDate = redeemReportData?.rows?.[index]?.date

            return rawDate
              ? moment(rawDate).format('MM-DD-YYYY HH:mm')
              : tooltipItems[0].label
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Duration with Interval',
          font: { weight: 'bold', size: 14 }
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 14
          },
          callback: function (val, index, ticks) {
            const total = ticks.length
            const showEvery = Math.ceil(total / 10)
            return index % showEvery === 0 ? this.getLabelForValue(val) : ''
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        title: {
          display: true,
          text: getYAxisLabel(jackpotMetrics),
          font: { weight: 'bold', size: 14 }
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 14
          },
          stepSize: shouldUseIntegerY ? 1 : undefined, // force integer steps
          callback: function (value) {
            if (shouldUseIntegerY) {
              return Number.isInteger(value) ? formatNumber(value) : ''
            }
            return formatNumber(value, { isDecimal: true, decimalPlaces: 2 })
          }
        }
      }
    }
  }

  return (
    <>
      <div className='bonus-graph-container'>
        <Row className='mb-3'>
          <Col
            xs={12}
            md={12}
            lg={3}
            className='mb-3'
          >
            <label>Redemption Metrics</label>
            <GraphYDropDown
              jackpotMetrics={jackpotMetrics}
              setJackpotMetrics={setJackpotMetrics}
            />
          </Col>

          <Col
            xs={12}
            md={12}
            lg={6}
            xl={5}
            className='mb-3'
          >
            <div className='d-flex flex-column gap-2'>
              <div className='d-flex align-items-center gap-3'>
                <div>
                  <label>Start Date</label>
                  <Datetime
                    value={startDate ? startDate : ''}
                    onChange={(date) => setStartDate(date)}
                    dateFormat='MM-DD-YYYY'
                    timeFormat={false}
                    inputProps={{ readOnly: true }}
                  />
                </div>
                <div>
                  <label>End Date</label>
                  <Datetime
                    value={endDate ? endDate : ''}
                    onChange={(date) => setEndDate(date)}
                    dateFormat='MM-DD-YYYY'
                    timeFormat={false}
                    inputProps={{ readOnly: true }}
                  />
                </div>
              </div>
              {dateError && (
                <div
                  className='text-danger fw-bold'
                  style={{ marginTop: '-8px', fontSize: '12px' }}
                >
                  {dateError}
                </div>
              )}
            </div>
          </Col>
          <Col 
          xs={12}
            md={12}
            lg={4}
            xl={4}
            className='mb-3'
            >
            <Trigger message="Download as CSV" id={"csv"} />
            <Button
              id={"csv"}
              variant="success"
              style={{ marginTop: "18px" }}
              disabled={
                redeemReportData?.count === 0 ||
                redeemReportData?.count === null ||
                downloadInProgress
              }
              onClick={handleDownloadClick}
            >
              {downloadInProgress ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <FontAwesomeIcon icon={faFileDownload} />
              )}
            </Button>
          </Col>
        </Row>
      </div>

      <Col
        xs={12}
        className='mb-3'
        style={{ marginTop: '25px', display: 'flex', justifyContent: 'end' }}
      >
        <Trigger
          message='View Graph Info'
          id='infoBoxTrigger'
        />
        <Button
          id='infoBoxTrigger'
          variant='outline-primary'
          onClick={() => setShowInfoBox((prev) => !prev)}
          className='ms-2'
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            borderRadius: '50%',
            backgroundColor: '#CCCCCC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            border: 'none',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          <FontAwesomeIcon icon={faInfo} />
        </Button>
      </Col>

      <Row>
        <Col xs={12}>
          {jackpotMetrics?.length === 0 ? (
            <div
              className='text-center'
              style={{
                padding: '50px',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'red'
              }}
            >
              No Metrics selected. Please select at least one.
            </div>
          ) : loading ? (
            <div
              className='loader'
              style={{
                textAlign: 'center',
                padding: '50px',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Spinner animation='border' />
            </div>
          ) : (
            <div style={{ height: '450px', width: '100%' }}>
              <Line
                data={jackpotGraphData}
                options={options}
              />
            </div>
          )}
          {showInfoBox && (
            <RedeemGraphInfoPopup
              redeemGraphData={jackpotGraphData}
              setShowInfoBox={setShowInfoBox}
            />
          )}
        </Col>
      </Row>

      <Row className='mt-5'>
        <Accordion activeKey={isAccordionOpen ? '0' : null}>
          <Accordion.Item eventKey='0'>
            <Accordion.Header onClick={handleAccordionToggle}>
              Redeem Report
            </Accordion.Header>
            <Accordion.Body>
              <RedeemReport
                redeemReportData={redeemReportData}
                setLimit={setLimit}
                setPageNo={setPageNo}
                totalPages={totalPages}
                limit={limit}
                pageNo={pageNo}
                loading={loading}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </>
  )
}

export default RedeemGraph
