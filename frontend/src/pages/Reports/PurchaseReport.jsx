import React, { useState } from "react";
import { Table, Button, Col, Row, Form } from "@themesberg/react-bootstrap";
import { InlineLoader } from "../../components/Preloader";
import PaginationComponent from "../../components/Pagination";
import usePurchaseReport from "./hooks/usePurchaseReport";
import Trigger from "../../components/OverlayTrigger";
import { faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import { faFileDownload, faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { convertToTimeZone, formatPriceWithCommas, getFormattedTimeZoneOffset, onDownloadCsvClick } from "../../utils/helper";
import { tableHeaders } from "./constant";
import { getDateTime } from "../../utils/dateFormatter";
import { timeZones } from "../Dashboard/constants";
import { getItem } from "../../utils/storageUtils";
const PurchaseReport = () => {

  const [downloadInProgress, setDownloadInProgress] = useState(false)
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();
  const {
    purchaseReportData,
    setLimit,
    setPageNo,
    totalPages,
    limit,
    pageNo,
    loading,
    getCsvDownloadUrl,
    search,
    setSearch,
    filterOperator,
    setFilterOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue, sortBy, setSortBy, orderBy, setOrderBy, over, setOver
  } = usePurchaseReport();
  const handlePlayerTableSorting = (param) => {
    if (param.value === orderBy) {
      setSortBy(sortBy === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(param.value)
      setSortBy('asc')
    }
  }
  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'
  const handleDownloadClick = async () => {
    try {
      let filename = 'Purchase_Report'

      if (search) {
        filename += `_${search}`
      }

      setDownloadInProgress(true)
      const url = getCsvDownloadUrl()
      await onDownloadCsvClick(url, filename)
    } catch (error) {
      console.error('Error downloading CSV:', error)
    } finally {
      setDownloadInProgress(false)
    }
  }
  return (
    <>
      <Row className="mb-3">
        <Col sm={12}>
          <h3>Purchase Report</h3>
        </Col>
      </Row>


      <Row className="mt-4">
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label>Search by Username or Email or UserId</Form.Label>
          <Form.Control
            type="search"
            value={search}
            placeholder="Search by Username or Email or UserId"
            onChange={(event) => {
              setPageNo(1);
              setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
            }}
          //isInvalid={!!error}
          />

        </Col>
        <Col sm={6} lg={2}>
          <Form.Label column="sm">Filter By</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPageNo(1);
              setFilterBy(e.target.value);
            }}
            value={filterBy}
          >
            <option hidden>Select value</option>
            <option value="ngr">NGR</option>
            <option value="purchase">Purchase</option>
            <option value="redeem">Redeem</option>
            <option value="play">Play</option>
            <option value="balance">Balance</option>
            <option value="win">Win</option>
            <option value="ggr">GGR</option>
            <option value="playThrough">PlayThrough</option>
            <option value="totalPendingRedemptionAmount">Total Pending Redemption Amount</option>
          </Form.Select>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Label column="sm">Operator</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPageNo(1);
              setFilterOperator(e.target.value);
            }}
            value={filterOperator}
            disabled={!filterBy}
          >
            <option hidden>Select Operator</option>
            <option value="=">=</option>
            <option value=">">{`>`}</option>
            <option value=">=">{`>=`}</option> <option value="<">{`<`}</option>{" "}
            <option value="<=">{`<=`}</option>
            <option value="!=">{`!=`}</option>
          </Form.Select>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Label>Value</Form.Label>
          <Form.Control
            type="number"
            onKeyDown={(evt) =>
              ["e", "E", "+"].includes(evt.key) && evt.preventDefault()
            }
            name="filterValue"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e?.target?.value);
            }}
            placeholder="Enter Value"
            disabled={!filterOperator}
          />
        </Col>
        <Col xs='12' sm='6' lg='1' className='d-flex align-items-center mt-3 mb-0'>
          <Trigger
            message='Reset Filters'
            id={'redo'}
          />
          <Button
            id={'redo'}
            variant='success'
            onClick={() => {
              setSearch('')
              setLimit(15)
              setPageNo(1),
                setFilterBy('')
              setFilterOperator('')
              setFilterValue('')
            }}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>

          <Trigger
            message='Download as CSV'
            id={'csv'}
          />
          <Button
            id={'csv'}
            variant='success'
            style={{ marginLeft: '10px' }}
            onClick={handleDownloadClick}
            disabled={downloadInProgress || purchaseReportData?.count === 0}
          >
            {downloadInProgress ? (
              <span
                className='spinner-border spinner-border-sm'
                role='status'
                aria-hidden='true'
              ></span>
            ) : (
              <FontAwesomeIcon icon={faFileDownload} />
            )}
          </Button>
        </Col>
      </Row>
      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-4"
      >
        <thead className="thead-dark">
          <tr>
            {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() =>
                  h.value !== '' && handlePlayerTableSorting(h)
                }
                style={{
                  cursor: 'pointer'
                }}
                className={selected(h) ? 'border-3 border border-blue' : ''}
              >
                {h.labelKey}

                {selected(h) &&
                  (sortBy === 'asc' ? (
                    <FontAwesomeIcon
                      style={over ? { color: 'red' } : {}}
                      icon={faArrowCircleUp}
                      onClick={() => setSortBy('desc')}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      style={over ? { color: 'red' } : {}}
                      icon={faArrowCircleDown}
                      onClick={() => setSortBy('asc')}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {purchaseReportData && purchaseReportData?.rows?.length > 0 ? (
              purchaseReportData?.rows?.map((data) => {
                return (
                  <tr key={data.userId} className="text-center">
                    <td>{data.userId}</td>
                    <td>{data?.email}</td>
                    <td>{data?.username}</td>
                    <td>{formatPriceWithCommas(data?.purchase)}</td>
                    <td>{formatPriceWithCommas(data?.redeem)}</td>
                    <td>{formatPriceWithCommas(data?.totalPendingRedemptionAmount)}</td>
                    <td>{formatPriceWithCommas(data?.balance)}</td>
                    <td>{formatPriceWithCommas(data?.play)}</td>
                    <td>{formatPriceWithCommas(data?.win)}</td>
                    <td>{formatPriceWithCommas(data?.NGR)}</td>
                    <td>{formatPriceWithCommas(data?.playThrough)}</td>
                    <td>{formatPriceWithCommas(data?.GGR)}</td>
                    <td>{data?.cancelledRedemptionCount}</td>
                    <td>{data?.totalRedemptionCount}</td>
                    <td>{data?.totalPurchaseCount}</td>
                    <td>{data?.pendingRedemptionCount}</td>
                    <td>{data?.completedRedemptionCount}</td>
                    <td>{data?.disabledUser ? "True" : "False"}</td>
                    <td>{getDateTime(convertToTimeZone(data?.lastLoginDate, timezoneOffset))}</td>
                    <td>{getDateTime(convertToTimeZone(data?.registrationDate, timezoneOffset))}</td>
                    <td>{data?.affiliateId ? data?.affiliateId : "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={25} className="text-danger text-center">
                  No data Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>

      {purchaseReportData?.count !== 0 && (
        <PaginationComponent
          page={purchaseReportData?.count < pageNo ? setPageNo(1) : pageNo}
          totalPages={totalPages}
          setPage={setPageNo}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default PurchaseReport;
