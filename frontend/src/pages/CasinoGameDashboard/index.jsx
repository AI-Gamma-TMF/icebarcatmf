import {
  faArrowCircleUp,
  faArrowCircleDown,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
} from "@themesberg/react-bootstrap";

import moment from "moment";
import { useState } from "react";
import Datetime from "react-datetime";
import Select from "react-select";

import { tableHeaders } from "./constants";
import useGameDashboardList from "./useGameDashboardList";
import PaginationComponent from "../../components/Pagination";
import { InlineLoader } from "../../components/Preloader";
import { formattedDate, getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from "../../utils/dateFormatter";
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
    <>
      {gameDashboardLoading ? (
        <InlineLoader />
      ) : (
        <>
          <Row spacing={1}>
            <h2>Game Report</h2>
          </Row>
          <Row className="mt-3">
            <Col sx={12} lg={4}>
              <Card className="vip-card light-pink">
                <img src="/svg/game-players-icon.svg" />
                <div className="card-text">
                  <p>Total Players </p>
                  <h5> {formatNumber(gameDashboardSummary?.totalPlayers)}</h5>
                </div>
              </Card>
            </Col>
            <Col sx={12} lg={4}>
              <Card className="vip-card light-green">
                <img src="/svg/game-ggr-icon.svg" />
                <div className="card-text">
                  <p>Total GGR</p>
                  <h5>
                    {" "}
                    {formatNumber(gameDashboardSummary?.totalGGR, {
                      isDecimal: true,
                    })}{" "}
                    SC
                  </h5>
                </div>
              </Card>
            </Col>

            <Col sx={12} lg={4}>
              <Card className="vip-card light-purple">
                <img src="/svg/game-bet-icon.svg" />
                <div className="card-text">
                  <p>Total Bet</p>
                  <h5>
                    {" "}
                    {formatNumber(gameDashboardSummary?.totalBet, {
                      isDecimal: true,
                    })}{" "}
                    SC
                  </h5>
                </div>
              </Card>
            </Col>
            <Col sx={12} lg={4}>
              <Card className="vip-card light-red">
                <img src="/svg/game-win-icon.svg" />
                <div className="card-text">
                  <p>Total Win</p>
                  <h5>
                    {" "}
                    {formatNumber(gameDashboardSummary?.totalWin, {
                      isDecimal: true,
                    })}{" "}
                    SC
                  </h5>
                </div>
              </Card>
            </Col>
            <Col sx={12} lg={4}>
              <Card className="vip-card cyan">
                <img src="/svg/game-rtp-icon.svg" />
                <div className="card-text">
                  <p>Total RTP</p>
                  <h5>
                    {formatNumber(gameDashboardSummary?.totalRTP, {
                      isDecimal: true,
                    })}{" "}
                    %
                  </h5>
                </div>
              </Card>
            </Col>
          </Row>
          {gameDashboardSummary?.liveTopGames &&
            gameDashboardSummary?.liveTopGames?.length > 0 && (
              <Row>
                <div className="game-container">
                  <div className="mt-5 d-flex align-items-baseline ">
                    <img
                      src="/svg/ellipse.svg"
                      height={"10px"}
                      width={"10px"}
                    />
                    <h5 className="ps-2">Live Top Game</h5>
                  </div>

                  <div className="top-game-container">
                    {gameDashboardSummary?.liveTopGames &&
                      gameDashboardSummary?.liveTopGames?.length > 0 &&
                      gameDashboardSummary?.liveTopGames
                        ?.filter((games) => games?.category === "top")
                        ?.map((game) => {
                          return (
                            <Row
                              key={game?.game_id}
                              className="top-game card-text"
                            >
                              {game?.name} :{" "}
                              {formatNumber(game?.ggr_change, {
                                isDecimal: true,
                              })}{" "}
                              GGR
                            </Row>
                          );
                        })}
                  </div>
                </div>

                <div className="game-container">
                  <div className="mt-5 d-flex align-items-baseline ">
                    <img
                      src="/svg/ellipse.svg"
                      height={"10px"}
                      width={"10px"}
                    />
                    <h5 className="ps-2">Live Least Popular Games</h5>
                  </div>

                  <div className="least-game-container">
                    {gameDashboardSummary?.liveTopGames &&
                      gameDashboardSummary?.liveTopGames?.length > 0 &&
                      gameDashboardSummary?.liveTopGames
                        ?.filter((games) => games?.category === "bottom")
                        ?.map((game) => {
                          return (
                            <Row
                              key={game?.game_id}
                              className="top-game card-text"
                            >
                              {game?.name} :{" "}
                              {formatNumber(game?.ggr_change, {
                                isDecimal: true,
                              })}{" "}
                              GGR
                            </Row>
                          );
                        })}
                  </div>
                </div>
              </Row>
            )}
        </>
      )}

      <Row className="mt-3">
        <Col sm={6} lg={2}>
          <Form.Label>Aggregator</Form.Label>
          <Select
            placeholder="Aggregator"
            options={aggregatorNameOptions}
            isClearable
            value={
              aggregatorNameOptions.find(
                (option) => option.value === aggregatorId
              ) || null
            }
            onChange={(e) => setAggregatorId(e ? e.value : null)}
          />
        </Col>
        <Col sm={6} lg={3}>
          <Form.Label>Game Provider</Form.Label>
          <Select
            placeholder="Game Provider"
            options={providerNameOptions}
            isClearable
            value={
              providerNameOptions.find(
                (option) => option.value === providerId
              ) || null
            }
            onChange={(e) => setProviderId(e ? e.value : null)}
          />
        </Col>
        <Col sm={6} lg={3}>
          <Form.Label>Game Name</Form.Label>
          <Select
            placeholder="Game Id / Game Name"
            options={gameNameOptions}
            isClearable
            value={
              gameNameOptions.find((option) => option.value === gameId) || null
            }
            onChange={(e) => setGameId(e ? e.value : null)}
            getOptionLabel={(e) => `${e?.value} - ${e?.label}`}
          />
        </Col>

        <Col sm={6} lg={2}>
          <Form.Label>
            Select Month
          </Form.Label>

          <Datetime
            dateFormat="MMMM YYYY"
            timeFormat={false}
            value={startDate}
            onChange={handleMonthYearChange}
            closeOnSelect={true} // this is key
            inputProps={{ placeholder: "Select Month", readOnly: true }}
            isValidDate={(currentDate) => {
              // Disallow future months and years
              return currentDate.isSameOrBefore(moment(), 'month');
            }}
          />
          {(errorStart || errorEnd) && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errorStart || errorEnd}
            </div>
          )}
        </Col> 
      </Row>

      <Row className="mt-3">
        <Col sm={6} lg={2}>
          <Form.Label>RTP Operator</Form.Label>
          <Form.Select
            as="select"
            name="filterOperator"
            value={selectedOperator}
            onChange={(e) => {
              setSelectedOperator(e?.target?.value);
            }}
          >
            <option value="" disabled selected hidden>
              Select RTP Operator
            </option>
            <option value="=">=</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
          </Form.Select>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Label>RTP Value</Form.Label>
          <Form.Control
            disabled={selectedOperator === ""}
            type="number"
            onKeyDown={(evt) =>
              ["e", "E", "+"].includes(evt.key) && evt.preventDefault()
            }
            name="filterValue"
            value={rtpValue}
            onChange={(e) => {
              setRtpValue(e?.target?.value);
            }}
            placeholder="Enter RTP Value"
          />
        </Col>
      </Row>
      <Row className="p-2 d-flex justify-content-between align-items-center flex-nowrap">
        <Col xs="auto">
          <h5 className="mb-0">Game Report</h5>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={handleResetFilter} type="button">
            Reset
          </Button>
          <Button
            id="csv"
            variant="success"
            style={{ marginLeft: "10px" }}
            onClick={handleDownloadClick}
            disabled={
              downloadInProgress || gameDashboardList?.games?.count === 0
            }
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

      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-2"
      >
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
          <tr>
            <td colSpan={8} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <>
            <tbody>
              {gameDashboardList?.games?.rows &&
                gameDashboardList?.games?.rows?.length > 0 ? (
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
                  <td colSpan={8} className="text-danger text-center">
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
    </>
  );
};

export default GameDashboard;
