import { deleteParamsRequest, deleteRequest, getRequest, patchRequest, postRequest, putRequest } from './axios';

const { REACT_APP_API_URL, REACT_APP_CRON_URL, REACT_APP_CRON_AUTH } = process.env;

// Get request
const getAllPlayers = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/`, params);
const getAffiliatesList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/affiliate/all-affiliates`, params);
const getAffiliatesPlayerList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/affiliate/affiliate-users`, params);
const getPlayerById = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/detail`, params);
const adminRoles = () => getRequest(`${REACT_APP_API_URL}/api/v1/admin/roles`);
const getSiteConfig = () => getRequest(`${REACT_APP_API_URL}/api/v1/admin/config`);
const getStaffGroups = () => getRequest(`${REACT_APP_API_URL}/api/v1/admin/group`);
const getAllAdmins = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/admin/`, params);
const getAdminDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/admin/detail`, params);
const getEmailCenter = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/email-center`, params);
const getFreeSpinEmailTemplate = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/email-center/get-free-spin-templates`, params);
const getSubscriptionList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/subscription-plan-list`, params);
const getAffiliateDetails = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/affiliate/affiliate-details?affiliateId=${params.affiliateId}`);
const getAdminChildren = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/admin/child`, params);
const getUserDocumentsRequest = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/document`, params);
const getPackagesListingRequest = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/package`, params);
const getPackagesEditData = ({ packageId, ...queryParams }) => { return getRequest(`${REACT_APP_API_URL}/api/v1/package/detail/${packageId}`, queryParams) }
const getPackageUserFilter = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/package/user-filter`, params);
const getAllCms = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/cms/`, params);
const getCmsDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/cms/details`, params);
const getCmsDynamicData = () => getRequest(`${REACT_APP_API_URL}/api/v1/cms/dynamic-data`);
const getGallery = () => getRequest(`${REACT_APP_API_URL}/api/v1/gallery`);
const getEmailTemplates = () => getRequest(`${REACT_APP_API_URL}/api/v1/email`);
const getEmailTemplateDetail = ({ emailTemplateId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/email/details/${emailTemplateId}`);
const getEmailDynamicData = () => getRequest(`${REACT_APP_API_URL}/api/v1/email/dynamic-data`);
// const getCountries = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country`, params);
const getAllCasinoProviders = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/providers`, params);
const getAllTournamentProviders = () => getRequest(`${REACT_APP_API_URL}/api/v1/tournament/providers`);
const getAllTournamentSubCategories = () => getRequest(`${REACT_APP_API_URL}/api/v1/tournament/subcategory`);
const getBlogDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/blog-post`, params);
const getGamePageDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/game-pages`, params);
const getGamePageCardDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/game-pages/card`, params);
const getGamePagesList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/blog-post/game-page`, params);
const getPaymentProvider = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/payment-provider`, params);
const getUserAllCasinoProviders = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/providers`, params);
const getCasinoAggregators = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/aggregator`, params);
const getAllBanners = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/banner`, params);
const getAllTierList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/tiers`, params);
const getAllTierListParams = ({ tierId }) => getRequest(`${REACT_APP_API_URL}/api/v1/tier/${tierId}`);
const getAllTierUserListParams = ({ tierId, params }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tier/${tierId}/users`, params);
const getAllCasinoSubCategories = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/subcategory`, params);
// const getRestrictedCountries = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country/restricted`, params);
// const getUnrestrictedCountries = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country/unrestricted`, params);
const getEmailCategoryData = () => getRequest(`${REACT_APP_API_URL}/api/v1/email/category`);
const getBonusDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/`, params);
// const getLiveUsersCount = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/dashboard`, params);
// const getReports = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report`, params);
const getReportsV2 = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/v2`, params);
// const getReportsAll = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/all`, params);
// const getGameReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/dashboard/game`, params);
// const elasticCheck = () => getRequest(`${REACT_APP_API_URL}/api/v1/elastic/healthcheck`);
const getPlayerResponsible = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/user/user-responsible-setting`, params);
const getPlayerBankRequest = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/bank-details`, params);
const getPlayerCasinoRequest = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/casino-detail`, params);
const getAllCasinoGames = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/game`, params);
const getCasinoSubcategoryGames = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/game`, params);
const getRestrictedItems = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country/restricted/items`, params);
const getUnRestrictedItems = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country/unrestricted/items`, params);
const getAllTransactions = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/casino-transactions`, params);
const getBankingTransactions = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/transactions`, params);
const getVaultData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/vault-data`, params);
const getPurchaseReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/purchase-report`, params);
const getRedeemReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/redemption-rate-report`, params);
const getRedeemGraph = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/redemption-graph-report`, params);
const getBonusReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/bonus-detail-report`, params);
const getBonusGraphData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/bonus-graph-report`, params);
const getUserDailyReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/merv-report`, params);
const getAmoeData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/amoe/history`, params);
const getUserSubscriptionList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/subscription/user-subscription`, params);
// const getUserSubscriptionCardDetail = () => getRequest(`${REACT_APP_API_URL}/api/v1/subscription/dashboard`);
const getAmoeDashboardData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/amoe/graph-data`, params);
const getAdminAddedCoins = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/admin-credit/admin-credit-coins`, params);
const getUserCreditedByAdmin = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/admin-credit/admin-credit-user`, params);
const getWithdrawRequests = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/redeem-requests`, params);
const getUserWithdrawRequests = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/redeem-requests`, params);
// const getSessionLogs = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/report/session-logs`, params);
const getAuditLogs = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/activity-logs`, params);
const getStateListing = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country/get-state`);
const getCityListing = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/country/get-city`, params);
// const amoeSearch = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/postal-code/`, params);
// const amoeHistory = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/postal-code/history`, params);
// const getCommsLogs = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/email-comms-details`, params);
const getActivityTable = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/user-activity`, params);
const getReferralDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/referred-users-detail`, params);
// const getUserTickets = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/alert/user-tickets`, params);
// const getAgents = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/alert/agent-overview`, params);
// const getRules = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/anti-fraud/rules`, params);
const generate2FA = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/admin/generate-otp-2fa`, params);
// const getPlayerGroups = () => getRequest(`${REACT_APP_API_URL}/api/v1/anti-fraud/player-group`);
// const getAdminsForAlert = () => getRequest(`${REACT_APP_API_URL}/api/v1/alert/admins`);
const getContentPages = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/pages`, params);
const getContentPageDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/pages/details`, params);
// const getIps = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/allowed_ip`, params);
const getKYCHistory = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/user-kyc`, params);
const getRaffle = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/raffle`, params);
const getRaffleDetail = (id) => getRequest(`${REACT_APP_API_URL}/api/v1/raffle/details?raffleId=${id}`);
const getRafflePayout = (id) => getRequest(`${REACT_APP_API_URL}/api/v1/rafflePayout?raffleId=${id}`);
// const getPayoutUser = (id) => getRequest(`${REACT_APP_API_URL}/api/v1/rafflePayout/${id}`);
const getPayoutUserSearch = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/rafflePayout/search`, params);
const getPromotionBonus = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promotion`, params);
// const getPromoCode = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/api/v1/promotion/generatepromocode`, params);
const getPromoCode = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promocode`, params);
const getCrmPromoCode = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promocode?crmPromocode=true`, params);
const getCrmPromoBonus = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion`, params);
const getPromotionBonusDetail = (promocodeId, params) => getRequest(`${REACT_APP_API_URL}/api/v1/promotion/${promocodeId}`, params);
const getPromoCodeHistory = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promocode/applied-history`, params);
const getCRMPromoCodeHistory = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promocode/expired-promo`, params);
const getCRMPromoBonusEditHistory = (id) => getRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion/${id}`);
const getCRMPromoBonusHistory = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion/expired-bonus`, params);
const getCRMBonusUserDetailsapi = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion/user-details`, params);
const getPackageDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promocode/packages`, params);
const getPackageHistory = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/package/user-details`, params);

