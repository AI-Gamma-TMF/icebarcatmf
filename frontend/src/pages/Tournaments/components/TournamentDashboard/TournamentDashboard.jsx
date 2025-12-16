import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from '@themesberg/react-bootstrap';
import TournamentSummaryCard from './TournamentSummaryCard';
import TopTenPlayerChart from './TopTenPlayerChart';
import PlayerCountByDateChart from './PlayerCountByDateChart';
import TotaPlayerScoreChart from './TotalPlayerScoreChart';
import TournamentStatisticsChart from './TournamentStatisticsChart';
import TournamentBootedAccordion from './TournamentBootedAccordion';
import TournamentAccordion from './TournamentAccordion';
import useTournamentDashboardDetails from '../../hooks/useTournamentDashboardDetails';
import GameGGRChart from './GameGGRChart';
import PriceDistributionChart from './priceDistributionChart';

const formatePriceDistributionData = (responseData = []) => {
  const labels = [];
  const gcData = [];
  const scData = [];

  responseData?.forEach(({ position, scCoin, gcCoin }) => {
    labels.push(position);
    gcData.push(gcCoin);
    scData.push(scCoin);
  });
  return { labels, gcData, scData };
};

const formateTopTenPlayerData = (responseData = []) => {
  const labels = [];
  const winData = [];
  const betData = [];

  responseData?.forEach(({ username, win, bet }) => {
    labels.push(username);
    winData.push(win);
    betData.push(bet);
  });
  return { labels, winData, betData };
};

const formateTournamentGGRData = (responseData = [], gameMap = {}) => {
  const labels = [];
  const totalWin = [];
  const totalBet = [];
  const ggr = []

  responseData.forEach(({ gameId, totalWin: win, ggr: gameGgr, totalBet: bet }) => {
    const gameName = gameMap[gameId] || gameId;
    labels.push(gameName);
    totalWin.push(win);
    totalBet.push(bet);
    ggr.push(gameGgr);
  });

  return { labels, totalWin, totalBet, ggr };
};


const formatePlayerCountByJoinDateData = (responseData = []) => {
  const labels = [];
  const countData = [];

  responseData?.forEach(({ joinDate, playerCount }) => {
    labels.push(joinDate);
    countData.push(playerCount);
  });
  return { labels, countData };
};

const formatePlayerTotalScore = (responseData = []) => {
  const labels = [];
  const scoreData = [];

  responseData?.forEach(({ username, score }) => {
    labels.push(username);
    scoreData.push(score);
  });
  return { labels, scoreData };
};

// const formateTournamentStatisticsData = (responseData = []) => {
//   const labels = [];
//   const playerBetData = [];
//   const playerWonData = [];
//   const ggrData = [];

//   responseData.forEach((object) => {
//     const { playerBet, playerWon, playerGGR, date } = object;
//     labels.push(date);

//     playerBetData.push(playerBet);
//     playerWonData.push(playerWon);
//     ggrData.push(playerGGR);
//   });

//   return { labels, playerBetData, playerWonData, ggrData };
// };

const formatDropDownOptions = (responseData = {}) => {
  const options = [];

  Object.keys(responseData).forEach((key) => {
    options.push({ label: responseData[key], value: key });
  });
  return options;
};

