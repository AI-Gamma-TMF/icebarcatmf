import {
  faArrowCircleUp,
  faArrowCircleDown,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Card, Table, Button, Form } from "@themesberg/react-bootstrap";

import moment from "moment";
import { useState } from "react";
import Datetime from "react-datetime";
import Select from "react-select";

import { tableHeaders } from "./constants";
import useGameDashboardList from "./useGameDashboardList";
import PaginationComponent from "../../components/Pagination";
import { InlineLoader } from "../../components/Preloader";
import {
  formattedDate,
  getFirstDayOfCurrentMonth,
  getLastDayOfCurrentMonth,
} from "../../utils/dateFormatter";
import { formatNumber, onDownloadCsvClick } from "../../utils/helper";

import "./_gameDashboard.scss";

const GameDashboard = () => {
  const {
    gameDashboardList,
    isLoading,
    setPage,
    page,
    limit,
    setLimit,
    sort,
    setSort,
    setOrderBy,
    over,
    setOver,
    totalPages,
    setGameId,
    gameId,
    setAggregatorId,
    aggregatorId,
    setProviderId,
    providerId,
    gameDashboardSummary,
    gameDashboardLoading,
    selected,
    gameNameOptions,
    providerNameOptions,
    aggregatorNameOptions,
    getCsvDownloadUrl,
    rtpValue,
    setRtpValue,
    selectedOperator,
    setSelectedOperator,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useGameDashboardList();

  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [errorEnd, setErrorEnd] = useState('');
  const [errorStart, setErrorStart] = useState('');

  const handleDownloadClick = async () => {
    try {
      const formattedStartDate = formattedDate(startDate);
      const formattedEndDate = formattedDate(endDate);
      const baseFilename = "game_dashboard_report";
      const parts = [
        aggregatorId,
        providerId,
        gameId,
        formattedStartDate,
        formattedEndDate,
      ].filter((value) => value !== "");

      const filename =
        parts.length > 0 ? `${baseFilename}_${parts.join("_")}` : baseFilename;

      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename);
    } catch (_error) {
      // console.error("Error downloading CSV:", error);
    } finally {
      setDownloadInProgress(false);
    }
  };


  const handleResetFilter = () => {
    setOrderBy("totalUniquePlayers");
    setLimit(15);
    setPage(1);
    setGameId("");
    setAggregatorId("");
    setProviderId("");
    setSort("DESC");
    setOver(false);
    setRtpValue("");
    setSelectedOperator("");
    setStartDate(moment(getFirstDayOfCurrentMonth()));
    setEndDate(moment(getLastDayOfCurrentMonth()));
  };

  const handleMonthYearChange = (date, _event) => {
    const selectedDate = moment(date);
    // const today = moment();

    const start = selectedDate.clone().startOf("month");
    const end = selectedDate.clone().endOf("month");

    setStartDate(start);
    setEndDate(end);
    setErrorStart("");
    setErrorEnd("");
  };

  return (
    <div className="game-dashboard-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col>
          <h3 className="game-dashboard-page__title">Game Dashboard</h3>
        </Col>
      </Row>

      <div className="game-dashboard-summary dashboard-boxes-container">
        <div className="dashboard-box">
          <div className="ticker-label">
            <img src="/svg/game-players-icon.svg" alt="Total Players" />
            <label>Total Players</label>
          </div>
          <div className="value-wrap">
            <div className="live-report-data">{formatNumber(gameDashboardSummary?.totalPlayers)}</div>
            <div className="new-icon">
              <img src="/svg/game-players-icon.svg" alt="" />
            </div>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="ticker-label">
            <img src="/svg/game-ggr-icon.svg" alt="Total GGR" />
            <label>Total GGR</label>
          </div>
          <div className="value-wrap">
            <div className="live-report-data">
              {formatNumber(gameDashboardSummary?.totalGGR, { isDecimal: true })} SC
            </div>
            <div className="new-icon">
              <img src="/svg/game-ggr-icon.svg" alt="" />
            </div>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="ticker-label">
            <img src="/svg/game-bet-icon.svg" alt="Total Bet" />
            <label>Total Bet</label>
          </div>
          <div className="value-wrap">
            <div className="live-report-data">
              {formatNumber(gameDashboardSummary?.totalBet, { isDecimal: true })} SC
            </div>
            <div className="new-icon">
              <img src="/svg/game-bet-icon.svg" alt="" />
            </div>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="ticker-label">
            <img src="/svg/game-win-icon.svg" alt="Total Win" />
            <label>Total Win</label>
          </div>
          <div className="value-wrap">
            <div className="live-report-data">
              {formatNumber(gameDashboardSummary?.totalWin, { isDecimal: true })} SC
            </div>
            <div className="new-icon">
              <img src="/svg/game-win-icon.svg" alt="" />
            </div>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="ticker-label">
            <img src="/svg/game-rtp-icon.svg" alt="Total RTP" />
            <label>Total RTP</label>
          </div>
          <div className="value-wrap">
            <div className="live-report-data">
              {formatNumber(gameDashboardSummary?.totalRTP, { isDecimal: true })} %
            </div>
            <div className="new-icon">
              <img src="/svg/game-rtp-icon.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      {gameDashboardLoading && <InlineLoader />}

      {gameDashboardSummary?.liveTopGames?.length > 0 && (
        <Row className="g-3 mb-2">
          <Col md={6}>
            <div className="game-dashboard-highlight ticker-container">
              <div className="game-dashboard-highlight__header">
                <h4 className="game-dashboard-highlight__title">Live Top Games</h4>
              </div>
              <div className="game-dashboard-highlight__list">
                {gameDashboardSummary?.liveTopGames
                  ?.filter((g) => g?.category === "top")
                  ?.map((game) => (
                    <div key={game?.game_id} className="game-dashboard-live-item">
                      <span className="game-dashboard-live-item__name">{game?.name}</span>
                      <span className="game-dashboard-live-item__value">
                        {formatNumber(game?.ggr_change, { isDecimal: true })} GGR
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="game-dashboard-highlight ticker-container">
              <div className="game-dashboard-highlight__header">
                <h4 className="game-dashboard-highlight__title">Live Least Popular Games</h4>
              </div>
              <div className="game-dashboard-highlight__list">
                {gameDashboardSummary?.liveTopGames
                  ?.filter((g) => g?.category === "bottom")
                  ?.map((game) => (
                    <div key={game?.game_id} className="game-dashboard-live-item">
                      <span className="game-dashboard-live-item__name">{game?.name}</span>
                      <span className="game-dashboard-live-item__value">
                        {formatNumber(game?.ggr_change, { isDecimal: true })} GGR
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Card className="p-2 mb-2 game-dashboard-page__card">
        <Row className="dashboard-filters game-dashboard-filters g-3 align-items-end">
          <Col xs={12} md={3}>
            <Form.Label className="form-label">Aggregator</Form.Label>
            <Select
              className="gd-select"
              classNamePrefix="gd-select"
              placeholder="Aggregator"
              options={aggregatorNameOptions}
              isClearable
              value={aggregatorNameOptions.find((o) => o.value === aggregatorId) || null}
              onChange={(e) => setAggregatorId(e ? e.value : "")}
            />
          </Col>

          <Col xs={12} md={3}>
            <Form.Label className="form-label">Game Provider</Form.Label>
            <Select
              className="gd-select"
              classNamePrefix="gd-select"
              placeholder="Game Provider"
              options={providerNameOptions}
              isClearable
              value={providerNameOptions.find((o) => o.value === providerId) || null}
              onChange={(e) => setProviderId(e ? e.value : "")}
            />
          </Col>

          <Col xs={12} md={4}>
            <Form.Label className="form-label">Game Name</Form.Label>
            <Select
              className="gd-select"
              classNamePrefix="gd-select"
              placeholder="Game Id / Game Name"
              options={gameNameOptions}
              isClearable
              value={gameNameOptions.find((o) => o.value === gameId) || null}
              onChange={(e) => setGameId(e ? e.value : "")}
              getOptionLabel={(e) => `${e?.value} - ${e?.label}`}
            />
          </Col>

          <Col xs={12} md={2}>
            <Form.Label className="form-label">Select Month</Form.Label>
            <Datetime
              dateFormat="MMMM YYYY"
              timeFormat={false}
              value={startDate}
              onChange={handleMonthYearChange}
              closeOnSelect={true}
              inputProps={{ placeholder: "Select Month", readOnly: true }}
              isValidDate={(currentDate) => currentDate.isSameOrBefore(moment(), "month")}
            />
            {(errorStart || errorEnd) && (
              <div className="game-dashboard-error">{errorStart || errorEnd}</div>
            )}
          </Col>

          <Col xs={12} md={2}>
            <Form.Label className="form-label">RTP Operator</Form.Label>
            <Form.Select
              name="filterOperator"
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e?.target?.value)}
            >
              <option value="" disabled hidden>
                Select RTP Operator
              </option>
              <option value="=">=</option>
              <option value=">=">&gt;=</option>
              <option value="<=">&lt;=</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={3}>
            <Form.Label className="form-label">RTP Value</Form.Label>
            <Form.Control
              disabled={selectedOperator === ""}
              type="number"
              onKeyDown={(evt) => ["e", "E", "+"].includes(evt.key) && evt.preventDefault()}
              name="filterValue"
              value={rtpValue}
              onChange={(e) => setRtpValue(e?.target?.value)}
              placeholder="Enter RTP Value"
            />
          </Col>

          <Col xs={12} md="auto" className="ms-auto d-flex gap-2">
            <Button variant="secondary" onClick={handleResetFilter} type="button">
              Reset
            </Button>
            <Button
              id="csv"
              variant="success"
              onClick={handleDownloadClick}
              disabled={downloadInProgress || gameDashboardList?.games?.count === 0}
            >
              {downloadInProgress ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              ) : (
                <FontAwesomeIcon icon={faFileDownload} />
              )}
            </Button>
          </Col>
        </Row>

        <div className="dashboard-section-divider" />

        <div className="game-dashboard-table-wrap table-responsive">
          <Table bordered striped hover size="sm" className="dashboard-data-table game-dashboard-table">
        <thead className="thead-dark ">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header.value}
                onClick={() =>
                  header.value !== 'masterCasinoGameName' &&
                  header.value !== 'masterCasinoProviderName' &&
                  header.value !== 'masterGameAggregatorId' &&
                  header.value !== 'providerRTP' &&
                  header.value !== 'RTP' &&
                  setOrderBy(header?.value)
                }
                style={{
                  cursor: (header.value !== 'masterCasinoGameName' &&
                    header.value !== 'masterCasinoProviderName' &&
                    header.value !== 'masterGameAggregatorId' &&
                    header.value !== 'providerRTP' &&
                    header.value !== 'RTP')
                    && 'pointer'
                }}
                className={
                  selected(header) ? "border-3 border border-blue" : ""
                }
              >
                {header.labelKey}{" "}
                {selected(header) &&
                  (sort === "ASC" ? (
                    <FontAwesomeIcon
                      style={over ? { color: "red" } : {}}
                      icon={faArrowCircleUp}
                      onClick={() => setSort("DESC")}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      style={over ? { color: "red" } : {}}
                      icon={faArrowCircleDown}
                      onClick={() => setSort("ASC")}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={tableHeaders.length} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            <tbody>
              {gameDashboardList?.games?.rows && gameDashboardList?.games?.rows?.length > 0 ? (
                gameDashboardList?.games?.rows?.map((game) => {
                  return (
                    <tr key={game?.gameId}>
                      <td>{game?.gameId || "NA"}</td>
                      <td>{game?.masterCasinoGameName || "NA"}</td>
                      <td>{game?.masterCasinoProviderName || "NA"}</td>
                      <td>{game?.masterGameAggregatorName || "NA"}</td>
                      {/* <td style={{ display: "flex", justifyContent: "center" }}>
                        <ProgressBar
                          currentPlayer={+game?.totalUniquePlayers || 0}
                          totalPlayer={gameDashboardSummary?.totalPlayers || 1}
                        />
                        {"  "}
                        {+game?.totalUniquePlayers
                          ? formatNumber(+game.totalUniquePlayers)
                          : "NA"}
                      </td> */}
                      <td>
                        {formatNumber(game?.total_bets, { isDecimal: true }) ||
                          "NA"}
                      </td>
                      <td>
                        {formatNumber(game?.total_wins, { isDecimal: true }) ||
                          "NA"}
                      </td>
                      <td>
                        {formatNumber(game?.ggr, { isDecimal: true }) || "NA"}
                      </td>
                      <td>
                        {formatNumber(game?.netGgr, { isDecimal: true }) || "NA"}
                      </td>
                      <td>
                        {game?.ggrDiscountPercentage != null
                          ? formatNumber(game?.ggrDiscountPercentage, { isDecimal: true })
                          : "-"}
                      </td>
                      <td
                        className={`${!game?.providerRTP || isNaN(+game.providerRTP) || +game.providerRTP === 0
                          ? ""
                          : +game.providerRTP > 100
                            ? "text-danger"
                            : "text-success"
                          }`}
                      >
                        {+game?.providerRTP
                          ? `${formatNumber(game?.providerRTP, { isDecimal: true })} %`
                          : "-"}
                      </td>
                      <td
                        className={`${!game?.RTP || isNaN(+game.RTP) || +game.RTP === 0
                          ? ""
                          : +game.RTP > 100
                            ? "text-danger"
                            : "text-success"
                          }`}
                      >
                        {+game?.RTP
                          ? `${formatNumber(game?.RTP, { isDecimal: true })} %`
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-danger text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="tfoot-dark ">
              <tr>
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{formatNumber(gameDashboardList?.footerTotals?.totalBetSum, { isDecimal: true })}</td>
                <td>{formatNumber(gameDashboardList?.footerTotals?.totalWinSum, { isDecimal: true })}</td>
                <td>{formatNumber(gameDashboardList?.footerTotals?.totalGGR, { isDecimal: true })}</td>
                <td></td>
                <td></td>
                <td>{formatNumber(gameDashboardList?.footerTotals?.totalProviderRTP, { isDecimal: true })} % {"  "}**</td>
                <td>{formatNumber(gameDashboardList?.footerTotals?.totalSystemRTP, { isDecimal: true })} % {"  "}**</td>
                {/* <td>
                  {totalBets > 0 && totalWin > 0
                    ? `${formatNumber((totalWin / totalBets) * 100, {
                        isDecimal: true,
                      })} `
                    : 0.0}{" "}
                  % {"  "}**
                </td> */}
              </tr>
            </tfoot>
          </>
        )}
      </Table>
        </div>
      {/* <Row className="ms-1 mt-1 fw-bold">
        * Note : The total unique players count is updated every hour.
      </Row> */}
      <Row className="ms-1 mt-1 fw-bold">
        {" "}
        ** The Total RTP displayed in the table footer is calculated as (Sum of RTP
        ÷ Number of Rows), based on the values shown in the
        table only.
      </Row>

      {gameDashboardList?.games?.count !== 0 && (
        <PaginationComponent
          page={gameDashboardList?.games?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      </Card>
    </div>
  );
};

export default GameDashboard;
