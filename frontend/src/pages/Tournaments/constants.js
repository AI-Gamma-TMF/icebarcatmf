export const tableHeaders = [
  { labelKey: 'tournaments.headers.tournamentId', value: 'tournamentId' },
  { labelKey: 'tournaments.headers.startDate', value: '' },
  { labelKey: 'tournaments.headers.endDate', value: '' },
  { labelKey: 'tournaments.headers.name', value: 'title' },
  { labelKey: 'tournaments.headers.entryAmount', value: 'entryAmount' },
  { labelKey: 'tournaments.headers.status', value: 'status' },
  { labelKey: 'tournaments.headers.entryAmountType', value: 'entryCoin' },
  { labelKey: 'tournaments.headers.actions', value: '' },
]

export const leaderTableHeaders = [
  { labelKey: 'Rank', value: '' },
  { labelKey: 'User Id', value: 'userId' },
  { labelKey: 'Username', value: 'username' },
  { labelKey: 'Email', value: '' },
  { labelKey: 'Score', value: '' },
  { labelKey: 'Joining Time', value: '' },
  { labelKey: 'Game Play (Bet)', value: '' },
  { labelKey: 'Game Play (Win)', value: '' },

  { labelKey: 'Player GGR', value: '' },
  { labelKey: 'Winner', value: '' },
  { labelKey: 'scWinAmount', value: ''},
  { labelKey: 'gcWinAmount', value: ''},
  { labelKey: 'Status', value: '' },
  { labelKey: 'Action', value: '' }
]

export const payoutTournamentData = [
  { labelKey: 'Rank', value: '' },
  { labelKey: 'Username', value: 'username' },
  { labelKey: 'Email', value: '' },
  { labelKey: 'Score', value: 'score' },
  // { labelKey: 'SC Bet', value: '' },
  // { labelKey: 'GC Bet', value: '' },
  { labelKey: 'Player Bet', value: '' },
  { labelKey: 'Player Win', value: '' },
]

export const initialWinnerPercentage = {
  1: [100],
  2: [50, 50],
  3: [50, 30, 20],
  4: [40, 30, 20, 10],
  5: [35, 30, 20, 10, 5]
}


export const TournamentDashboardHeader = [
  { labelKey: 'userId', value: 'userId' },
  { labelKey: 'Username', value: 'username' },
 { labelKey: 'Email', value: 'email' },
 { labelKey: 'Joined At', value: 'createdAt' },
 { labelKey: 'Score', value: 'score' },
//  { labelKey: 'SC Bet', value: '' },
//  { labelKey: 'GC Bet', value: '' },
{ labelKey: 'Game Play (Bet)', value: 'playerBet' },
{ labelKey: 'Game Play (Win)', value: 'playerWin' },
 { labelKey: 'scWinAmount', value: 'scWinAmount'},
 { labelKey: 'gcWinAmount', value: 'gcWinAmount'},
 { labelKey: 'Player GGR', value: 'ggr' },
 { labelKey: 'Winner', value: '' },
]

export const TournamentDashboardBootHeader = [
  { labelKey: 'userId', value: 'userId' },
  { labelKey: 'Username', value: 'username' },
 { labelKey: 'Email', value: 'email' },
 { labelKey: 'Joined At', value: 'createdAt' },
 { labelKey: 'Score', value: 'score' },
//  { labelKey: 'SC Bet', value: '' },
//  { labelKey: 'GC Bet', value: '' },
{ labelKey: 'Game Play (Bet)', value: 'playerBet' },
{ labelKey: 'Game Play (Win)', value: 'playerWin' },
 { labelKey: 'Player GGR', value: 'ggr' },
]