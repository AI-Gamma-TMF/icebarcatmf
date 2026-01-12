/**
 * Demo/Mock data for the dashboard when running on the demo environment.
 * This provides realistic-looking data for showcasing the platform.
 */

// Helper to check if we're on the demo host
export const isDemoHost = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.includes('ondigitalocean.app') || host.includes('demo');
};

// Generate a random number within a range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a random decimal within a range
const randDecimal = (min, max, decimals = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Generate mock dashboard report data
export const getMockDashboardData = () => ({
  DASHBOARD_REPORT: {
    // Top KPI cards
    scStakedTodayCount: randDecimal(15000, 45000),
    scWinTodayCount: randDecimal(12000, 38000),
    scGgr: randDecimal(2500, 8500),
    scAwardedTotalSumForToday: randDecimal(1200, 4500),
    gcAwardedTotalSumForToday: rand(50000, 180000),
    netScGgr: randDecimal(1800, 6200),
    jackpotRevenue: randDecimal(350, 1500),
    
    // Ticker data
    currentLogin: rand(45, 180),
    activePlayersCount: rand(25, 95),
    totalWalletScCoin: randDecimal(125000, 450000),
    totalVaultScCoin: randDecimal(45000, 180000),
    redemptionRateOverall: randDecimal(2.5, 8.5),
    redemptionRateToday: randDecimal(1.8, 6.2),
  }
});

// Generate mock login data for charts and tables
// Data must match the expected structure: { METRIC_KEY: { TODAY: x, YESTERDAY: y, ... } }
export const getMockLoginData = () => {
  return {
    // Login metrics - structure expected by LoginDataTable
    UNIQ_LOGIN: {
      TODAY: rand(150, 450),
      YESTERDAY: rand(180, 520),
      MONTH_TO_DATE: rand(3500, 8500),
      LAST_MONTH: rand(4200, 9800),
      CUSTOM: rand(2800, 7500),
    },
    TOTAL_LOGIN: {
      TODAY: rand(280, 750),
      YESTERDAY: rand(320, 850),
      MONTH_TO_DATE: rand(6500, 15000),
      LAST_MONTH: rand(7800, 18500),
      CUSTOM: rand(5200, 12500),
    },
  };
};

// Generate mock customer data for charts and tables
// Data must match the expected structure: { METRIC_KEY: { TODAY: x, YESTERDAY: y, ... } }
export const getMockCustomerData = () => {
  return {
    NEW_REGISTRATION: {
      TODAY: rand(25, 85),
      YESTERDAY: rand(30, 95),
      MONTH_TO_DATE: rand(650, 1800),
      LAST_MONTH: rand(780, 2200),
      CUSTOM: rand(520, 1450),
    },
    PENDING_REDEMPTION_COUNT: {
      TODAY: rand(5, 25),
      YESTERDAY: rand(8, 32),
      MONTH_TO_DATE: rand(120, 380),
      LAST_MONTH: rand(150, 450),
      CUSTOM: rand(95, 320),
    },
    FAILED_REDEMPTION_COUNT: {
      TODAY: rand(1, 8),
      YESTERDAY: rand(2, 12),
      MONTH_TO_DATE: rand(35, 120),
      LAST_MONTH: rand(45, 150),
      CUSTOM: rand(28, 95),
    },
    PENDING_REDEMPTION_SUM: {
      TODAY: randDecimal(250, 1500),
      YESTERDAY: randDecimal(380, 1800),
      MONTH_TO_DATE: randDecimal(8500, 25000),
      LAST_MONTH: randDecimal(9500, 28000),
      CUSTOM: randDecimal(6800, 22000),
    },
    FAILED_REDEMPTION_SUM: {
      TODAY: randDecimal(50, 450),
      YESTERDAY: randDecimal(85, 580),
      MONTH_TO_DATE: randDecimal(1500, 5500),
      LAST_MONTH: randDecimal(1800, 6500),
      CUSTOM: randDecimal(1200, 4800),
    },
    FIRST_DEPOSIT_COUNT: {
      TODAY: rand(8, 35),
      YESTERDAY: rand(12, 45),
      MONTH_TO_DATE: rand(280, 850),
      LAST_MONTH: rand(350, 980),
      CUSTOM: rand(220, 720),
    },
    FIRST_DEPOSIT_SUM: {
      TODAY: randDecimal(350, 1800),
      YESTERDAY: randDecimal(480, 2200),
      MONTH_TO_DATE: randDecimal(12000, 45000),
      LAST_MONTH: randDecimal(15000, 52000),
      CUSTOM: randDecimal(9500, 38000),
    },
    PURCHASE_COUNT: {
      TODAY: rand(45, 180),
      YESTERDAY: rand(55, 220),
      MONTH_TO_DATE: rand(1200, 4500),
      LAST_MONTH: rand(1500, 5200),
      CUSTOM: rand(950, 3800),
    },
    PURCHASE_SUM: {
      TODAY: randDecimal(2500, 12000),
      YESTERDAY: randDecimal(3200, 15000),
      MONTH_TO_DATE: randDecimal(85000, 320000),
      LAST_MONTH: randDecimal(95000, 380000),
      CUSTOM: randDecimal(68000, 280000),
    },
    AVERAGE_PURCHASE_AMOUNT: {
      TODAY: randDecimal(45, 120),
      YESTERDAY: randDecimal(48, 125),
      MONTH_TO_DATE: randDecimal(52, 135),
      LAST_MONTH: randDecimal(55, 140),
      CUSTOM: randDecimal(50, 130),
    },
    REQUESTED_REDEMPTION_COUNT: {
      TODAY: rand(12, 55),
      YESTERDAY: rand(15, 65),
      MONTH_TO_DATE: rand(350, 1200),
      LAST_MONTH: rand(420, 1450),
      CUSTOM: rand(280, 980),
    },
    APPROVAL_REDEMPTION_COUNT: {
      TODAY: rand(8, 42),
      YESTERDAY: rand(12, 52),
      MONTH_TO_DATE: rand(280, 950),
      LAST_MONTH: rand(350, 1150),
      CUSTOM: rand(220, 780),
    },
    CANCELLED_REDEMPTION_COUNT: {
      TODAY: rand(1, 8),
      YESTERDAY: rand(2, 12),
      MONTH_TO_DATE: rand(25, 95),
      LAST_MONTH: rand(32, 120),
      CUSTOM: rand(18, 75),
    },
    REQUESTED_REDEMPTION_SUM: {
      TODAY: randDecimal(850, 4500),
      YESTERDAY: randDecimal(1200, 5500),
      MONTH_TO_DATE: randDecimal(28000, 120000),
      LAST_MONTH: randDecimal(35000, 145000),
      CUSTOM: randDecimal(22000, 95000),
    },
    APPROVAL_REDEMPTION_SUM: {
      TODAY: randDecimal(650, 3800),
      YESTERDAY: randDecimal(950, 4500),
      MONTH_TO_DATE: randDecimal(22000, 95000),
      LAST_MONTH: randDecimal(28000, 115000),
      CUSTOM: randDecimal(18000, 78000),
    },
    CANCELLED_REDEMPTION_SUM: {
      TODAY: randDecimal(50, 350),
      YESTERDAY: randDecimal(85, 450),
      MONTH_TO_DATE: randDecimal(1500, 6500),
      LAST_MONTH: randDecimal(1800, 7800),
      CUSTOM: randDecimal(1200, 5200),
    },
    NET_REVENUE: {
      TODAY: randDecimal(1500, 8500),
      YESTERDAY: randDecimal(1800, 9500),
      MONTH_TO_DATE: randDecimal(52000, 220000),
      LAST_MONTH: randDecimal(65000, 280000),
      CUSTOM: randDecimal(42000, 185000),
    },
  };
};

// Generate mock economy data for charts and tables
// Data must match the expected structure: { METRIC_KEY: { TODAY: x, YESTERDAY: y, ... } }
export const getMockEconomyData = () => {
  return {
    GC_CREDITED_PURCHASE: {
      TODAY: rand(85000, 350000),
      YESTERDAY: rand(95000, 420000),
      MONTH_TO_DATE: rand(2500000, 8500000),
      LAST_MONTH: rand(3200000, 9800000),
      CUSTOM: rand(2000000, 7200000),
    },
    SC_CREDITED_PURCHASE: {
      TODAY: randDecimal(850, 3500),
      YESTERDAY: randDecimal(950, 4200),
      MONTH_TO_DATE: randDecimal(25000, 85000),
      LAST_MONTH: randDecimal(32000, 98000),
      CUSTOM: randDecimal(20000, 72000),
    },
    GC_AWARDED_TOTAL: {
      TODAY: rand(45000, 180000),
      YESTERDAY: rand(55000, 220000),
      MONTH_TO_DATE: rand(1200000, 4500000),
      LAST_MONTH: rand(1500000, 5200000),
      CUSTOM: rand(950000, 3800000),
    },
    SC_AWARDED_TOTAL: {
      TODAY: randDecimal(450, 1800),
      YESTERDAY: randDecimal(550, 2200),
      MONTH_TO_DATE: randDecimal(12000, 45000),
      LAST_MONTH: randDecimal(15000, 52000),
      CUSTOM: randDecimal(9500, 38000),
    },
    SC_TOTAL_BALANCE: {
      TODAY: randDecimal(120000, 450000),
      YESTERDAY: randDecimal(125000, 480000),
      MONTH_TO_DATE: randDecimal(130000, 520000),
      LAST_MONTH: randDecimal(115000, 420000),
      CUSTOM: randDecimal(118000, 460000),
    },
    USC_BALANCE: {
      TODAY: randDecimal(85000, 320000),
      YESTERDAY: randDecimal(88000, 340000),
      MONTH_TO_DATE: randDecimal(92000, 380000),
      LAST_MONTH: randDecimal(82000, 300000),
      CUSTOM: randDecimal(86000, 330000),
    },
    RSC_BALANCE: {
      TODAY: randDecimal(35000, 130000),
      YESTERDAY: randDecimal(37000, 140000),
      MONTH_TO_DATE: randDecimal(38000, 150000),
      LAST_MONTH: randDecimal(33000, 120000),
      CUSTOM: randDecimal(34500, 125000),
    },
  };
};

// Generate mock transaction data for charts and tables
// Data must match the expected structure: { METRIC_KEY: { TODAY: x, YESTERDAY: y, ... } }
export const getMockTransactionData = () => {
  return {
    JACKPOT_REVENUE: {
      TODAY: randDecimal(350, 1500),
      YESTERDAY: randDecimal(420, 1800),
      MONTH_TO_DATE: randDecimal(9500, 38000),
      LAST_MONTH: randDecimal(12000, 45000),
      CUSTOM: randDecimal(7800, 32000),
    },
    ACTIVE_GC_PLAYER: {
      TODAY: rand(85, 320),
      YESTERDAY: rand(95, 380),
      MONTH_TO_DATE: rand(2500, 8500),
      LAST_MONTH: rand(3200, 9800),
      CUSTOM: rand(2000, 7200),
    },
    ACTIVE_SC_PLAYER: {
      TODAY: rand(45, 180),
      YESTERDAY: rand(55, 220),
      MONTH_TO_DATE: rand(1200, 4500),
      LAST_MONTH: rand(1500, 5200),
      CUSTOM: rand(950, 3800),
    },
    SC_STAKED_TOTAL: {
      TODAY: randDecimal(15000, 45000),
      YESTERDAY: randDecimal(18000, 52000),
      MONTH_TO_DATE: randDecimal(420000, 1200000),
      LAST_MONTH: randDecimal(520000, 1450000),
      CUSTOM: randDecimal(350000, 980000),
    },
    SC_WIN_TOTAL: {
      TODAY: randDecimal(12000, 38000),
      YESTERDAY: randDecimal(15000, 45000),
      MONTH_TO_DATE: randDecimal(350000, 980000),
      LAST_MONTH: randDecimal(420000, 1150000),
      CUSTOM: randDecimal(280000, 820000),
    },
    SC_GGR_TOTAL: {
      TODAY: randDecimal(2500, 8500),
      YESTERDAY: randDecimal(3200, 9800),
      MONTH_TO_DATE: randDecimal(65000, 220000),
      LAST_MONTH: randDecimal(85000, 280000),
      CUSTOM: randDecimal(52000, 185000),
    },
    SC_NEW_ACTIVE_PLAYER: {
      TODAY: rand(8, 35),
      YESTERDAY: rand(12, 45),
      MONTH_TO_DATE: rand(220, 750),
      LAST_MONTH: rand(280, 920),
      CUSTOM: rand(180, 620),
    },
    RETURN_TO_PLAYER: {
      TODAY: randDecimal(92, 98),
      YESTERDAY: randDecimal(91, 97),
      MONTH_TO_DATE: randDecimal(93, 97),
      LAST_MONTH: randDecimal(92, 96),
      CUSTOM: randDecimal(91, 97),
    },
    HOUSE_EDGE: {
      TODAY: randDecimal(2, 8),
      YESTERDAY: randDecimal(3, 9),
      MONTH_TO_DATE: randDecimal(3, 7),
      LAST_MONTH: randDecimal(4, 8),
      CUSTOM: randDecimal(3, 9),
    },
  };
};

// Generate mock bonus data for charts and tables
// Data must match the expected structure: { METRIC_KEY: { TODAY: x, YESTERDAY: y, ... } }
export const getMockBonusData = () => {
  return {
    AMOE_BONUS: {
      TODAY: randDecimal(250, 950),
      YESTERDAY: randDecimal(320, 1150),
      MONTH_TO_DATE: randDecimal(7500, 25000),
      LAST_MONTH: randDecimal(9500, 32000),
      CUSTOM: randDecimal(6200, 21000),
    },
    TIER_BONUS: {
      TODAY: randDecimal(150, 650),
      YESTERDAY: randDecimal(180, 780),
      MONTH_TO_DATE: randDecimal(4500, 16500),
      LAST_MONTH: randDecimal(5800, 19500),
      CUSTOM: randDecimal(3800, 14000),
    },
    DAILY_BONUS: {
      TODAY: randDecimal(850, 2500),
      YESTERDAY: randDecimal(950, 2800),
      MONTH_TO_DATE: randDecimal(22000, 65000),
      LAST_MONTH: randDecimal(28000, 78000),
      CUSTOM: randDecimal(18000, 55000),
    },
    PACKAGE_BONUS: {
      TODAY: randDecimal(450, 1800),
      YESTERDAY: randDecimal(550, 2200),
      MONTH_TO_DATE: randDecimal(12000, 45000),
      LAST_MONTH: randDecimal(15000, 55000),
      CUSTOM: randDecimal(9500, 38000),
    },
    RAFFLE_PAYOUT: {
      TODAY: randDecimal(0, 500),
      YESTERDAY: randDecimal(0, 650),
      MONTH_TO_DATE: randDecimal(2500, 12000),
      LAST_MONTH: randDecimal(3200, 15000),
      CUSTOM: randDecimal(2000, 9500),
    },
    WELCOME_BONUS: {
      TODAY: randDecimal(350, 1200),
      YESTERDAY: randDecimal(420, 1450),
      MONTH_TO_DATE: randDecimal(9500, 32000),
      LAST_MONTH: randDecimal(12000, 38000),
      CUSTOM: randDecimal(7800, 27000),
    },
    JACKPOT_WINNER: {
      TODAY: randDecimal(0, 2500),
      YESTERDAY: randDecimal(0, 3200),
      MONTH_TO_DATE: randDecimal(8500, 45000),
      LAST_MONTH: randDecimal(12000, 55000),
      CUSTOM: randDecimal(6500, 38000),
    },
    PERSONAL_BONUS: {
      TODAY: randDecimal(150, 650),
      YESTERDAY: randDecimal(180, 780),
      MONTH_TO_DATE: randDecimal(4500, 16500),
      LAST_MONTH: randDecimal(5800, 19500),
      CUSTOM: randDecimal(3800, 14000),
    },
    PROVIDER_BONUS: {
      TODAY: randDecimal(50, 350),
      YESTERDAY: randDecimal(85, 450),
      MONTH_TO_DATE: randDecimal(1500, 8500),
      LAST_MONTH: randDecimal(1800, 9800),
      CUSTOM: randDecimal(1200, 7200),
    },
    REFERRAL_BONUS: {
      TODAY: randDecimal(250, 950),
      YESTERDAY: randDecimal(320, 1150),
      MONTH_TO_DATE: randDecimal(6500, 25000),
      LAST_MONTH: randDecimal(8500, 32000),
      CUSTOM: randDecimal(5200, 21000),
    },
    AFFILIATE_BONUS: {
      TODAY: randDecimal(150, 550),
      YESTERDAY: randDecimal(180, 680),
      MONTH_TO_DATE: randDecimal(4200, 14500),
      LAST_MONTH: randDecimal(5500, 17500),
      CUSTOM: randDecimal(3500, 12000),
    },
    PROMOTION_BONUS: {
      TODAY: randDecimal(350, 1200),
      YESTERDAY: randDecimal(420, 1450),
      MONTH_TO_DATE: randDecimal(9500, 32000),
      LAST_MONTH: randDecimal(12000, 38000),
      CUSTOM: randDecimal(7800, 27000),
    },
    WHEELSPIN_BONUS: {
      TODAY: randDecimal(450, 1500),
      YESTERDAY: randDecimal(550, 1800),
      MONTH_TO_DATE: randDecimal(12000, 38000),
      LAST_MONTH: randDecimal(15000, 45000),
      CUSTOM: randDecimal(9500, 32000),
    },
    WEEKLYTIER_BONUS: {
      TODAY: randDecimal(0, 250),
      YESTERDAY: randDecimal(0, 320),
      MONTH_TO_DATE: randDecimal(2500, 8500),
      LAST_MONTH: randDecimal(3200, 9800),
      CUSTOM: randDecimal(2000, 7200),
    },
    MONTHLYTIER_BONUS: {
      TODAY: randDecimal(0, 150),
      YESTERDAY: randDecimal(0, 180),
      MONTH_TO_DATE: randDecimal(1500, 5500),
      LAST_MONTH: randDecimal(1800, 6500),
      CUSTOM: randDecimal(1200, 4500),
    },
    SCRATCHCARD_BONUS: {
      TODAY: randDecimal(250, 850),
      YESTERDAY: randDecimal(320, 980),
      MONTH_TO_DATE: randDecimal(6500, 22000),
      LAST_MONTH: randDecimal(8500, 27000),
      CUSTOM: randDecimal(5200, 18500),
    },
    TOURNAMENT_WINNER: {
      TODAY: randDecimal(0, 1500),
      YESTERDAY: randDecimal(0, 1800),
      MONTH_TO_DATE: randDecimal(5500, 25000),
      LAST_MONTH: randDecimal(7500, 32000),
      CUSTOM: randDecimal(4500, 21000),
    },
    ADDED_ADMIN_SCBONUS: {
      TODAY: randDecimal(150, 650),
      YESTERDAY: randDecimal(180, 780),
      MONTH_TO_DATE: randDecimal(4500, 16500),
      LAST_MONTH: randDecimal(5800, 19500),
      CUSTOM: randDecimal(3800, 14000),
    },
    CRM_PROMOCODE_BONUS: {
      TODAY: randDecimal(250, 850),
      YESTERDAY: randDecimal(320, 980),
      MONTH_TO_DATE: randDecimal(6500, 22000),
      LAST_MONTH: randDecimal(8500, 27000),
      CUSTOM: randDecimal(5200, 18500),
    },
    FIRST_PURCHASE_BONUS: {
      TODAY: randDecimal(350, 1200),
      YESTERDAY: randDecimal(420, 1450),
      MONTH_TO_DATE: randDecimal(9500, 32000),
      LAST_MONTH: randDecimal(12000, 38000),
      CUSTOM: randDecimal(7800, 27000),
    },
    PURCHASE_PROMOCODE_BONUS: {
      TODAY: randDecimal(450, 1500),
      YESTERDAY: randDecimal(550, 1800),
      MONTH_TO_DATE: randDecimal(12000, 38000),
      LAST_MONTH: randDecimal(15000, 45000),
      CUSTOM: randDecimal(9500, 32000),
    },
    TOTAL: {
      TODAY: randDecimal(4500, 15000),
      YESTERDAY: randDecimal(5500, 18000),
      MONTH_TO_DATE: randDecimal(125000, 380000),
      LAST_MONTH: randDecimal(155000, 450000),
      CUSTOM: randDecimal(95000, 320000),
    },
  };
};

// Generate mock report till date data
// This should be a flat object with the same keys as login data
export const getMockReportTillData = () => ({
  UNIQ_LOGIN: rand(45000, 125000),
  TOTAL_LOGIN: rand(125000, 350000),
});

// Wrapper to get all demo data at once
export const getAllDemoData = () => ({
  dashboardData: getMockDashboardData(),
  loginData: getMockLoginData(),
  customerData: getMockCustomerData(),
  economyData: getMockEconomyData(),
  transactionData: getMockTransactionData(),
  bonusData: getMockBonusData(),
  reportTillData: getMockReportTillData(),
});
