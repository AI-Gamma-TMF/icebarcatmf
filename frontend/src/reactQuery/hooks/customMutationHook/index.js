import { useQueryClient, useMutation } from '@tanstack/react-query';

import { toast } from '../../../components/Toast';
import {
  adminLogout,
  cancelDocumentRequest,
  createBanner,
  // createCasinoCategory,
  createTournament,
  createTier,
  updateTournaments,
  updateTier,
  createCasinoProvider,
  createCasinoSubCategory,
  createCms,
  createPackageRequest,
  deleteTier,
  createStaffAdmin,
  // deleteCasinoCategory,
  deleteTournament,
  deleteCasinoGame,
  deleteCasinoSubCategory,
  deleteImage,
  reorderCasinoSubCategory,
  setDailyLimits,
  setDepositLimits,
  setDisableUntil,
  setLossLimits,
  setSessionTime,
  testEmailTemplate,
  updateBanner,
  updateCasinoGame,
  updateCasinoProvider,
  updateCasinoSubCategory,
  updateCms,
  updateConfig,
  updateCreds,
  updateEmailTemplate,
  updateStatusTournament,
  updateStatusTier,
  updateMoney,
  updatePackageRequest,
  updateProfile,
  updateRequestDocumentRequest,
  updateStaffAdmin,
  updateStatus,
  updateAggregatorsStatus,
  updateVerifyDocumentRequest,
  reorderCasinoSubCategoryGames,
  addGamestoSubCategory,
  // updateRestrictedCountries,
  // deleteRestrictedCountries,
  deleteRestrictedItem,
  updateRestrictedItems,
  uploadrubyPlayGames,
  createEmailTemplate,
  updateManualTemplate,
  createBonus,
  updateBonus,
  updateBonusStatus,
  deleteBonus,
  deleteCms,
  deleteProvider,
  deleteStaff,
  deleteEmailTemplete,
  deleteBanner,
  updateWithdrawRequest,
  reorderPackages,
  createDailyBonus,
  updateUserStatus,
  updateResponsibleStatus,
  addPlayerBankDetail,
  updatePlayerInfo,
  uploadAmoeFile,
  addFavActivityLog,
  updatePlayerPwd,
  updateRemovePwLock,
  updateSocialSecurity,
  // addComments,
  uploadUserDocs,
  playerForceLogout,
  // assignTicket,
  verifyOtp,
  verify2FA,
  disable2FA,
  updateRuleStatus,
  createContentPage,
  updateContentPage,
  deleteContentPage,
  updateSeoDetails,
  addPageAsset,
  updatePageAsset,
  deleteAsset,
  paymentRefund,
  updateUSerKYC,
  reorderFtpBonus,
  getActivityTable,
  checkManualLexisNexis,
  createAffiliateUser,
  approvedAffiliateUser,
  ChangeAffiliatePassword,
  deleteAffiliate,
  updateAffiliateProfile,
  fetchWithdrawRequests,
  createTournamentCron,
  updateTournamentsCron,
  resetUserResponsibleSetting,
  createRaffle,
  updateRaffle,
  updateStatusRaffle,
  getPayoutUserSearch,
  rafflePayout,
  createPromotionBonus,
  updatePromotion,
  updateStatusPromotion,
  deletePromotion,
  getRandomPromoCode,
  updateStaffMoney,
  updateSpinWheel,
  addGames,
  createPromoCode,
  deletePromoCode,
  updatePromoCode,
  createCRMPromotionBonus,
  updateCRMPromotion,
  deleteCRMPromoCode,
  updateStatusCRMPromotion,
  update2FaAuthStatus,
  createReferralBonus,
  setUserBanReason,
  updateUserBanStatus,
  deleteUserBanReason,
  updateUserBanReason,
  deletePackageRequest,
  deleteUsername,
  getRedeemMoreDetail,
  getUserWithdrawRequests,
  updateRedeemRule,
  deleteRedeemRule,
  approveRedeemRequests,
  getSkrillBalance,
  reorderCasinoProvider,
  deleteftpBonuses,
  updateFtpStatus,
  updateUserTier,
  updateftpBonus,
  createFtpBonus,
  restorepackages,
  // updateAllowedStates,
  createBlockingDomain,
  deleteBlockedDomain,
  updateBlockedDomain,
  updatePromocodeBlocked,
  uploadPromocodeCsv,
  reusePackageRequest,
  createLadderPackageRequest,
  createEmailCenter,
  sendEmailTest,
  sendUploadedCsv,
  getEmailCenter,
  updateEmailCenter,
  deleteEmailCenter,
  reorderTournaments,
  cancelTournament,
  bootPlayerTournament,
  payoutTournamentPlayers,
  addFreeEntryOfPlayer,
  createRedeemRule,
  updateAmoeBonusTime,
  reusePromocodeRequest,
  markNotificationStatus,
  setNotificationCenterSettings,
  sendUploadedRedeemCsv,
  dailyBonusStreak,
  updateDailyBonusStreak,
  uploadTournamentCsv,
  packageAutomationRequest,
  uploadPackageCsv,
  markAllNotificationStatus,
  deleteRedeemUser,
  createMaintenanceMode,
  editMaintenanceMode,
  deleteMaintenanceMode,
  updateMaintenanceModeTime,
  updateStatusMaintenanceMode,
  deleteRibbonMode,
  createRibbonMode,
  markAllCriticalNotificationStatus,
  updateUserVipStatus,
  updateLoyaltyTier,
  updatePaymentProvider,
  updateBannerStatus,
  createVipQuestions,
  deleteVipQuestion,
  updateVipQuestionStatus,
  updateVipQuestion,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  createJackpot,
  updateJackpot,
  deleteJackpot,
  sendPromoCodeCsv,
  reorderQuestion,
  uploadImage,
  deleteAggregator,
  hideProvider,
  hideGames,
  getPackageImageUrl,
  updateVipManagedBy,
  addFaq,
  deleteFaq,
  createCanadianUser,
  createPromotionManagement,
  deletePromotionManagement,
  updatePromotionManagement,
  patchPromotionManagement,
  uploadFreeSpinUserCsv,
  deleteFreeSpinUsers,
  createFreeSpinGrant,
  cancelFreeSpin,
  updateFreeSpinGrant,
  createScratchCard,
  updateScratchCard,
  updateDiscardUser,
  getGeneratedRNGJackpot,
  createGame,
  addGameFaq,
  deleteGameFaq,
  deleteGamePage,
  updateGamePageStatus,
  updateGamePage,
  createGameCard,
  updateGameCard,
  deleteGameCard,
  reuseScratchCardDetails,
  deleteScratchCard,
  resetScratchCardBudget,
  createScratchCardBudget,
  createScratchCardImage,
  updateStatusSubscriptionFeature,
  updateSubscriptionFeature,
  uploadVipUserCsv,
  createSubscription,
  updateSubscription,
  updateSubscriptionStatus,
  cancelUserSubscription,
  createProviderRates,
  updateProviderRates,
  deleteProviderRates,
  createGameRateDiscount,
  updateGameRateDiscount,
  deleteGameRateDiscount,
} from '../../../utils/apiCalls';
// import { crashGameCancelBetUrl, crashGameEscapeBetUrl, crashGamePlaceBetUrl, updateUnseenCountUrl, loginUrl } from '../../axios/urls'

