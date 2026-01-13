import { Table, Row, Col, Form } from "@themesberg/react-bootstrap"
import moment from 'moment';
import { useState } from 'react'
import Datetime from "react-datetime";
import Select from "react-select";

import { InlineLoader } from '../../../components/Preloader'
import { formatNumber } from '../../../utils/helper'
import { providerDashboardTableHeaders } from '../constant'

const ProviderDashboardTable = ({ providerId,
  setProviderId,
  providerNameOptions,
  providerInfo,
  providerInfoLoading,
  aggregatorNameOptions,
  aggregatorId,
  setAggregatorId,
  startDate,
  setStartDate,
  endDate,
  setEndDate }) => {
  // const { isHidden } = useCheckPermission()

  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (!endDate) {
      if (date > new Date()) {
        setEndDate(date);
      } else setEndDate(new Date());
    }
    if (endDate && date && date.isAfter(endDate)) {
      setErrorStart("Start date cannot be greater than end date.");
    } else {
      setErrorEnd("");
      setErrorStart("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date && date.isBefore(startDate)) {
      setErrorEnd("End date must be greater than the start date.");
    } else {
      setErrorStart("");
      setErrorEnd("");
    }
  };

  // console.log('rateMatrixList ::', aggregatorNameOptions, providerNameOptions, totalPages, rateMatrixList);

  const handleMonthYearChange = (date, event) => {
    const selectedDate = moment(date);
    const today = moment();

    const start = selectedDate.clone().startOf("month");
    const end = selectedDate.clone().endOf("month");

    setStartDate(start);
    setEndDate(end);
    setErrorStart("");
    setErrorEnd("");
  };


  return (
    <Row className="provider-dashboard-table-section">
      <Row className="mb-2">
        <Col xs="auto">
          <h5 className="mb-0">Provider Details Table</h5>
        </Col>
      </Row>
      <Row className="provider-dashboard-filters g-3 align-items-end">
        <Col xs={12} md={6} lg={4} className="provider-dashboard-filters__col">
          <Form.Label className="provider-dashboard-filters__label">Aggregator</Form.Label>
          <Select
            placeholder="Aggregator"
            options={aggregatorNameOptions}
            isClearable
            className="gs-select"
            classNamePrefix="gs-select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            value={
              aggregatorNameOptions?.find(
                (option) => option.value === aggregatorId
              ) || null
            }
            onChange={(e) => setAggregatorId(e ? e.value : null)}
          />
        </Col>
        <Col xs={12} md={6} lg={4} className="provider-dashboard-filters__col">
          <Form.Label className="provider-dashboard-filters__label">Game Provider</Form.Label>
          <Select
            placeholder="Game Provider"
            options={providerNameOptions}
            isClearable
            className="gs-select"
            classNamePrefix="gs-select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            value={
              providerNameOptions.find(
                (option) => option.value === providerId
              ) || null
            }
            onChange={(e) => setProviderId(e ? e.value : null)}
          />
        </Col>

        {/* <Col sm={6} lg={2}>
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            Start Date
          </Form.Label>
          <Datetime
            key={startDate}
            value={startDate}
            onChange={handleStartDateChange}
            timeFormat={false}
            inputProps={{ placeholder: "MM/DD/YYYY", readOnly: true }}
          />
          {errorStart && (
            <div style={{ color: "red", marginTop: "5px" }}>{errorStart}</div>
          )}
        </Col>

        <Col sm={6} lg={2}>
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            End Date
          </Form.Label>
          <Datetime
            key={endDate || "disabled"}
            value={endDate}
            timeFormat={false}
            onChange={handleEndDateChange}
            inputProps={{
              placeholder: "MM/DD/YYYY",
              disabled: startDate === "",
              readOnly: true,
            }}
          />
          {errorEnd && (
            <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
          )}
        </Col> */}

        <Col xs={12} md={6} lg={4} className="provider-dashboard-filters__col">
          <Form.Label className="provider-dashboard-filters__label">Select Month</Form.Label>

          <Datetime
            dateFormat="MMMM YYYY"
            timeFormat={false}
            value={startDate}
            onChange={handleMonthYearChange}
            closeOnSelect={true} // this is key
            inputProps={{
              placeholder: "Select Month",
              readOnly: true,
              className: "form-control provider-dashboard-filters__month-input",
            }}
            // inputProps={{
            //   readOnly: true,
            //   placeholder: "Select Month",
            //   value:
            //     startDate && endDate
            //       ? `${moment(startDate).format("DD MMM YYYY")} - ${moment(endDate).format("DD MMM YYYY")}`
            //       : "",
            // }}
            isValidDate={(currentDate) => {
              // Disallow future months and years
              return currentDate.isSameOrBefore(moment(), 'month');
            }}
          />
          {(errorStart || errorEnd) && (
            <div className="provider-dashboard-filters__error">
              {errorStart || errorEnd}
            </div>
          )}
        </Col>

      </Row>
      <div className="provider-dashboard-table-wrap mt-4">
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="provider-dashboard-table dashboard-data-table text-center"
        >
        <thead className="thead-dark">
          <tr>
            {providerDashboardTableHeaders.map((h, idx) => (
              <th
                key={idx}
              // onClick={() => h.value !== 'action' &&
              //   h.value !== 'gameName' &&
              //   h.value !== 'winningDate' &&
              //   setOrderBy(h.value)}
              // style={{
              //   cursor: "pointer",
              // }}
              // className={selected(h) ? "border-3 border border-blue" : ""}
              >
                {h.labelKey}{" "}
                {/* {selected(h) &&
                  (sort === "ASC" ? (
                    <FontAwesomeIcon
                      style={over ? { color: "red" } : {}}
                      icon={faArrowAltCircleUp}
                      onClick={() => setSort("DESC")}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      style={over ? { color: "red" } : {}}
                      icon={faArrowAltCircleDown}
                      onClick={() => setSort("ASC")}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ))} */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {providerInfoLoading ? (
            <tr>
              <td colSpan={providerDashboardTableHeaders.length} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : providerInfo?.finalOutput?.length > 0 ? (
            providerInfo?.finalOutput.map(
              ({
                masterCasinoProviderName,
                masterGameAggregatorName,
                rate,
                totalGGR,
                lastMonthGGR,
                totalNGR,
                lastMonthNGR,
                percentageTotalGGR,
                percentageLastMonthGGR,
                rtpVersion,
                actualRTP,
                avgGgrDiscountPercentage,
                netGGR
              }) => (
                <tr key={`${masterCasinoProviderName || 'provider'}-${masterGameAggregatorName || 'agg'}-${rtpVersion || 'rtp'}`}>
                  <td>{masterCasinoProviderName || '-'}</td>
                  <td>{masterGameAggregatorName || '-'}</td>
                  <td>{rate ?? '-'}</td>

                  <td>{totalGGR !== undefined ? formatNumber(totalGGR) : '-'}</td>
                  <td>{netGGR !== undefined ? formatNumber(netGGR) : '-'}</td>
                  <td>{avgGgrDiscountPercentage !== undefined ? formatNumber(avgGgrDiscountPercentage) : '-'}</td>
                  {/* <td>{lastMonthGGR !== undefined ? formatNumber(lastMonthGGR) : '-'}</td> */}
                  <td>{totalNGR !== undefined ? formatNumber(totalNGR) : '-'}</td>
                  {/* <td>{lastMonthNGR !== undefined ? formatNumber(lastMonthNGR) : '-'}</td> */}

                  <td>{percentageTotalGGR ?? '-'}</td>
                  {/* <td>{percentageLastMonthGGR ?? '-'}</td> */}
                  <td>{rtpVersion ?? '-'}</td>
                  <td
                    className={`${!actualRTP || isNaN(+actualRTP) || +actualRTP === 0
                      ? ""
                      : +actualRTP > 95
                        ? "text-danger"
                        : "text-success"
                      }`}
                  >
                    {+actualRTP
                      ? `${formatNumber(actualRTP, { isDecimal: true })} %`
                      : "-"}
                  </td>
                </tr>

              )
            )
          ) : (
            <tr>
              <td colSpan={providerDashboardTableHeaders.length} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="tfoot-dark ">
          <tr>
            <td>Total</td>
            <td></td>
            <td></td>

            <td>{formatNumber(providerInfo?.totalGGRSum, { isDecimal: true })}</td>
            <td></td>
            <td></td>
            {/* <td>{formatNumber(providerInfo?.totalLastMonthGGRSum, { isDecimal: true })}</td> */}
            <td>{formatNumber(providerInfo?.totalNGRSum, { isDecimal: true })}</td>
            {/* <td>{formatNumber(providerInfo?.lastMonthNGRSum, { isDecimal: true })}</td> */}

            <td>{formatNumber(providerInfo?.percentageTotalGGRSum, { isDecimal: true })}</td>
            {/* <td>{formatNumber(providerInfo?.percentageLastMonthGGRSum, { isDecimal: true })}</td> */}
            <td></td>
            <td></td>
          </tr>
        </tfoot>
        </Table>
      </div>

      {/* {rateMatrixList?.finalOutput !== 0 && (
        <PaginationComponent
          page={rateMatrixList?.finalOutput < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )} */}
    </Row>
  )
}

export default ProviderDashboardTable