/**
 * Demo/Mock data for the dashboard when running on the demo environment.
 * This provides realistic-looking data for showcasing the platform.
 */

// Helper to check if we're on the demo host OR localhost (for testing)
export const isDemoHost = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (
    host.includes('ondigitalocean.app') || 
    host.includes('demo') || 
    host === 'localhost' || 
    host === '127.0.0.1'
  );
};

// Generate a random number within a range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a random decimal within a range
const randDecimal = (min, max, decimals = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Helper to generate time period data structure
const generateTimePeriods = (todayBase, variance = 0.3) => {
  const today = todayBase;
  const yesterday = Math.round(today * (1 - variance * Math.random()));
  const monthToDate = Math.round(today * (20 + rand(5, 10)));
  const lastMonth = Math.round(today * (25 + rand(5, 15)));
  const custom = Math.round(today * (1 + Math.random()));
  
  return {
    TODAY: today,
    YESTERDAY: yesterday,
    MONTH_TO_DATE: monthToDate,
    LAST_MONTH: lastMonth,
    CUSTOM: custom
  };
};

// Cache for generated mock data to prevent constant re-generation
let cachedMockData = null;

// Generate mock dashboard report data (cached to prevent constant re-renders)
export const getMockDashboardData = () => {
  if (cachedMockData) return cachedMockData;
  
  cachedMockData = {
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
  };
  
  return cachedMockData;
};

// Cache for other mock data functions
let cachedLoginData = null;
let cachedCustomerData = null;
let cachedEconomyData = null;
let cachedTransactionData = null;
let cachedBonusData = null;
let cachedReportTillData = null;

// Generate mock login data for tables and charts
export const getMockLoginData = () => {
  if (cachedLoginData) return cachedLoginData;
  
  cachedLoginData = {
    // Data for tables (nested time period structure)
    UNIQ_LOGIN: generateTimePeriods(rand(180, 350)),
    TOTAL_LOGIN: generateTimePeriods(rand(450, 850)),
  };
  
  return cachedLoginData;
};

// Generate mock customer data for tables and charts
export const getMockCustomerData = () => {
  if (cachedCustomerData) return cachedCustomerData;
  
  cachedCustomerData = {
    // Data for tables (nested time period structure matching customerDataKeysV2)
    NEW_REGISTRATION: generateTimePeriods(rand(25, 85)),
    PENDING_REDEMPTION_COUNT: generateTimePeriods(rand(5, 25)),
    FAILED_REDEMPTION_COUNT: generateTimePeriods(rand(2, 15)),
    PENDING_REDEMPTION_SUM: generateTimePeriods(randDecimal(1500, 4500)),
    FAILED_REDEMPTION_SUM: generateTimePeriods(randDecimal(500, 2500)),
    FIRST_DEPOSIT_COUNT: generateTimePeriods(rand(15, 55)),
    FIRST_DEPOSIT_SUM: generateTimePeriods(randDecimal(5000, 15000)),
    PURCHASE_COUNT: generateTimePeriods(rand(45, 125)),
    PURCHASE_SUM: generateTimePeriods(randDecimal(15000, 45000)),
    AVERAGE_PURCHASE_AMOUNT: generateTimePeriods(randDecimal(85, 250)),
    REQUESTED_REDEMPTION_COUNT: generateTimePeriods(rand(8, 35)),
    APPROVAL_REDEMPTION_COUNT: generateTimePeriods(rand(5, 28)),
    CANCELLED_REDEMPTION_COUNT: generateTimePeriods(rand(1, 8)),
    REQUESTED_REDEMPTION_SUM: generateTimePeriods(randDecimal(3500, 12000)),
    APPROVAL_REDEMPTION_SUM: generateTimePeriods(randDecimal(2500, 9500)),
    CANCELLED_REDEMPTION_SUM: generateTimePeriods(randDecimal(150, 850)),
    NET_REVENUE: generateTimePeriods(randDecimal(8500, 25000)),
  };
  
  return cachedCustomerData;
};

// Generate mock economy data for tables (matching coinEcoDataKeys)
export const getMockEconomyData = () => {
  if (cachedEconomyData) return cachedEconomyData;
  
  cachedEconomyData = {
    GC_CREDITED_PURCHASE: generateTimePeriods(randDecimal(15000, 45000)),
    SC_CREDITED_PURCHASE: generateTimePeriods(randDecimal(2500, 8500)),
    GC_AWARDED_TOTAL: generateTimePeriods(randDecimal(35000, 95000)),
    SC_AWARDED_TOTAL: generateTimePeriods(randDecimal(3500, 12000)),
    SC_TOTAL_BALANCE: generateTimePeriods(randDecimal(125000, 350000)),
    USC_BALANCE: generateTimePeriods(randDecimal(85000, 250000)),
    RSC_BALANCE: generateTimePeriods(randDecimal(35000, 125000)),
  };
  
  return cachedEconomyData;
};

// Generate mock transaction data for tables (matching transactionDataKeys)
export const getMockTransactionData = () => {
  if (cachedTransactionData) return cachedTransactionData;
  
  cachedTransactionData = {
    JACKPOT_REVENUE: generateTimePeriods(randDecimal(850, 3500)),
    ACTIVE_GC_PLAYER: generateTimePeriods(rand(120, 380)),
    ACTIVE_SC_PLAYER: generateTimePeriods(rand(85, 250)),
    SC_STAKED_TOTAL: generateTimePeriods(randDecimal(15000, 45000)),
    SC_WIN_TOTAL: generateTimePeriods(randDecimal(12000, 38000)),
    SC_GGR_TOTAL: generateTimePeriods(randDecimal(2500, 8500)),
    SC_NEW_ACTIVE_PLAYER: generateTimePeriods(rand(25, 85)),
    RETURN_TO_PLAYER: generateTimePeriods(randDecimal(85, 96)),
    HOUSE_EDGE: generateTimePeriods(randDecimal(4, 15)),
  };
  
  return cachedTransactionData;
};

// Generate mock bonus data for tables (matching bonusDataKeys)
export const getMockBonusData = () => {
  if (cachedBonusData) return cachedBonusData;
  
  cachedBonusData = {
    AMOE_BONUS: generateTimePeriods(randDecimal(450, 1500)),
    TIER_BONUS: generateTimePeriods(randDecimal(350, 1200)),
    DAILY_BONUS: generateTimePeriods(randDecimal(2500, 8500)),
    PACKAGE_BONUS: generateTimePeriods(randDecimal(850, 3500)),
    RAFFLE_PAYOUT: generateTimePeriods(randDecimal(1200, 4500)),
    WELCOME_BONUS: generateTimePeriods(randDecimal(1800, 6500)),
    JACKPOT_WINNER: generateTimePeriods(randDecimal(450, 2500)),
    PERSONAL_BONUS: generateTimePeriods(randDecimal(250, 850)),
    PROVIDER_BONUS: generateTimePeriods(randDecimal(650, 2500)),
    REFERRAL_BONUS: generateTimePeriods(randDecimal(350, 1200)),
    AFFILIATE_BONUS: generateTimePeriods(randDecimal(150, 550)),
    PROMOTION_BONUS: generateTimePeriods(randDecimal(850, 3500)),
    WHEELSPIN_BONUS: generateTimePeriods(randDecimal(450, 1800)),
    WEEKLYTIER_BONUS: generateTimePeriods(randDecimal(350, 1200)),
    MONTHLYTIER_BONUS: generateTimePeriods(randDecimal(550, 2200)),
    SCRATCHCARD_BONUS: generateTimePeriods(randDecimal(250, 950)),
    TOURNAMENT_WINNER: generateTimePeriods(randDecimal(650, 2800)),
    ADDED_ADMIN_SCBONUS: generateTimePeriods(randDecimal(150, 650)),
    CRM_PROMOCODE_BONUS: generateTimePeriods(randDecimal(350, 1500)),
    FIRST_PURCHASE_BONUS: generateTimePeriods(randDecimal(850, 3500)),
    PURCHASE_PROMOCODE_BONUS: generateTimePeriods(randDecimal(450, 1800)),
    TOTAL: generateTimePeriods(randDecimal(12500, 45000)),
  };
  
  return cachedBonusData;
};

// Generate mock report till date data (single values for TILL_DATE column)
export const getMockReportTillData = () => {
  if (cachedReportTillData) return cachedReportTillData;
  
  cachedReportTillData = {
    UNIQ_LOGIN: rand(125000, 350000),
    TOTAL_LOGIN: rand(180000, 450000),
  };
  
  return cachedReportTillData;
};

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