// Add Daily Limits mutations hook
const setDailyLimitsMutation = ({ body }) => setDailyLimits(body);

export const errorHandler = (err) => {
  if (err?.response?.data?.errors.length > 0) {
    const { errors } = err.response.data;
    errors.map((error) => {
      if (error?.description) {
        toast(error?.description, 'error');
      }
    });
  }
};

export const useSetDailyLimitsMutation = () => {
  return useMutation({
    mutationFn: setDailyLimitsMutation,
    retry: 0,
  });
};

// Add Deposit limits custom mutations hook
const setDepositLimitsMutation = ({ body }) => setDepositLimits(body);

export const useSetDepositLimitsMutation = () => {
  return useMutation({
    mutationFn: setDepositLimitsMutation,
    retry: 0,
  });
};

// Add Loss Limits custom mutations hook
const setLossLimitsMutation = ({ body }) => setLossLimits(body);

export const useSetLossLimitsMutation = () => {
  return useMutation({
    mutationFn: setLossLimitsMutation,
    retry: 0,
  });
};

// Add Session time custom mutations hook
const setSessionTimeMutation = ({ body }) => setSessionTime(body);

export const useSetSessionTimeMutation = () => {
  return useMutation({
    mutationFn: setSessionTimeMutation,
    retry: 0,
  });
};