const getPackageImageUrl = () => {
  return getRequest(`${REACT_APP_API_URL}/api/v1/package/all-package-images`);
};

const getRedeemUserDetails = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule/user-details`, params);
const getRedeemDashboardData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/redeem-dashboard`, params);
const getRedeemWithdrawRequest = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule/withdraw-details`, params);
const getAutomationPackageDetails = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/package/getSubPackages`, params);
const getArchivePackageHistory = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/package/restore-package`, params);
// const getRandomPromoCode = () => getRequest(`${REACT_APP_API_URL}/`);
const getRandomPromoCode = () => getRequest(`${REACT_APP_API_URL}/api/v1/promotion/generate`);
const getSpinWheel = () => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/spin-wheel`);
// const getCRMbonusDetail = () => getRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion/bonus-details`);
// const getSpinWheelId = (id) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/spin-wheel/${id}`);
const getAllCSVExportData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/exportCenter/getExportList`, params);
const getUserBanReasonRequest = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/ban-reason`, params);
const getUserBanStatusRequest = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/user-ban-reason`, params);
// const getUserBanReasonDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/user/ban-reason/detail`, params);
const fetchPromocodeBlocked = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/blockUsers`, params);
const getRedeemMoreDetail = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/redeem-details`, params);
const getRedeemRuleDetail = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule`, params);
const getSkrillBalance = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/payment/skrill-balance`, params);
// const getAllowedStateListing = () => getRequest(`${REACT_APP_API_URL}/api/v1/geo-comply/allowed-states`);
const getBlockedUser = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/domainBlock`, params);
const getAllTournamentsList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/tournament`, params);
const getSelectedTournament = (params, { tournamentId }) => getRequest(`${REACT_APP_API_URL}/api/v1/tournament/detail/${tournamentId}`, params);
const getAllTournamentsListParams = (params, { tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}`, params);
const getPayoutTournamentsData = ({ tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/payout`);
const getTournamentGames = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/tournament/games`, params);
const getTournamentUserList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/tournament/user`, params);
const getCalendarList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/calender`, params);
const getRibbonData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode/ribbon`, params);
const getAllTierTournamentList = () => getRequest(`${REACT_APP_API_URL}/api/v1/tournament/user/tiers`);
const getTournamentDashboard = ({ tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/dashboard`);
const getSubscriptionReportDetail = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/subscription/dashboard`, params);
const getTournamentDashboardGameIds = ({ tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/dashboard/stats/filters`);
const getTournamentDashboardTotalPlayer = (params, { tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/dashboard/total-score-players-count`, params);
const getTournamentDashboardWinnerBootedSummary = ({ tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/dashboard/winner-booted-summary`);
const getGamesIdsRequest = () => getRequest(`${REACT_APP_API_URL}/api/v1/casino/games`);
const getGamesPayment = () => getRequest(`${REACT_APP_API_URL}/api/v1/payment/games`);
const getTournamentStatisticsData = (params, { tournamentId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/dashboard/stats`, params);
// const getWhaleTestNotification = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/notifications-test`, params);
const getAllNotifications = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/admin-notification-center`, params);
const getNotificationCenterSettings = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/admin-notification-center/settings`, params);
const getVipPlayerListing = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip`, params);
const getVipPlayerDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/detail`, params);
const getVipPlayerReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/user-report`, params);
const getBiggestWinnerAndLooser = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/biggest-looser-winner`, params);
const getVipDashboardReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/dashboard-report`, params);
const getVipLoyaltyTier = () => getRequest(`${REACT_APP_API_URL}/api/v1/vip/loyalty-tier`);
const getVipUserQuestions = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/questionnaire`, params);
const getVipUserAnswers = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/user-questionnaire-answer`, params);
const getVipManagedBy = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip-managed-by`, params);
const getVipManagersCommissionReport = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/manager`, params);
const getVipManagersList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/vip/vip-managed-by`, params);
const getMaintenanceMode = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode`, params);
const getGameDashboardSummary = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/game-dashboard`, params);
const getGameDashboard = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/game-dashboard/game-infos`, params);
// const getDynamoData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/dynamo`, params);
const getBlogFaq = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/blog-post/faq`, params);
const getFreeSpinProvider = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/provider`, params);
const getFreeSpinGames = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/games`, params)
const getFreeSpinUserPreview = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/preview-user`, params);
const getFreeSpinUsers = () => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/get-cache-user`);
const getFreeSpinList = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/free-spin-grant`, params);
const getFreeSpinDashboard = () => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/dashboard`);
const getFreeSpinBetLimit = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/getBetAmountList`, params);
const getViewFreeSpin = (freeSpinId) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/details/${freeSpinId}`);
const getFreeSpinUser = (params, { freeSpinId }) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/${freeSpinId}/users`, params); const getGeneratedRNGJackpot = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/jackpot/rng`, params)
const getJackpotGraphData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/jackpot/graph`, params);
const getGamePageFaq = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/game-pages/faq`, params);
const getEmailDyanamickey = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/email-center/get-dynamic-value`, params);
const getSubscriptionFeature = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/subscription/feature`, params);
const getSubscriptionPlan = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/subscription`, params);