const TournamentDashboard = ({
  tournamentSummaryData,
  tournamentGameIds,
  tournamentTotalPlayers,
  tournamentWinnerBootedSummary = {},
  tournamentData,
  tournamentBootedLoading,
}) => {
  const [priceDistributionData, setPriceDistributionData] = useState({
    labels: [],
    gcData: [],
    scData: [],
  });
  const [tournamentGGRData, setTournamentGGRData] = useState({
    labels: [],
    gameId: [],
    totalGGR: [],
  });
  const [topTenPlayerData, setTopTenPlayerData] = useState({
    labels: [],
    winData: [],
    betData: [],
  });
  const [playerCountJoinByDateData, setplayerCountJoinByDateData] = useState({
    labels: [],
    countData: [],
  });
  const [totalPlayerScore, setTotalPlayerScore] = useState({
    labels: [],
    scoreData: [],
  });

  const [gameOptions, setGameOptions] = useState([]);
  const [playerOptions, setPlayerOptions] = useState([]);

  // const timeZone = getItem('timezone');
  // const timezoneOffset =
  //   timeZone != null ? timeZones.find((x) => x.code === timeZone).value : getFormattedTimeZoneOffset();
  // const [timeZoneCode, setTimeZoneCode] = useState(
  //   timeZones.find((x) => x.value === timezoneOffset)?.code
  // );

  const { selectedGame, selectedPlayer } = useTournamentDashboardDetails({});

  // useEffect(() => {
  //   setTimeZoneCode(timeZones.find((x) => x.value === timezoneOffset)?.code);
  // }, [timezoneOffset]);

  useEffect(() => {
    if (tournamentTotalPlayers) {
      const formattedPlayerCountByJoinDateData = formatePlayerCountByJoinDateData(
        tournamentTotalPlayers?.playerCountJoinByDate,
      );

      const formattedPlayerTotalScore = formatePlayerTotalScore(tournamentTotalPlayers?.totalScoreOfPlayers);

      setplayerCountJoinByDateData(formattedPlayerCountByJoinDateData);

      setTotalPlayerScore(formattedPlayerTotalScore);
    }
  }, [tournamentTotalPlayers]);

  useEffect(() => {
    if (tournamentGameIds) {
      const formattedGamesOption = formatDropDownOptions(tournamentGameIds?.totalGameIdInTournament);
      const formattedPlayerOptions = formatDropDownOptions(tournamentGameIds?.totalUserIdOfPlayers);

      setGameOptions(formattedGamesOption);
      setPlayerOptions(formattedPlayerOptions);
    }
  }, [tournamentGameIds]);

  useEffect(() => {
    if (tournamentSummaryData) {
      const data = tournamentSummaryData;

      const formattedPriceDistributionData = formatePriceDistributionData(data?.priceDistribution);

      const formattedTopTenPlayerData = formateTopTenPlayerData(data?.top10Players);

      const formattedTournamentGGRData = formateTournamentGGRData(data?.gameBetWinStats, tournamentGameIds?.totalGameIdInTournament);

      setTopTenPlayerData(formattedTopTenPlayerData);

      setPriceDistributionData(formattedPriceDistributionData);

      setTournamentGGRData(formattedTournamentGGRData)

    }
  }, [tournamentSummaryData, tournamentGameIds]);

  return (
    <>
      <TournamentSummaryCard tournamentSummaryData={tournamentSummaryData} tournamentData={tournamentData} />
      <Row className='mt-4'>
        <Row className='mt-0'>
          <Col md={12} sm={12} className='my-3'>
            <Card className=' tournament-card p-2'>
              <GameGGRChart
                labels={tournamentGGRData?.labels}
                totalWin={tournamentGGRData?.totalWin}
                totalBet={tournamentGGRData?.totalBet}
                ggr={tournamentGGRData?.ggr}
              />
            </Card>
          </Col>
        </Row>
        <Row className='mt-0'>
          <Col md={6} sm={6} className='mt-3'>
            <Card className=' tournament-card p-2'>
              <PriceDistributionChart
                labels={priceDistributionData?.labels}
                gcData={priceDistributionData?.gcData}
                scData={priceDistributionData?.scData}
              />
            </Card>
          </Col>
          <Col md={6} sm={6} className='mt-3'>
            <Card className=' tournament-card p-2'>
              <TopTenPlayerChart
                labels={topTenPlayerData?.labels}
                winData={topTenPlayerData?.winData}
                betData={topTenPlayerData?.betData}
              />
            </Card>
          </Col>
        </Row>
        <Row className='mt-0'>
          <Col md={6} sm={6} className='mt-3'>
            <Card className=' tournament-card p-2'>
              <PlayerCountByDateChart
                labels={playerCountJoinByDateData.labels}
                countData={playerCountJoinByDateData.countData}
              />
            </Card>
          </Col>
          <Col md={6} sm={6} className='mt-3'>
            <Card className=' tournament-card p-2'>
              <TotaPlayerScoreChart labels={totalPlayerScore.labels} scoreData={totalPlayerScore.scoreData} />
            </Card>
          </Col>
        </Row>
        <Row className='mt-0'>
          <Col md={12} sm={12} className='my-3'>
            <Card className=' tournament-card statistics p-2'>
              <TournamentStatisticsChart
                tournamentData={tournamentData}
                gameOptions={gameOptions}
                selectedGame={selectedGame}
                selectedPlayer={selectedPlayer}
                playerOptions={playerOptions}
              />
            </Card>
          </Col>
        </Row>

        <Row>
          <TournamentBootedAccordion
            activeToggleHeader={'Booted Player'}
            list={tournamentWinnerBootedSummary?.bootedPlayers}
            tournamentData={tournamentData}
            tournamentBootedLoading={tournamentBootedLoading}
          />
        </Row>
        <Row>
          <TournamentAccordion
            activeToggleHeader={'Tournament Winners'}
            list={tournamentWinnerBootedSummary?.tournamentWinners}
            tournamentData={tournamentData}
            tournamentBootedLoading={tournamentBootedLoading}
          />
        </Row>
        <Row>
          <TournamentAccordion
            activeToggleHeader={'Top Positive GGR'}
            list={tournamentWinnerBootedSummary?.topPositiveGgr}
            tournamentData={tournamentData}
            tournamentBootedLoading={tournamentBootedLoading}
          />
        </Row>
        <Row>
          <TournamentAccordion
            activeToggleHeader={'Top Negative GGR'}
            list={tournamentWinnerBootedSummary?.topNegativeGgr}
            tournamentData={tournamentData}
            tournamentBootedLoading={tournamentBootedLoading}
          />
        </Row>
      </Row>
    </>
  );
};

export default TournamentDashboard;