// Add Disable until custom mutations hook
const setDisableUntilMutation = ({ body }) => {
  return setDisableUntil(body);
};

export const useDisableUntilMutation = () => {
  return useMutation({
    mutationFn: setDisableUntilMutation,
    retry: 0,
  });
};

// Add Disable until custom mutations hook
// const updateMoneyMutation = ({ body }) => {
//   return updateMoney(body);
// };

// export const useUpdateMoneyMutation = () => {
//   return useMutation({
//     mutationFn: updateMoneyMutation,
//     retry: 0,
//   });
// };

// Add Disable until custom mutations hook
const updateVerifyDocumentMutation = (body) => {
  return updateVerifyDocumentRequest(body);
};

export const useUpdateVerifyDocumentMutation = () => {
  return useMutation({
    mutationFn: updateVerifyDocumentMutation,
    retry: 0,
  });
};
// Add Disable until custom mutations hook
const updateRequestDocumentMutation = (body) => {
  return updateRequestDocumentRequest(body);
};

export const useUpdateRequestDocumentMutation = () => {
  return useMutation({
    mutationFn: updateRequestDocumentMutation,
    retry: 0,
  });
};
// Add Disable until custom mutations hook
const cancelDocumentMutation = (body) => {
  return cancelDocumentRequest(body);
};

export const useCancelDocumentMutation = () => {
  return useMutation({
    mutationFn: cancelDocumentMutation,
    retry: 0,
  });
};

// Create package custom mutations hook
const createPackageMutation = (body) => {
  return createPackageRequest(body);
};

const createLadderPackageMutation = (body) => {
  return createLadderPackageRequest(body);
};

export const useCreatePackageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createPackageMutation,
    retry: 0,
    onSuccess,
    onError,
  });
};

export const useCreateLadderPackageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createLadderPackageMutation,
    retry: 0,
    onSuccess,
    onError,
  });
};

// Update package custom mutations hook
const updatePackageMutation = (body) => {
  return updatePackageRequest(body);
};

export const useUpdatePackageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePackageMutation,
    retry: 0,
    onSuccess,
    onError,
  });
};

export const usePackageAutomationMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: packageAutomationRequest,
    retry: 0,
    onSuccess,
    onError,
  });
};

export const useReorderPackageMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderPackages,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useReorderQuestionMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderQuestion,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
//reorderFtpBonus
export const useReorderFtpBonusMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderFtpBonus,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useUpdateStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatus,
    onSuccess,
    onError,
  });
};

export const useSubscriptionStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateSubscriptionStatus,
    onSuccess,
    onError,
  });
};

export const useUpdateBlogStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateBlogStatus,
    onSuccess,
    onError,
  });
};

export const useUpdateGamePageStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateGamePageStatus,
    onSuccess,
    onError,
  });
};

export const useUpdateAggregatorsStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateAggregatorsStatus,
    onSuccess,
    onError,
  });
};

export const useCreateDailyBonusMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createDailyBonus,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateReasonMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: setUserBanReason,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateUserBanStatus = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserBanStatus,
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      queryClient.invalidateQueries(['playersList']); // Invalidate the players list query to refetch
    },
    onError,
  });
};

export const useUpdateAmoeBonusTime = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateAmoeBonusTime(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useMaintenanceModeAlertTime = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateMaintenanceModeTime(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

const useUpdateUserBanReason = (body) => {
  return updateUserBanReason(body);
};

export const useUpdateUserBanReasonQuery = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: useUpdateUserBanReason,
    retry: 0,
    onSuccess,
    onError,
  });
};

export const useDeletePlayerBanReason = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteUserBanReason(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateBonusMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createBonus,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateBonusMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateBonus,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useUpdateDailyBonusStreakMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateDailyBonusStreak,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateBonusStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateBonusStatus,
    onSuccess,
    onError,
  });
};
export const useUpdateBannerStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateBannerStatus,
    onSuccess,
    onError,
  });
};
export const useUpdatePromotionManagementStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: patchPromotionManagement,
    onSuccess,
    onError,
  });
};
export const useDeleteBonus = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteBonus(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateCMSMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createCms,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateBlogMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createBlog,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};


export const useCreateGamePageMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createGame,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateGamePageCardMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createGameCard,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};