// Post request
const createRibbonMode = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode/ribbon`, data);
const createMaintenanceMode = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode`, data);
const createFtpBonus = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/package/first-purchase`, data);
const adminLogin = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/admin/login`, data);
const createEmailCenter = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/email-center`, data);
const createRedeemRule = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule`, data);
const sendEmailTest = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/email-center/email-sent`, data);
const sendUploadedCsv = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/email-center/upload-email-csv`, data, {
    'Content-Type': 'multipart/formdata',
  });
const sendUploadedRedeemCsv = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule/users-from-csv`, data, {
    'Content-Type': 'multipart/formdata',
  });
const sendPromoCodeCsv = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/promocode/upload-csv`, data, {
    'Content-Type': 'multipart/formdata',
  });
const AffiliateLogin = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/affiliate/login`, data);
const setUserBanReason = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/ban-reason`, data);
const adminLogout = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/admin/logout`, data);
const verify2FA = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/admin/verify-otp-2fa`, data);
const disable2FA = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/admin/disable-auth`, data);
const createStaffAdmin = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/admin/`, data);

// const updateAllowedStates = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/geo-comply/store-states`, data);
const setDailyLimits = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/daily-limit`, data);
const setDepositLimits = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/deposit-limit`, data);
const setLossLimits = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/loss-limit`, data);
const setSessionTime = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/session-time`, data);
const setDisableUntil = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/disable-until`, data);
const createPackageRequest = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/package`, data, { 'Content-Type': 'multipart/formdata' });
const createLadderPackageRequest = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/package/ladder-package`, data, { 'Content-Type': 'multipart/formdata' });
const createBlog = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/blog-post`, data, { 'Content-Type': 'multipart/formdata' });
const createGame = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/game-pages`, data, { 'Content-Type': 'multipart/formdata' });
const createGameCard = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/game-pages/card`, data, { 'Content-Type': 'multipart/formdata' });
const packageAutomationRequest = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/package/create-config`, data);
const createCms = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/cms/`, data);
const addFaq = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/blog-post/faq`, data);
const addGameFaq = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/game-pages/faq`, data);
const testEmailTemplate = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/email/test`, data);
const createCasinoProvider = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/casino/providers`, data, { 'Content-Type': 'multipart/formdata' });
const addGames = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/casino/add-game`, data, { 'Content-Type': 'multipart/formdata' });
const createBanner = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/banner`, data, { 'Content-Type': 'multipart/formdata' });
const createTournament = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/tournament`, data, { 'Content-Type': 'multipart/formdata' });
const createSubscription = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/subscription`, data, { 'Content-Type': 'multipart/formdata' });
const updateSubscription = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/subscription`, data, { 'Content-Type': 'multipart/formdata' });
const getSubscriptionDetail = (params) =>
  getRequest(`${REACT_APP_API_URL}/api/v1/subscription/detail`, params);
const createTier = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/tier`, data, { 'Content-Type': 'multipart/formdata' });
const createTournamentCron = (data) =>
  postRequest(`${REACT_APP_CRON_URL}/api/v1/tournament`, data, { Authorization: `Basic ${REACT_APP_CRON_AUTH}` });
