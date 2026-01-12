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

// Generate mock login data for charts
export const getMockLoginData = () => {
  const days = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      label: `loginKeys.LOGIN_COUNT`,
      total: rand(120, 380),
      unique: rand(80, 250),
    });
  }
  
  return {
    LOGIN_DATA: days,
    loginDataKeys: [
      { label: 'loginKeys.TOTAL_LOGINS', total: rand(8500, 15000) },
      { label: 'loginKeys.UNIQUE_LOGINS', total: rand(4200, 8500) },
      { label: 'loginKeys.NEW_REGISTRATIONS', total: rand(450, 1200) },
      { label: 'loginKeys.CURRENT_LOGIN', total: rand(45, 180) },
    ]
  };
};

// Generate mock customer data
export const getMockCustomerData = () => {
  const days = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      newUsers: rand(15, 65),
      activeUsers: rand(180, 450),
      totalPurchases: rand(25, 85),
    });
  }
  
  return {
    CUSTOMER_DATA: days,
    customerDataKeys: [
      { label: 'customerKeys.TOTAL_USERS', total: rand(12000, 28000) },
      { label: 'customerKeys.ACTIVE_USERS', total: rand(3500, 8500) },
      { label: 'customerKeys.NEW_USERS_TODAY', total: rand(35, 120) },
      { label: 'customerKeys.VERIFIED_USERS', total: rand(8500, 18000) },
      { label: 'customerKeys.KYC_PENDING', total: rand(150, 450) },
      { label: 'customerKeys.KYC_APPROVED', total: rand(6500, 15000) },
    ]
  };
};

// Generate mock economy data
export const getMockEconomyData = () => {
  const days = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      scStaked: randDecimal(8000, 25000),
      scWins: randDecimal(6500, 22000),
      gcAwarded: rand(35000, 120000),
      scAwarded: randDecimal(800, 3500),
    });
  }
  
  return {
    ECONOMY_DATA: days,
    economyDataKeys: [
      { label: 'economyKeys.TOTAL_SC_STAKED', total: randDecimal(450000, 850000) },
      { label: 'economyKeys.TOTAL_SC_WINS', total: randDecimal(380000, 720000) },
      { label: 'economyKeys.TOTAL_GC_AWARDED', total: rand(2500000, 5500000) },
      { label: 'economyKeys.TOTAL_SC_AWARDED', total: randDecimal(85000, 180000) },
      { label: 'economyKeys.NET_GGR', total: randDecimal(45000, 125000) },
    ]
  };
};

// Generate mock transaction data
export const getMockTransactionData = () => {
  const days = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      purchases: rand(45, 150),
      purchaseAmount: randDecimal(2500, 8500),
      redemptions: rand(8, 35),
      redemptionAmount: randDecimal(800, 3500),
    });
  }
  
  return {
    TRANSACTION_DATA: days,
    transactionDataKeys: [
      { label: 'transactionKeys.TOTAL_PURCHASES', total: rand(3500, 8500) },
      { label: 'transactionKeys.TOTAL_PURCHASE_AMOUNT', total: randDecimal(185000, 450000) },
      { label: 'transactionKeys.TOTAL_REDEMPTIONS', total: rand(650, 1800) },
      { label: 'transactionKeys.TOTAL_REDEMPTION_AMOUNT', total: randDecimal(45000, 125000) },
      { label: 'transactionKeys.PENDING_REDEMPTIONS', total: rand(15, 65) },
      { label: 'transactionKeys.APPROVED_REDEMPTIONS', total: rand(580, 1650) },
    ]
  };
};

// Generate mock bonus data
export const getMockBonusData = () => {
  return {
    BONUS_DATA: [
      { bonusType: 'Welcome Bonus', count: rand(120, 350), scAmount: randDecimal(2500, 6500), gcAmount: rand(25000, 75000) },
      { bonusType: 'Daily Login', count: rand(850, 2500), scAmount: randDecimal(4500, 12000), gcAmount: rand(85000, 250000) },
      { bonusType: 'Referral Bonus', count: rand(45, 180), scAmount: randDecimal(1200, 3500), gcAmount: rand(12000, 35000) },
      { bonusType: 'VIP Bonus', count: rand(25, 85), scAmount: randDecimal(2500, 8500), gcAmount: rand(25000, 85000) },
      { bonusType: 'Promo Code', count: rand(65, 220), scAmount: randDecimal(1800, 5500), gcAmount: rand(18000, 55000) },
    ],
    bonusDataKeys: [
      { label: 'bonusKeys.TOTAL_BONUSES_GIVEN', total: rand(1200, 3500) },
      { label: 'bonusKeys.TOTAL_SC_BONUS', total: randDecimal(12500, 35000) },
      { label: 'bonusKeys.TOTAL_GC_BONUS', total: rand(165000, 500000) },
    ]
  };
};

// Generate mock report till date data
export const getMockReportTillData = () => ({
  LOGIN_DATA_TILL_DATE: {
    totalLogins: rand(125000, 350000),
    uniqueLogins: rand(45000, 125000),
    totalRegistrations: rand(28000, 65000),
  }
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