export const useEditGamePageCardMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateGameCard,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};


export const useAddFaqMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: addFaq,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useAddGameFaqMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: addGameFaq,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateEmailTemplateMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createEmailTemplate,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateCMSMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateCms,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};


export const useDeleteCms = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteCms(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateManualTemplateMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateManualTemplate,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUploadGalleryImage = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => uploadImage(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteGalleryImage = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteImage(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};


export const useDeleteBlog = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteBlog(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteGamePage = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteGamePage(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteGameFaq = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteGameFaq(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteGameCard = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteGameCard(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteFaq = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteFaq(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};


export const useLogoutUser = ({ onSuccess }) => {
  return useMutation({
    mutationFn: adminLogout,
    retry: 0,
    onSuccess,
  });
};

export const useCreateStaffAdminMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => createStaffAdmin(data),
    retry: 0,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useAffiliateMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['addAffiliate'],
    mutationFn: (data) => createAffiliateUser(data),
    onSuccess,
    onError,
  });
};

export const useApproveAffiliateMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['addAffiliate'],

    mutationFn: (data) => approvedAffiliateUser(data),
    onSuccess,
    onError,
  });
};

export const useUpdateStaffMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateStaffAdmin(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteStaff = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteStaff(data),
    onSuccess,
    onError,
  });
};
export const useDeletePackages = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deletePackageRequest(data),
    onSuccess,
    onError,
  });
};
export const useReusePackages = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => reusePackageRequest(data),
    onSuccess,
    onError,
  });
};
export const useDeleteFtpBonus = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteftpBonuses(data),
    onSuccess,
    onError,
  });
};

export const useUpdateProfileMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess,
    onError,
  });
};

export const useUpdateAffiliateProfileMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => ChangeAffiliatePassword(data),
    onSuccess,
    onError,
  });
};

export const useUpdateAffiliateMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateAffiliateProfile(data),
    onSuccess,
    onError,
  });
};

export const useUpdateEmailTemplateMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateEmailTemplate(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useUpdateRedeemRuleMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateRedeemRule(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useTestEmailTemplateMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => testEmailTemplate(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteEmailTemplete = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteEmailTemplete(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateConfigMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateConfig(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateCredsMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => updateCreds(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateCasinoProvidersMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createCasinoProvider,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateCasinoProvidersMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateCasinoProvider,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteProvider = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteProvider(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useHideProvider = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => hideProvider(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useHideGames = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => hideGames(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateBannerMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createBanner,
    onSuccess,
    onError,
  });
};
export const useCreatePromotionManagementMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createPromotionManagement,
    onSuccess,
    onError,
  });
};
export const useUpdateBannerMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateBanner,
    onSuccess,
    onError,
  });
};
export const useUpdatePromotionManagementMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePromotionManagement,
    onSuccess,
    onError,
  });
};
export const useDeleteBanner = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteBanner(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useDeletePromotionManagement = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deletePromotionManagement(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useDeleteScratchCard = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteScratchCard(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteTournament = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteTournament(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteTier = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteTier(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteCasinoGame = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteCasinoGame(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteRestrictedItem = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteRestrictedItem(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateCasinoGame = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateCasinoGame,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

// export const useCreateCasinoCategoryMutation = ({ onSuccess, onError }) => {
//   return useMutation({
//     mutationFn: createCasinoCategory,
//     onSuccess,
//     onError,
//   });
// };

export const useCreateTournamentsMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createTournament,
    onSuccess,
    onError,
  });
};

export const useCreateSubscriptionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createSubscription,
    onSuccess,
    onError,
  });
};

export const useUpdateSubscriptionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateSubscription,
    onSuccess,
    onError,
  });
};

export const useCreateTierMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createTier,
    onSuccess,
    onError,
  });
};

export const useCreateTournamentsCronMutation = () => {
  return useMutation({
    mutationFn: createTournamentCron,
  });
};

