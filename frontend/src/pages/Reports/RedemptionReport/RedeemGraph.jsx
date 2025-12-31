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
import './redeemRateReport.scss'

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
      <div className='redeem-graph-container'>
        <Row className='mb-3 g-3 align-items-start'>
          <Col xs={12} md={6} lg={4}>
            <label>Redemption Metrics</label>
            <GraphYDropDown
              jackpotMetrics={jackpotMetrics}
              setJackpotMetrics={setJackpotMetrics}
            />
          </Col>

          <Col xs={12} sm={6} md={6} lg={3}>
            <label>Start Date</label>
            <Datetime
              value={startDate ? startDate : ''}
              onChange={(date) => setStartDate(date)}
              dateFormat='MM-DD-YYYY'
              timeFormat={false}
              inputProps={{ readOnly: true }}
            />
          </Col>

          <Col xs={12} sm={6} md={6} lg={3}>
            <label>End Date</label>
            <Datetime
              value={endDate ? endDate : ''}
              onChange={(date) => setEndDate(date)}
              dateFormat='MM-DD-YYYY'
              timeFormat={false}
              inputProps={{ readOnly: true }}
            />
          </Col>

          <Col xs={12} sm={6} md={6} lg={2} className="redeem-csv-col">
            <Trigger message="Download as CSV" id={"csv"} />
            <Button
              id={"csv"}
              variant="success"
              className="redeem-csv-btn"
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
                <>
                  <FontAwesomeIcon icon={faFileDownload} /> CSV
                </>
              )}
            </Button>
          </Col>

          {dateError && (
            <Col xs={12}>
              <div className='redeem-date-error text-danger fw-bold'>
                {dateError}
              </div>
            </Col>
          )}
        </Row>
      </div>

      <Col
        xs={12}
        className='redeem-graph__info-wrap mb-3'
      >
        <Trigger
          message='View Graph Info'
          id='infoBoxTrigger'
        />
        <Button
          id='infoBoxTrigger'
          variant='outline-primary'
          onClick={() => setShowInfoBox((prev) => !prev)}
          className='redeem-info-btn ms-2'
        >
          <FontAwesomeIcon icon={faInfo} />
        </Button>
      </Col>

      <Row>
        <Col xs={12}>
          {jackpotMetrics?.length === 0 ? (
            <div className='redeem-chart-empty'>
              No Metrics selected. Please select at least one.
            </div>
          ) : loading ? (
            <div className='redeem-chart-loader'>
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
        <Accordion className="redeem-report-accordion" activeKey={isAccordionOpen ? '0' : null}>
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
