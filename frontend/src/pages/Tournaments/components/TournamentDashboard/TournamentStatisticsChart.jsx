import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Spinner , Col, Row } from "@themesberg/react-bootstrap";
import Select from "react-select";
import Datetime from "react-datetime";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useTournamentStatisticsChart from "../../hooks/useTournamentStatisticsChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function transformToChartData(data) {
  const labels = [];
  const playerBetData = [];
  const playerWonData = [];
  const ggrData = [];

  data?.tournamentStatsByStartEndDate.forEach((item) => {
    labels.push(item.date);
    playerBetData.push(item.playerBet);
    playerWonData.push(item.playerWon);
    ggrData.push(item.playerGGR);
  });

  return {
    labels,
    datasets: [
      {
        label: `Player Bet ${data?.tournamentTotalBetByStartEndDate}`,
        data: playerBetData,
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        tension: 0,
      },
      {
        label: `Player Won ${data?.tournamentTotalWinByStartEndDate}`,
        data: playerWonData,
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        tension: 0,
      },
      {
        label: `GGR ${data?.tournamentGGRByStartEndDate}`,
        data: ggrData,
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        tension: 0,
      },
    ],
  };
}

const TournamentStatisticsChart = ({
  gameOptions,
  selectedGame,
  selectedPlayer,
  playerOptions,
}) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  // const [loading, setLoading] = useState(true); // State to track loading

  const {
    tournamentStatisticsData: filteredtournamentStatisticsData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setSelectedGame,
    setSelectedPlayer,
    isLoadingTournamentStatistics,
  } = useTournamentStatisticsChart({
    isUTC: true,
  });

  useEffect(() => {
    if (filteredtournamentStatisticsData) {
      const output = transformToChartData(filteredtournamentStatisticsData);
      setData(output);
      // setLoading(false); // Set loading to false once data is available
    }
  }, [filteredtournamentStatisticsData]);

  // Chart options
  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Multi-Line Chart", // Chart title
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date", // Label for X-axis,
          font: {
            weight: "bold", // Make the X-axis label bold
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Values", // Label for Y-axis
        },
      },
    },
  };

  return (
    <div>
      <Row>
        <Col sm={12} lg={4}>
          <h2>Tournament Statistics Chart</h2>
        </Col>
        <Col sm={6} lg={2} style={{ marginBottom: "1rem" }}>
          <label>
            Start Date:
            <Datetime
              value={startDate}
              onChange={setStartDate}
              dateFormat="MM-DD-YYYY"
              timeFormat={false}
              inputProps={{
                placeholder: "MM-DD-YYYY",
                closeOnSelect: true,
                readOnly: true,
              }}
            />
          </label>
        </Col>
        <Col sm={6} lg={2}>
          <label>
            End Date:
            <Datetime
              value={endDate}
              onChange={setEndDate}
              dateFormat="MM-DD-YYYY"
              timeFormat={false}
              inputProps={{
                placeholder: "MM-DD-YYYY",
                closeOnSelect: true,
                readOnly: true,
              }}
            />
          </label>
        </Col>

        <Col sm={6} lg={2} className="game-stat-select">
          <div>Game stats by game</div>
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                width: "313px",
              }),
            }}
            value={selectedGame}
            onChange={setSelectedGame}
            options={gameOptions}
            isClearable={true}
          />
        </Col>
        <Col sm={6} lg={2} className="game-stat-select">
          <div>Player stats by player</div>
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                width: "313px",
              }),
            }}
            value={selectedPlayer}
            onChange={setSelectedPlayer}
            options={playerOptions}
            isClearable={true}
          />
        </Col>
      </Row>

      {/* Loader */}
      {isLoadingTournamentStatistics ? (
        <div
          className="loader"
          style={{
            textAlign: "center",
            padding: "50px",
            height: "470px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </span>
        </div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default TournamentStatisticsChart;