// export const useUpdateCasinoCategoryMutation = ({ onSuccess, onError }) => {
//   return useMutation({
//     mutationFn: updateCasinoCategory,
//     onSuccess,
//     onError,
//   });
// };
export const useCreateEmailCenter = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createEmailCenter,
    onSuccess,
    onError,
  });
};
export const useCreateMaintenanceMode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createMaintenanceMode,
    onSuccess,
    onError,
  });
};
export const useCreateRibbonMode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createRibbonMode,
    onSuccess,
    onError,
  });
};
export const useEditMaintenanceMode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: editMaintenanceMode,
    onSuccess,
    onError,
  });
};
export const useDeleteMaintenanceMode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteMaintenanceMode,
    onSuccess,
    onError,
  });
};
export const useDeleteFreeSpin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteMaintenanceMode,
    onSuccess,
    onError,
  });
};
export const useDeleteRibbonMode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteRibbonMode,
    onSuccess,
    onError,
  });
};
export const useRedeemRuleMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createRedeemRule,
    onSuccess,
    onError,
  });
};
export const useSendTestMail = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: sendEmailTest,
    onSuccess,
    onError,
  });
};
export const useUploadCsv = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: sendUploadedCsv,
    onSuccess,
    onError,
  });
};
export const useUploadRedeemCsv = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: sendUploadedRedeemCsv,
    onSuccess,
    onError,
  });
};
export const useUploadPromoCodeCsv = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: sendPromoCodeCsv,
    onSuccess,
    onError,
  });
};
export const useUpdateEmailCenter = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateEmailCenter,
    onSuccess,
    onError,
  });
};
export const useGetEmailCenter = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: getEmailCenter,
    onSuccess,
    onError,
  });
};
export const useDeleteEmailCenter = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteEmailCenter,
    onSuccess,
    onError,
  });
};
export const useUpdateTournamentMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateTournaments,
    onSuccess,
    onError,
  });
};

export const useUpdateTierMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateTier,
    onSuccess,
    onError,
  });
};

export const useUpdateTournamentCronMutation = () => {
  return useMutation({
    mutationFn: updateTournamentsCron,
  });
};

export const useUpdateStatusTournamentMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusTournament,
    onSuccess,
    onError,
  });
};
export const useUpdateStatusTierMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusTier,
    onSuccess,
    onError,
  });
};

export const useUpdateFtpStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateFtpStatus,
    onSuccess,
    onError,
  });
};
export const useUpdateUserTierMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateUserTier,
    onSuccess,
    onError,
  });
};

export const useUpdateFtpBonusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateftpBonus,
    onSuccess,
    onError,
  });
};
export const useRestorePackageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: restorepackages,
    onSuccess,
    onError,
  });
};
//createFtpBonus
export const useCreateFtpBonusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createFtpBonus,
    onSuccess,
    onError,
  });
};

// export const useReorderCasinoCategoriesMutation = ({ onSuccess, onError }) => {
//   return useMutation({
//     mutationFn: reorderCasinoCategory,
//     onSuccess,
//     onError: (error) => errorHandler(error),
//   });
// };

export const useReorderCasinoProvidersMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderCasinoProvider,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteCasinoSubCategory = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteCasinoSubCategory(data),
    onSuccess,
    onError,
  });
};

export const useCreateCasinoSubCategoryMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: createCasinoSubCategory,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateCasinoSubCategoryMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateCasinoSubCategory,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useReorderCasinoSubCategoriesMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderCasinoSubCategory,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useAddGamesToSubCategory = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: addGamestoSubCategory,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

// export const useAddRestrictedCountries = ({ onSuccess, _onError }) => {
//   return useMutation({
//     mutationFn: updateRestrictedCountries,
//     onSuccess,
//     onError: (error) => errorHandler(error), 
//   });
// };

// export const useDeleteRestrictedCountries = ({ onSuccess, _onError }) => {
//   return useMutation({
//     mutationFn: deleteRestrictedCountries,
//     onSuccess,
//     onError: (error) => errorHandler(error),
//   });
// };
export const useReorderSubCategoryGamesMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderCasinoSubCategoryGames,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateRestrictedItemMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateRestrictedItems,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUploadGamesMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: uploadrubyPlayGames,
    onSuccess,
    onError,
  });
};

export const useUpdateWithdrawRequestMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateWithdrawRequest,
    onSuccess,
    onError,
  });
};

export const useRedeemMoreDetailMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: getRedeemMoreDetail,
    onSuccess,
    onError,
  });
};

export const useGetRedeemRequestMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: getUserWithdrawRequests,
    onSuccess,
    onError,
  });
};

export const useUpdateRedeemRulesMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateRedeemRule,
    onSuccess,
    onError,
  });
};

export const useUpdateRedeemRequestMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: approveRedeemRequests,
    onSuccess,
    onError,
  });
};

export const useGetSkrillBalanceMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: getSkrillBalance,
    onSuccess,
    onError,
  });
};

export const useDeleteRedeemRulesMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteRedeemRule,
    onSuccess,
    onError,
  });
};

export const useUpdateUserStatus = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess,
    onError,
  });
};

export const useUpdate2FaAuthStatus = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: update2FaAuthStatus,
    onSuccess,
    onError,
  });
};

export const useUpdateResponsibleMutuation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateResponsibleStatus,
    onSuccess,
    onError,
  });
};
export const useCreateBudgetMutuation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createScratchCardBudget,
    onSuccess,
    onError,
  });
};
export const useResetLimitMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => resetUserResponsibleSetting(data),
    onSuccess,
    onError,
  });
};
export const useResetBudegetMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => resetScratchCardBudget(data),
    onSuccess,
    onError,
  });
};
export const usePlayerBankMutuation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: addPlayerBankDetail,
    onSuccess,
    onError,
  });
};

export const useUpdatePlayerInfo = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePlayerInfo,
    onSuccess,
    onError,
  });
};
export const useUploadAMOEMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: uploadAmoeFile,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDeleteRedeemUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteRedeemUser,
    onSuccess,
    onError,
  });
};
export const useAddUpdateActivityLog = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: addFavActivityLog,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdatePlayerPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePlayerPwd,
    onSuccess,
    onError,
  });
};

// Add/deduct money
export const useUpdateCoinMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateMoney,
    onSuccess,
    onError,
  });
};
// Add/deduct Staff money
export const useUpdateStaffCoinMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStaffMoney,
    onSuccess,
    onError,
  });
};

export const useUpdateRemovePwLock = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateRemovePwLock,
    onSuccess,
    onError,
  });
};

// delete user name UserProfanity
export const useDeleteUsername = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteUsername(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateSocialSecurity = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateSocialSecurity,
    onSuccess,
    onError,
  });
};

// export const useAddComments = ({ onSuccess, onError }) => {
//   return useMutation({
//     mutationFn: addComments,
//     onSuccess,
//     onError,
//   });
// };

// export const useAssignTicket = ({ onSuccess, _onError }) => {
//   return useMutation({
//     mutationFn: assignTicket,
//     onSuccess,
//     onError: (error) => errorHandler(error),
//   });
// };

// Player Force logout
export const useUpdatePlayerForceLogout = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: playerForceLogout,
    onSuccess,
    onError,
  });
};

export const useUploadUserDocumetMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: uploadUserDocs,
    onSuccess,
    onError,
  });
};

export const useVerifyOtpMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => verifyOtp(data),
    onSuccess,
    onError,
  });
};

export const useVerify2FAMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['verify2FA'],
    mutationFn: (data) => verify2FA(data),
    onSuccess,
    onError,
  });
};

export const useDisable2FAMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['useDisable2FAMutation'],
    mutationFn: (data) => disable2FA(data),
    onSuccess,
    onError,
  });
};

export const useUpdateRuleMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateRuleStatus,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateContentPageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createContentPage,
    onSuccess,
    onError,
  });
};

export const useUpdateContentPageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateContentPage,
    onSuccess,
    onError,
  });
};

export const useDeleteContentPage = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteContentPage(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateSEODetailsMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateSeoDetails,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useAddAssetMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: addPageAsset,
    onSuccess,
    onError,
  });
};

export const useUpdateAssetMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePageAsset,
    onSuccess,
    onError,
  });
};

export const useDeleteAsset = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => deleteAsset(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const usePaymentRefundMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: paymentRefund,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateUserKYCMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateUSerKYC,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useDownloadActivityCsvMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['downloadActivityCsv'],
    mutationFn: (params) => getActivityTable(params),
    onSuccess,
    onError,
  });
};

export const useCheckLexisNexisMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => checkManualLexisNexis(data),
    onSuccess,
    onError,
  });
};

export const useDeleteAffiliate = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteAffiliate(data),
    onSuccess,
    onError,
  });
};

// check redeem status
export const useFetchWithdrawRequestStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['fetchRedeemStatus'],
    mutationFn: (data) => fetchWithdrawRequests(data),
    onSuccess,
    onError,
  });
};

