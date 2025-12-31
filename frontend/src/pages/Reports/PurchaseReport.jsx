import React, { useState } from "react";
import { Table, Button, Col, Row, Form, Card } from "@themesberg/react-bootstrap";
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
import "./purchaseReport.scss";
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

  const resetFilters = () => {
    setSearch('');
    setLimit(15);
    setPageNo(1);
    setFilterBy('');
    setFilterOperator('');
    setFilterValue('');
  };

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
      <div className="purchase-report-page dashboard-typography">
        <Row className="d-flex align-items-center mb-2">
          <Col sm={8}>
            <h3 className="purchase-report-page__title">Purchase Report</h3>
            <div className="purchase-report-page__subtitle">
              {typeof purchaseReportData?.count === "number" ? `${purchaseReportData.count} records` : ""}
            </div>
          </Col>

          <Col sm={4} className="d-flex justify-content-end gap-2">
            <Trigger message="Download as CSV" id={"csv"} />
            <Button
              id={"csv"}
              variant="success"
              size="sm"
              className="purchase-report-page__action-btn"
              onClick={handleDownloadClick}
              disabled={downloadInProgress || purchaseReportData?.count === 0}
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
        </Row>

        <Card className="p-2 mb-2 purchase-report-page__card">
          <Row className="dashboard-filters purchase-report-filters g-3 align-items-end">
            <Col xs={12} md={4}>
              <Form.Label className="form-label">Search</Form.Label>
              <Form.Control
                className="purchase-report-filters__control"
                type="search"
                value={search}
                placeholder="Username / Email / UserId"
                onChange={(event) => {
                  setPageNo(1);
                  setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
                }}
              />
            </Col>

            <Col xs={12} md={3}>
              <Form.Label className="form-label">Filter By</Form.Label>
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

            <Col xs={12} md={2}>
              <Form.Label className="form-label">Operator</Form.Label>
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
                <option value=">=">{`>=`}</option>
                <option value="<">{`<`}</option>
                <option value="<=">{`<=`}</option>
                <option value="!=">{`!=`}</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={2}>
              <Form.Label className="form-label">Value</Form.Label>
              <Form.Control
                className="purchase-report-filters__control"
                type="number"
                onKeyDown={(evt) => ["e", "E", "+"].includes(evt.key) && evt.preventDefault()}
                name="filterValue"
                value={filterValue}
                onChange={(e) => setFilterValue(e?.target?.value)}
                placeholder="Enter Value"
                disabled={!filterOperator}
              />
            </Col>

            <Col xs={12} md="auto" className="ms-auto d-flex justify-content-end">
              <Trigger message="Reset Filters" id={"redo"} />
              <Button
                id={"redo"}
                variant="success"
                className="purchase-report-page__reset-btn"
                onClick={resetFilters}
              >
                <FontAwesomeIcon icon={faRedoAlt} />
              </Button>
            </Col>
          </Row>

          <div className="dashboard-section-divider" />

          <div className="table-responsive purchase-report-table-wrap">
            <Table hover size="sm" className="dashboard-data-table purchase-report-table text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== '' && handlePlayerTableSorting(h)}
                      style={{ cursor: h.value !== '' ? "pointer" : "default" }}
                      className={selected(h) ? "border-3 border border-blue" : ""}
                    >
                      {h.labelKey}{" "}
                      {selected(h) &&
                        (sortBy === "asc" ? (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowCircleUp}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSortBy("desc");
                            }}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowCircleDown}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSortBy("asc");
                            }}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ))}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading && !purchaseReportData?.rows?.length ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : purchaseReportData?.rows?.length > 0 ? (
                  <>
                    {purchaseReportData.rows.map((data) => (
                      <tr key={data.userId} className="text-center">
                        <td>{data.userId}</td>
                        <td className="purchase-report-table__truncate">{data?.email}</td>
                        <td className="purchase-report-table__truncate">{data?.username}</td>
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
                    ))}

                    {loading ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="text-center">
                          <InlineLoader />
                        </td>
                      </tr>
                    ) : null}
                  </>
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center">
                      <span className="purchase-report-empty">No data Found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {purchaseReportData?.count !== 0 ? (
            <div className="purchase-report-page__pagination">
              <PaginationComponent
                page={purchaseReportData?.count < pageNo ? setPageNo(1) : pageNo}
                totalPages={totalPages}
                setPage={setPageNo}
                limit={limit}
                setLimit={setLimit}
              />
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
};

export default PurchaseReport;