const createBlockingDomain = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/domainBlock`, data);
const createCasinoSubCategory = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/casino/subcategory`, data, { 'Content-Type': 'multipart/formdata' });
const addGamestoSubCategory = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/casino/game`, data);
const createEmailTemplate = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/email/template`, data);
const uploadrubyPlayGames = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/ruby-play`, data, { 'Content-Type': 'multipart/formdata' });
const createBonus = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/bonus`, data);
const createDailyBonus = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/bonus`, data, { 'Content-Type': 'multipart/formdata' });
const updateResponsibleStatus = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/user/update-user-responsible-setting`, data);
const uploadAmoeFile = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/postal-code/`, data, { 'Content-Type': 'multipart/formdata' });
// const addComments = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/comment/`, data);
// const assignTicket = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/alert/assign-ticket`, data);
// const createPlayerGroup = (data) =>
//   postRequest(`${REACT_APP_API_URL}/api/v1/anti-fraud/player-group`, data, { 'Content-Type': 'multipart/formdata' });
// const createRule = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/anti-fraud/create-rule`, data);
const createContentPage = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/pages`, data);
const updateSeoDetails = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/pages/seo`, data);
const addPageAsset = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/pages/asset`, data, { 'Content-Type': 'multipart/formdata' });
// const createIP = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/allowed_ip`, data);
const checkManualLexisNexis = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/process-lexis-nexis`, data);
const createAffiliateUser = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/affiliate/create-affiliate`, data);
const createRaffle = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/raffle`, data, { 'Content-Type': 'multipart/formdata' });
const createPromotionBonus = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/promotion`, data);
const getPromotionGraph = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promotion/graph`, params);
const createPromoCode = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/promocode`, data);
const createCRMPromotionBonus = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion`, data);
const reusePackageRequest = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/package/template-package`, data);
const update2FaAuthStatus = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/disable-2FA`, data);
const createReferralBonus = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/bonus/referral-bonuses`, data);
const updatePromocodeBlocked = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/blockUsers`, data);
const uploadPromocodeCsv = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/blockUsers/block-from-csv`, data, { 'Content-Type': 'multipart/formdata' });
const uploadPackageCsv = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/package/import-csv`, data, { 'Content-Type': 'multipart/formdata' });
const uploadTournamentCsv = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/tournament/upload-csv`, data, { 'Content-Type': 'multipart/formdata' });
const uploadImage = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/gallery`, data, { 'Content-Type': 'multipart/formdata' });
const addFreeEntryOfPlayer = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/tournament/free-entry`, data);
const payoutTournamentPlayers = (data) => {
  const tournamentId = data?.tournamentId;
  return postRequest(`${REACT_APP_API_URL}/api/v1/tournament/${tournamentId}/payout`, data);
};
const reusePromocodeRequest = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/promocode/reuse-promocode`, data);
const setNotificationCenterSettings = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/admin-notification-center/settings`, data);

const dailyBonusStreak = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/v1/bonus/streak-daily-bonus`, data, { 'Content-Type': 'multipart/formdata' });
const createVipQuestions = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/vip/questionnaire`, data)
const createCanadianUser = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/user/add-canadian-customer`, data);
const uploadFreeSpinUserCsv = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/upload-csv`, data, { 'Content-Type': 'multipart/formdata' });
const createFreeSpinGrant = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/free-spin-grant`, data);

// Put Request
const updateDiscardUser = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/discard-user`, data);
const updateFreeSpinGrant = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/free-spin-grant`, data);
const deleteAggregator = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/hide-aggregator`, data);
const hideProvider = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/hide-provider`, data);
const hideGames = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/hide-game`, data);
const editMaintenanceMode = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode`, data);
const deleteRedeemUser = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule/remove-users`, data);
const updateEmailCenter = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/email-center`, data);
const updateUserTier = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/admin/update-user-tier`, data);
const restorepackages = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/package/restore-package`, data);
const updateftpBonus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/package/first-purchase`, data);
const createAffiliatePassword = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/affiliate/set-Password`, data);
const updateMoney = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/admin/add-remove-balance`, data);
const updateStaffMoney = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/walletCoin/add-remove-balance`, data);
const updateVerifyDocumentRequest = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/verify-document`, data);
const updateRequestDocumentRequest = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/request-document`, data);
const cancelDocumentRequest = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/cancel-document-request`, data);
const updatePackageRequest = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/package`, data, { 'Content-Type': 'multipart/formdata' });
const updateStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/status/`, data);
const updateAggregatorsStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/aggregator/`, data);
const updateCms = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/cms/`, data);
const approvedAffiliateUser = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/affiliate/approved-affiliate`, data);
const updateStaffAdmin = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/admin/`, data);
const updateProfile = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/admin/profile`, data);
const ChangeAffiliatePassword = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/affiliate/changePassword`, data);
const updateAffiliateProfile = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/affiliate/affiliate-profile`, data);
const updateEmailTemplate = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/email/`, data);
const updateCreds = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/email/credentials`, data);
const updateBlog = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/blog-post`, data, { 'Content-Type': 'multipart/formdata' });
const updateGamePage = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/game-pages`, data, { 'Content-Type': 'multipart/formdata' });
const updateGameCard = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/game-pages/card`, data, { 'Content-Type': 'multipart/formdata' });