export const useCreateRaffleMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createRaffle,
    onSuccess,
    onError,
  });
};
export const useUpdateRaffleMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateRaffle,
    onSuccess,
    onError,
  });
};
export const useUpdateSpinWheelMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateSpinWheel,
    onSuccess,
    onError,
  });
};
export const useUpdateStatusRaffleMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusRaffle,
    onSuccess,
    onError,
  });
};
export const usePayoutUserSearchMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: getPayoutUserSearch,
    onSuccess,
    onError,
  });
};
export const useRafflePayoutMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: rafflePayout,
    onSuccess,
    onError,
  });
};
export const useCreatePromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createPromotionBonus,
    onSuccess,
    onError,
  });
};

export const useUpdatePromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePromotion,
    onSuccess,
    onError,
  });
};

export const useUpdateStatusPromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusPromotion,
    onSuccess,
    onError,
  });
};
export const useUpdateStatusMaintenanceMode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusMaintenanceMode,
    onSuccess,
    onError,
  });
};

export const useDeletePromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deletePromotion,
    onSuccess,
    onError,
  });
};

export const useCreatePromoCodeMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createPromoCode,
    onSuccess,
    onError,
  });
};

export const useUpdatePromoCodeMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePromoCode,
    onSuccess,
    onError,
  });
};

export const useDeletePromoCodeMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess,
    onError,
  });
};

export const useHideAggregatorMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteAggregator,
    onSuccess,
    onError,
  });
};

export const useCreateDomainBlockMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createBlockingDomain,
    onSuccess,
    onError,
  });
};

export const useUpdateDomainBlockMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateBlockedDomain,
    onSuccess,
    onError,
  });
};

export const useDeleteDomainBlockMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteBlockedDomain,
    onSuccess,
    onError,
  });
};

export const useGetRandomPromoCodeMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: getRandomPromoCode,
    onSuccess,
    onError,
  });
};

export const useAddCasinoGameMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: addGames,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateCRMPromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createCRMPromotionBonus,
    onSuccess,
    onError,
  });
};

export const useUpdateCRMPromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateCRMPromotion,
    onSuccess,
    onError,
  });
};

export const useUpdateStatusCRMPromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusCRMPromotion,
    onSuccess,
    onError,
  });
};

export const useDeleteCRMPromotionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteCRMPromoCode,
    onSuccess,
    onError,
  });
};

export const useCreateReferralBonusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createReferralBonus,
    onSuccess,
    onError,
  });
};
export const useCreateDailyBonusStreakMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: dailyBonusStreak,
    onSuccess,
    onError,
  });
};

// export const useUpdateAllowedStates = ({ onSuccess, onError }) => {
//   return useMutation({
//     mutationFn: updateAllowedStates,
//     onSuccess,
//     onError,
//   });
// };

// Promocode Block Players
export const useUpdatePromocodeBlockedPlayersMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updatePromocodeBlocked,
    onSuccess,
    onError,
  });
};

export const useUploadCsvPromocodeBlockedMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: uploadPromocodeCsv,
    onSuccess,
    onError,
  });
};

export const useUploadCsvPackageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: uploadPackageCsv,
    onSuccess,
    onError,
  });
};

export const useUploadCsvTournamentMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => uploadTournamentCsv(data),
    onSuccess,
    onError,
  });
};

export const useReorderTournamentMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: reorderTournaments,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCancelTournament = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: (data) => cancelTournament(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCancelUserSubscription = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => cancelUserSubscription(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCancelFreeSpin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => cancelFreeSpin(data),
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};
export const useBootPlayerTournamentMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => bootPlayerTournament(data),
    onSuccess,
    onError,
  });
};
export const useBootFreeSpinMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateDiscardUser(data),
    onSuccess,
    onError,
  });
};
export const usePayoutTournamentMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => payoutTournamentPlayers(data),
    onSuccess,
    onError,
  });
};

export const useGetPackageImageUrlMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: () => getPackageImageUrl(),
    onSuccess,
    onError,
  });
};

export const useAddFreeEntryOfPlayerMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => addFreeEntryOfPlayer(data),
    onSuccess,
    onError,
  });
};

export const useReusePromocode = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => reusePromocodeRequest(data),
    onSuccess,
    onError,
  });
};

