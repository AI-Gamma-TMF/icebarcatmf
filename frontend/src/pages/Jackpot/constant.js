export const tableHeaders = [
  { labelKey: "Id", value: "id" },
  { labelKey: "Popup Name", value: "popupName" },
  { labelKey: "Description", value: "description" },
  { labelKey: "Start Date", value: "startDate" },
  { labelKey: "End Date", value: "endDate" },
  { labelKey: "Link", value: "link" },
  { labelKey: "Image", value: "imageUrl" },
  { labelKey: "Status", value: "isActive" },

  { labelKey: "Action", value: "" },
];

export const jackpotTableHeaders = [
  { labelKey: "Jackpot ID", value: "jackpotId" },
  { labelKey: "Jackpot Name", value: "jackpotName" },
  { labelKey: "Pool Amount", value: "poolAmount" },
  { labelKey: "Seed Amount", value: "seedAmount" },
  { labelKey: "Jackpot Pool Earning", value: "jackpotPoolEarning" },
  { labelKey: "Net Revenue", value: "netRevenue" },
  { labelKey: "User ID", value: "userId" },
  { labelKey: "Username", value: "username" },
  { labelKey: "Email", value: "email" },
  { labelKey: "Game ID", value: "gameId" },
  { labelKey: "Game Name", value: "gameName" },
  { labelKey: "Winning Date", value: "winningDate" },
  { labelKey: "Winning Ticket", value: "winningTicket" },
  { labelKey: "Total Ticket Sold", value: "ticketSold" },
  { labelKey: "Status", value: "status" },
  { labelKey: "Action", value: "action" },
];

export const STATUS_LABELS = {
  0: "UPCOMING",
  1: "RUNNING",
  2: "COMPLETED",
  3: "DELETED",
};

export const chartTodayLabels = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export const chartWeekLabels = [
  "2025-04-30",
  "2025-05-01",
  "2025-05-02",
  "2025-05-03",
  "2025-05-04",
  "2025-05-05",
  "2025-05-06",
];

export const chartTodayData = [
  12, 45, 30, 60, 28, 9, 34, 70, 20, 65, 78, 55, 41, 66, 80, 49, 30, 57, 73, 39,
  21, 33, 64, 26,
];

export const chartWeekData = [34, 67, 45, 89, 12, 76, 53];

export const YAxisOptions = [
  { label: "All", value: "all" },
  { label: "Jackpot Revenue", value: "jackpotRevenue", color: "#4caf50" },
  { label: "Spin Count", value: "spinCount", color: "#2196f3" },
  { label: "Total Bet Count", value: "totalBetCount", color: "#ff9800" },
  {
    label: "Newly Opted-In Users",
    value: "newlyOptedInUsers",
    color: "#9c27b0",
  },
  { label: "Opt-In Rate", value: "optInRate", color: "#f44336" },
];