const updateConfig = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/admin/config`, data, { 'Content-Type': 'multipart/formdata' });
const updateCasinoProvider = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/casino/providers`, data, { 'Content-Type': 'multipart/formdata' });
const updateBanner = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/banner`, data, { 'Content-Type': 'multipart/formdata' });
const updateTournaments = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/tournament`, data, { 'Content-Type': 'multipart/formdata' });
const updateTier = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/tier`, data, { 'Content-Type': 'multipart/formdata' });
const updateTournamentsCron = (data) =>
  putRequest(`${REACT_APP_CRON_URL}/api/v1/tournament`, data, { Authorization: `Basic ${REACT_APP_CRON_AUTH}` });
const reorderCasinoProvider = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/providers/order`, data);
const updateCasinoSubCategory = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/casino/subcategory`, data, { 'Content-Type': 'multipart/formdata' });
// const updateRestrictedCountries = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/country/restricted/items`, data);
const reorderCasinoSubCategory = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/subcategory/order`, data);
const updateCasinoGame = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/casino/game`, data, { 'Content-Type': 'multipart/formdata' });
const reorderCasinoSubCategoryGames = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/casino/games/order`, data);
const updateRestrictedItems = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/country/restricted`, data);
const updateManualTemplate = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/email/template`, data);
const updateBonus = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/bonus`, data, { 'Content-Type': 'multipart/formdata' });
const updateBonusStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/status`, data);
const updateBannerStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/status`, data);
const updateWithdrawRequest = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/payment/redeem-requests`, data);
const reorderPackages = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/package/order`, data);
const reorderQuestion = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/vip/order`, data);
const reorderFtpBonus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/package/first-purchase/order`, data);
const updateUserStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/update-user-status`, data);
const updateRemovePwLock = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/remove-pw-lock`, data);
const updateSocialSecurity = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/update-ssn`, data);
const addPlayerBankDetail = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/bank-details`, data);
const updatePlayerInfo = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/update-user`, data);
const addFavActivityLog = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/favorite-log`, data);
const updatePlayerPwd = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/update-password`, data);
const playerForceLogout = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/force-logout`, data);
const uploadUserDocs = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/user/document`, data, { 'Content-Type': 'multipart/formdata' });
// const resolveTicket = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/alert/user-tickets`, data);
const updateRuleStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/anti-fraud/update-rules`, data);
const updateContentPage = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/pages`, data);
const updatePageAsset = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/pages/asset`, data, { 'Content-Type': 'multipart/formdata' });
const paymentRefund = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/payment/refund`, data);
const updateUSerKYC = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/user-kyc`, data);
const resetUserResponsibleSetting = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/user/reset-user-responsible-setting`, data);
const updateRaffle = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/raffle`, data, { 'Content-Type': 'multipart/formdata' });
const rafflePayout = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/rafflePayout/payout`, data);
const updatePromotion = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/promotion`, data);
const updatePromoCode = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/promocode`, data);
const updateCRMPromotion = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion`, data);
const updateSpinWheel = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/bonus/spin-wheel`, data);
const deleteUsername = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/delete-username`, data);
const verifyOtp = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/admin/verify-otp-2fa`, data);
const updateUserBanReason = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/ban-reason`, data);
const updateUserBanStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/user/update-user-ban-status`, data);
const updateAmoeBonusTime = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/amoe/bonus-time`, data);
const updateRedeemRule = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule`, data);
const approveRedeemRequests = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/payment/approve-redeem-requests`, data);
const updateBlockedDomain = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/domainBlock`, data);
const reorderTournaments = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/tournament/order`, data);
const markNotificationStatus = (id) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/admin-notification-center/mark-read/${id}?markRead=true`);
const markAllNotificationStatus = () =>
  putRequest(`${REACT_APP_API_URL}/api/v1/admin-notification-center/mark-all-read?markRead=true`);
const markAllCriticalNotificationStatus = () =>
  putRequest(`${REACT_APP_API_URL}/api/v1/admin-notification-center/mark-all-read?markRead=true&type=CRITICAL_ALERT`);

const updateDailyBonusStreak = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/bonus`, data, { 'Content-Type': 'multipart/formdata' });

const updatePaymentProvider = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/payment-provider`, data);

const updateUserVipStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/vip`, data);
const updateLoyaltyTier = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/vip/loyalty-tier`, data);
const updateVipQuestion = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/vip/questionnaire`, data);
const updateMaintenanceModeTime = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode/alert-time`, data);
const updateVipManagedBy = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/vip-managed-by`, data);
const uploadVipUserCsv = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/vip-managed-by/csv`, data, { 'Content-Type': 'multipart/formdata' });

// Delete Request

const deleteRibbonMode = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode/ribbon`, data);
const deleteMaintenanceMode = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode`, data);
const deleteEmailCenter = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/email-center`, data);
const deleteImage = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/gallery`, data);
const deleteTournament = (params) => deleteParamsRequest(`${REACT_APP_API_URL}/api/v1/tournament`, params);
const deleteTier = (params) => deleteParamsRequest(`${REACT_APP_API_URL}/api/v1/tier`, params);
const deleteCasinoSubCategory = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/casino/subcategory`, data);
// const deleteRestrictedCountries = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/country/restricted`, data);
const deleteCasinoGame = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/casino/game`, data);
const deleteRestrictedItem = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/country/restricted/items`, data);
const deleteBonus = (params) => deleteParamsRequest(`${REACT_APP_API_URL}/api/v1/bonus/`, params);
const deleteCms = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/cms/pages`, data);
const deleteProvider = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/casino/providers`, data);
const deleteStaff = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/admin`, data);
const deleteAffiliate = (affiliateId) =>
  deleteRequest(`${REACT_APP_API_URL}/api/v1/affiliate/${affiliateId}/delete-affiliate`);
const deleteEmailTemplete = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/email`, data);
const deleteBanner = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/banner`, data);
const deleteContentPage = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/pages`, data);
const deleteAsset = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/pages/asset`, data);
// const deleteIP = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/allowed_ip`, data);
const deletePromotion = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/promotion`, data);
const deletePromoCode = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/promocode`, data);
const deleteCRMPromoCode = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion`, data);
const deletePackageRequest = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/package`, data);
const deleteftpBonuses = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/package/first-purchase`, data);
const deleteUserBanReason = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/user/ban-reason`, data);
const deleteRedeemRule = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/cashier-management/redeem-rule`, data);
const deleteBlockedDomain = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/domainBlock`, data);
const deleteBlog = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/blog-post`, data);
const deleteGamePage = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/game-pages`, data);
const deleteFaq = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/blog-post/faq`, data);
const deleteGameFaq = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/game-pages/faq`, data);
const deleteGameCard = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/game-pages/card`, data); const deleteFreeSpinUsers = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/remove-user`, data);
const deleteVipQuestion = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/vip/questionnaire`, data);

//Patch Request
const fetchWithdrawRequests = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/payment/redeem-requests`, data);
const updateStatusTournament = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/tournament`, data);
const updateStatusTier = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/tier`, data);
const updateStatusRaffle = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/raffle`, data);
const updateStatusPromotion = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/promotion`, data);
const updateStatusCRMPromotion = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/crm-promotion`, data);
// const updateUserActive = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/user/ban-reason`, data);
const updateFtpStatus = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/package/first-purchase`, data);
const cancelTournament = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/tournament`, data);
const cancelUserSubscription = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/subscription/user-subscription`, data);
const cancelFreeSpin = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/casino/free-spin/free-spin-grant`, data);
const bootPlayerTournament = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/tournament/boot-player`, data);
const updateStatusMaintenanceMode = (data) =>
  patchRequest(`${REACT_APP_API_URL}/api/v1/maintenance-mode/manage-mode`, data);
const updateVipQuestionStatus = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/vip/questionnaire`, data);