export const useMarkNotificationReadMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => markNotificationStatus(data),
    onSuccess,
    onError,
  });
};

export const useMarkAllNotificationReadMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => markAllNotificationStatus(data),
    onSuccess,
    onError,
  });
};
export const useMarkAllCriticalNotificationReadMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => markAllCriticalNotificationStatus(data),
    onSuccess,
    onError,
  });
};

export const useSetNotificationsSettingsMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => setNotificationCenterSettings(data),
    onSuccess,
    onError,
  });
};

export const useUpdateUserVipStatus = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateUserVipStatus(data),
    onSuccess,
    onError,
  });
};

export const useUpdateVipUserLoyaltyTier = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateLoyaltyTier(data),
    onSuccess,
    onError,
  });
};

export const useUpdateVipManager = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateVipManagedBy(data),
    onSuccess,
    onError,
  });
};

export const useUploadVipUserCsvMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: uploadVipUserCsv,
    onSuccess,
    onError,
  });
};

export const useUpdatePaymentProviderMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updatePaymentProvider(data),
    onSuccess,
    onError
  })
}

export const useUpdateBlogMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateBlog,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useUpdateGamePageMutation = ({ onSuccess, _onError }) => {
  return useMutation({
    mutationFn: updateGamePage,
    onSuccess,
    onError: (error) => errorHandler(error),
  });
};

export const useCreateQuestionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createVipQuestions(data),
    onSuccess,
    onError
  })
}

export const useDeleteVipQuestion = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteVipQuestion(data),
    onSuccess,
    onError,
  });
};

export const useUpdateVipQuestionStatusMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateVipQuestionStatus(data),
    onSuccess,
    onError
  })
}

export const useUpdateVipQuestionMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateVipQuestion(data),
    onSuccess,
    onError
  })
}

export const useCreateJackpotMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createJackpot(data),
    onSuccess,
    onError
  })
}

export const useCreateProviderRateMatrixMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createProviderRates(data),
    onSuccess,
    onError
  })
}

export const useUpdateProviderRateMatrixMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateProviderRates(data),
    onSuccess,
    onError
  })
}

export const useDeleteProviderRateMatrixMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteProviderRates(data),
    onSuccess,
    onError
  })
}

export const useCreateGameRateDiscountMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createGameRateDiscount(data),
    onSuccess,
    onError
  })
}

export const useUpdateGameRateDiscountMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateGameRateDiscount(data),
    onSuccess,
    onError
  })
}

export const useDeleteGameRateDiscountMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteGameRateDiscount(data),
    onSuccess,
    onError
  })
}

export const useUpdateJackpotMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateJackpot(data),
    onSuccess,
    onError
  })
}

export const useDeleteJackpotMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => deleteJackpot(data),
    onSuccess,
    onError
  })
}
export const useCreateCanadianUserMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createCanadianUser(data),
    onSuccess,
    onError
  })
}

export const useUploadCsvFreeSpinMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: uploadFreeSpinUserCsv,
    onSuccess,
    onError,
  });
};

export const useDeleteUserFreeSpinMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: deleteFreeSpinUsers,
    onSuccess,
    onError
  })
}
export const useUpdateFreeSpinGrantMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateFreeSpinGrant,
    retry: 0,
    onSuccess,
    onError,
  });
}
export const useCreateFreeSpinGrantMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createFreeSpinGrant,
    retry: 0,
    onSuccess,
    onError,
  });
};

export const useCreateScratchCardMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createScratchCard(data),
    onSuccess,
    onError
  })
}
export const useCreateScratchCardImageMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => createScratchCardImage(data),
    onSuccess,
    onError
  })
}
export const useUpdateScratchCardMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => updateScratchCard(data),
    onSuccess,
    onError
  })
}
export const useRngGenerateJackpotMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => getGeneratedRNGJackpot(data),
    onSuccess,
    onError
  })
}
export const useReuseScratchCardMutation = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (data) => reuseScratchCardDetails(data),
    onSuccess,
    onError,
  });
};

export const useUpdateStatusSubscriptionFeature = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateStatusSubscriptionFeature,
    onSuccess,
    onError
  })
}

export const useUpdateSubscriptionFeature = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: updateSubscriptionFeature,
    onSuccess,
    onError
  })
}