const updateBlogStatus = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/blog-post`, data);
const updateGamePageStatus = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/game-pages`, data);
const updateStatusSubscriptionFeature = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/subscription/feature`, data);
const updateSubscriptionFeature = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/subscription/feature`, data);
const updateSubscriptionStatus = (data) => patchRequest(`${REACT_APP_API_URL}/api/v1/subscription`, data);

// jackpot 
const getJackpotDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/jackpot`, params);
const getJackpotInfo = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/jackpot/info `, params);
const getCurrentJackpot = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/jackpot/current `, params);


const createJackpot = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/jackpot`, data);
const updateJackpot = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/jackpot`, data);
const deleteJackpot = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/jackpot`, data);

// provider dashboard 
const getProviderDashboardDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/provider-dashboard`, params);
const getProviderRates = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/provider-dashboard/provider-rate`, params);
const getAllProviders = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/provider-dashboard/aggregator-provider-detail`, params);
const createProviderRates = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/provider-dashboard/provider-rate`, data);
const updateProviderRates = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/provider-dashboard/provider-rate`, data);
const deleteProviderRates = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/provider-dashboard/provider-rate`, data);

// game rate dicount
const getGameLobbyGames = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/game-pages/game-lobby`, params);
const getGameRateDiscount = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/game-pages/monthly-discount`, params);
const createGameRateDiscount = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/game-pages/monthly-discount`, data);
const updateGameRateDiscount = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/game-pages/monthly-discount`, data);
const deleteGameRateDiscount = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/game-pages/monthly-discount`, data);


//Promotion Management 
const getPromotionManagementDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promotion-thumbnail`, params);
const orderPromotionManagement = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/promotion-thumbnail/order `, params);
const patchPromotionManagement = (params) => patchRequest(`${REACT_APP_API_URL}/api/v1/promotion-thumbnail `, params);
const createPromotionManagement = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/promotion-thumbnail`, data, { 'Content-Type': 'multipart/formdata' });
const updatePromotionManagement = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/promotion-thumbnail`, data, { 'Content-Type': 'multipart/formdata' });
const deletePromotionManagement = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/promotion-thumbnail`, data);
//Scratch Card 
const createScratchCard = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card`, data);
const createScratchCardImage = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/bonus/upload-scratch-card-images`, data, { 'Content-Type': 'multipart/formdata' });
const updateScratchCard = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card`, data, { 'Content-Type': 'multipart/formdata' });
const getScratchCardDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card`, params);
const getScratchCardUserDetails = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card-bonus-details`, params);
const getScratchCardDropdown = () => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card-dropdown`);
const getScratchCardGraph = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card-bonus-graph`, params);
const reuseScratchCardDetails = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/bonus/template-scratch-card?scratchCardId=${data}`,);
const deleteScratchCard = (data) => deleteRequest(`${REACT_APP_API_URL}/api/v1/bonus/scratch-card`, data);
const getScratchCardBudget = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/budgets`, params);
const createScratchCardBudget = (data) => postRequest(`${REACT_APP_API_URL}/api/v1/bonus/budgets`, data);
const resetScratchCardBudget = (data) => putRequest(`${REACT_APP_API_URL}/api/v1/bonus/budgets`, data); const getDropdownData = (params) => getRequest(`${REACT_APP_API_URL}/api/v1/bonus/attached-grant-dropdown`, params);

export {
  getRedeemReport,getRedeemGraph,
  getEmailDyanamickey,
  getSubscriptionList,
  updateDiscardUser,
  getFreeSpinUser,
  updateFreeSpinGrant,
  getViewFreeSpin,
  cancelFreeSpin,
  getFreeSpinList,
  getFreeSpinEmailTemplate,
  getPurchaseReport,
  reorderQuestion,
  getReportsV2,
  updateBannerStatus,
  deleteRibbonMode,
  createRibbonMode,
  getRibbonData,
  markAllCriticalNotificationStatus,
  createMaintenanceMode,
  editMaintenanceMode,
  deleteMaintenanceMode,
  getMaintenanceMode,
  updateMaintenanceModeTime,
  updateStatusMaintenanceMode,
  sendEmailTest,
  sendUploadedCsv,
  createRedeemRule,
  sendUploadedRedeemCsv,
  sendPromoCodeCsv,
  getRedeemUserDetails,
  getRedeemDashboardData,
  getRedeemWithdrawRequest,
  deleteftpBonuses,
  updateFtpStatus,
  updateftpBonus,
  restorepackages,
  updateUserTier,
  createEmailCenter,
  getEmailCenter,
  updateEmailCenter,
  deleteEmailCenter,
  getAllTierUserListParams,
  deleteRedeemUser,
  getAllTierListParams,
  getAllTierList,
  createTier,
  updateTier,
  deleteTier,
  adminLogin,
  createAffiliateUser,
  approvedAffiliateUser,
  getAffiliatesList,
  // getLiveUsersCount,
  adminLogout,
  updateProfile,
  getSiteConfig,
  updateConfig,
  getAdminChildren,
  adminRoles,
  getAllAdmins,
  getAllPlayers,
  getAdminDetails,
  getPlayerById,
  setDailyLimits,
  // getCountries,
  setDepositLimits,
  setLossLimits,
  // amoeSearch,
  // amoeHistory,
  updateCreds,
  setSessionTime,
  setDisableUntil,
  updateMoney,
  updateStaffMoney,
  uploadAmoeFile,
  getUserDocumentsRequest,
  updateVerifyDocumentRequest,
  updateRequestDocumentRequest,
  cancelDocumentRequest,
  getPackagesListingRequest,
  createPackageRequest,
  createLadderPackageRequest,
  updatePackageRequest,
  getAllCms,
  createCms,
  updateCms,
  getCmsDetail,
  getCmsDynamicData,
  getGallery,
  deleteImage,
  updateStatus,
  getStaffGroups,
  createStaffAdmin,
  updateStaffAdmin,
  getEmailTemplates,
  getEmailTemplateDetail,
  getEmailDynamicData,
  updateEmailTemplate,
  testEmailTemplate,
  getAllCasinoProviders,
  createCasinoProvider,
  addGames,
  updateCasinoProvider,
  getAllBanners,
  createBanner,
  updateBanner,
  getFreeSpinBetLimit,
  reorderCasinoProvider,
  getAllCasinoSubCategories,
  createCasinoSubCategory,
  updateCasinoSubCategory,
  deleteCasinoSubCategory,
  reorderCasinoSubCategory,
  getAllCasinoGames,
  deleteCasinoGame,
  updateCasinoGame,
  addGamestoSubCategory,
  createFtpBonus,
  // getRestrictedCountries,
  // getUnrestrictedCountries,
  // updateRestrictedCountries,
  // deleteRestrictedCountries,
  getCasinoSubcategoryGames,
  reorderCasinoSubCategoryGames,
  getRestrictedItems,
  getUnRestrictedItems,
  deleteRestrictedItem,
  updateRestrictedItems,
  getEmailCategoryData,
  createEmailTemplate,
  updateManualTemplate,
  uploadrubyPlayGames,
  createBonus,
  getBonusDetail,
  updateBonus,
  updateBonusStatus,
  deleteBonus,
  deleteCms,
  deleteProvider,
  deleteStaff,
  deleteEmailTemplete,
  deleteBanner,
  deletePackageRequest,
  getAllTransactions,
  getBankingTransactions,
  getWithdrawRequests,
  updateWithdrawRequest,
  reorderPackages,
  // getReports,
  // getReportsAll,
  // getGameReport,
  // elasticCheck,
  createDailyBonus,
  updateUserStatus,
  // getSessionLogs,
  getAuditLogs,
  getStateListing,
  getCityListing,
  getPlayerResponsible,
  updateResponsibleStatus,
  getPlayerBankRequest,
  addPlayerBankDetail,
  updatePlayerInfo,
  getPlayerCasinoRequest,
  addFavActivityLog,
  // getCommsLogs,
  getActivityTable,
  getReferralDetails,
  updatePlayerPwd,
  updateRemovePwLock,
  updateSocialSecurity,
  // addComments,
  playerForceLogout,
  uploadUserDocs,
  // getUserTickets,
  // assignTicket,
  // resolveTicket,
  // getAgents,
  // getRules,
  verifyOtp,
  generate2FA,
  verify2FA,
  disable2FA,
  // getPlayerGroups,
  // createPlayerGroup,
  // createRule,
  updateRuleStatus,
  // getAdminsForAlert,
  getContentPages,
  createContentPage,
  updateContentPage,
  deleteContentPage,
  getContentPageDetails,
  updateSeoDetails,
  addPageAsset,
  updatePageAsset,
  deleteAsset,
  // getIps,
  // createIP,
  // deleteIP,
  paymentRefund,
  getKYCHistory,
  updateUSerKYC,
  checkManualLexisNexis,
  createAffiliatePassword,
  AffiliateLogin,
  getAffiliatesPlayerList,
  ChangeAffiliatePassword,
  getAffiliateDetails,
  deleteAffiliate,
  updateAffiliateProfile,
  getCasinoAggregators,
  updateAggregatorsStatus,
  fetchWithdrawRequests,
  getAllTournamentsList,
  createTournament,
  deleteTournament,
  updateStatusTournament,
  updateStatusTier,
  getGamesIdsRequest,
  updateTournaments,
  getAllTournamentsListParams,
  createTournamentCron,
  updateTournamentsCron,
  resetUserResponsibleSetting,
  getRaffle,
  createRaffle,
  getRaffleDetail,
  updateRaffle,
  updateStatusRaffle,
  getRafflePayout,
  // getPayoutUser,
  getPayoutUserSearch,
  rafflePayout,
  getPromotionBonus,
  createPromotionBonus,
  getPromotionBonusDetail,
  updatePromotion,
  updateStatusPromotion,
  deletePromotion,
  getUserWithdrawRequests,
  getUserAllCasinoProviders,
  getRandomPromoCode,
  getSpinWheel,
  updateSpinWheel,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  reusePromocodeRequest,
  deletePromoCode,
  deleteAggregator,
  hideProvider,
  hideGames,
  getPromoCodeHistory,
  getPackageDetails,
  getPackageHistory,
  createReferralBonus,
  update2FaAuthStatus,
  getPackageUserFilter,
  reorderFtpBonus,
  getUserBanReasonRequest,
  getUserBanStatusRequest,
  // getUserBanReasonDetail,
  setUserBanReason,
  updateUserBanReason,
  // updateUserActive,
  deleteUserBanReason,
  updateUserBanStatus,
  deleteUsername,
  getVaultData,
  getRedeemMoreDetail,
  getRedeemRuleDetail,
  updateRedeemRule,
  deleteRedeemRule,
  approveRedeemRequests,
  getSkrillBalance,
  // getAllowedStateListing,
  // updateAllowedStates,
  getCrmPromoBonus,
  createCRMPromotionBonus,
  getCRMPromoBonusHistory,
  updateCRMPromotion,
  deleteCRMPromoCode,
  getFreeSpinDashboard,
  updateStatusCRMPromotion,
  // getCRMbonusDetail,
  // getSpinWheelId,
  getAllCSVExportData,
  getAmoeData,
  getAmoeDashboardData,
  updateAmoeBonusTime,
  getBlockedUser,
  createBlockingDomain,
  deleteBlockedDomain,
  updateBlockedDomain,
  fetchPromocodeBlocked,
  updatePromocodeBlocked,
  getCrmPromoCode,
  getCRMPromoCodeHistory,
  getCRMPromoBonusEditHistory,
  getCRMBonusUserDetailsapi,
  uploadPromocodeCsv,
  reusePackageRequest,
  getArchivePackageHistory,
  getPayoutTournamentsData,
  getTournamentGames,
  getTournamentDashboard,
  addFreeEntryOfPlayer,
  payoutTournamentPlayers,
  reorderTournaments,
  cancelTournament,
  bootPlayerTournament,
  getTournamentStatisticsData,
  getAllTournamentProviders,
  getAllTournamentSubCategories,
  getTournamentDashboardGameIds,
  getTournamentDashboardTotalPlayer,
  getTournamentDashboardWinnerBootedSummary,
  getTournamentUserList,
  // getWhaleTestNotification,
  getGamesPayment,
  getAllNotifications,
  markNotificationStatus,
  markAllNotificationStatus,
  getNotificationCenterSettings,
  setNotificationCenterSettings,
  dailyBonusStreak,
  updateDailyBonusStreak,
  getAllTierTournamentList,
  uploadTournamentCsv,
  packageAutomationRequest,
  getAutomationPackageDetails,
  uploadPackageCsv,
  getAdminAddedCoins,
  getUserCreditedByAdmin,
  getVipPlayerListing,
  getVipPlayerDetails,
  getVipPlayerReport,
  getBiggestWinnerAndLooser,
  getVipDashboardReport,
  getVipLoyaltyTier,
  getVipUserQuestions,
  getVipUserAnswers,
  updateUserVipStatus,
  updateLoyaltyTier,
  createVipQuestions,
  deleteVipQuestion,
  updateVipQuestion,
  updateVipQuestionStatus,
  getPaymentProvider,
  updatePaymentProvider,
  getGameDashboard,
  getGameDashboardSummary,
  createBlog,
  updateBlog,
  getBlogDetail,
  deleteBlog,
  updateBlogStatus,
  getSelectedTournament,
  getJackpotDetails,
  createJackpot,
  updateJackpot,
  deleteJackpot,
  getJackpotInfo,
  getProviderRates,
  getAllProviders,
  getProviderDashboardDetails,
  createProviderRates,
  updateProviderRates,
  deleteProviderRates,
  getCurrentJackpot,
  uploadImage,
  getPackageImageUrl,
  getVipManagedBy,
  updateVipManagedBy,
  getVipManagersCommissionReport,
  getVipManagersList,
  addFaq,
  getBlogFaq,
  deleteFaq,
  createCanadianUser,
  getBonusReport,
  getBonusGraphData,
  createScratchCard,
  getScratchCardDetails,
  updateScratchCard,
  getScratchCardDropdown,
  getPromotionManagementDetails,
  orderPromotionManagement,
  patchPromotionManagement,
  createPromotionManagement,
  updatePromotionManagement,
  deletePromotionManagement,
  getGeneratedRNGJackpot,
  getJackpotGraphData,
  createGame,
  // getDynamoData,
  addGameFaq,
  getGamePageFaq,
  deleteGameFaq,
  deleteGamePage,
  updateGamePageStatus,
  getGamePageDetail,
  updateGamePage,
  createGameCard,
  getGamePageCardDetail,
  updateGameCard,
  deleteGameCard,
  getGamePagesList,
  deleteScratchCard,
  getScratchCardUserDetails,
  getFreeSpinGames,
  getFreeSpinProvider,
  getFreeSpinUserPreview,
  uploadFreeSpinUserCsv,
  deleteFreeSpinUsers,
  getFreeSpinUsers,
  createFreeSpinGrant,
  getPackagesEditData,
  reuseScratchCardDetails, createScratchCardImage,
  getScratchCardGraph, resetScratchCardBudget, createScratchCardBudget, getScratchCardBudget,
  getCalendarList,
  uploadVipUserCsv,
  getPromotionGraph,
  getDropdownData,
  getUserDailyReport,
  getSubscriptionFeature,
  updateStatusSubscriptionFeature,
  getSubscriptionPlan,
  updateSubscriptionFeature,
  createSubscription,
  getSubscriptionDetail,
  updateSubscription,
  updateSubscriptionStatus,
  getUserSubscriptionList,
  // getUserSubscriptionCardDetail,
  cancelUserSubscription,
  createGameRateDiscount,
  getGameRateDiscount,
  updateGameRateDiscount,
  deleteGameRateDiscount,
  getGameLobbyGames,
  getSubscriptionReportDetail
};
