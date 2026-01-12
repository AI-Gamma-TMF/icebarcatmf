import { Route, Routes, Navigate } from 'react-router-dom'
import { AdminRoutes } from '../../routes'
import NotFound from '../NotFound'
import AdminSignIn from '../AdminSignin'
import PrivateRoute from '../../components/PrivateRoute'
import EditPackageDetails from '../Packages/components/EditPackageDetails'
import CreatePackages from '../Packages/components/CreatePackages'
import Packages from '../Packages'
import PlayerDetails from '../PlayerDetails'
import Players from '../Players'
import Dashboard from '../Dashboard'
import CMSListing from '../CMS'
import CMSDetail from '../CMS/components/CmsDetail'
import EditCms from '../CMS/components/EditCms'
import CreateCms from '../CMS/components/CreateCms'
import ImageGallery from '../ImageGallery'
import Staff from '../Staff'
// import Countries from "../Countries";
import CreateStaffAdmin from '../Staff/components/CreateStaffAdmin'
import EditStaffAdmin from '../Staff/components/EditStaffAdmin'
import AdminDetails from '../AdminDetails'
import EmailTemplate from '../EmailTemplate'
import ProfilePage from '../ProfilePage'
import CasinoProviders from '../CasinoProviders'
import CasinoAggregator from '../CasinoManagement/Aggregators/index'
import BannerManagement from '../BannerManagement'
import CasinoCategory from '../CasinoCategory'
import ReorderCategory from '../CasinoCategory/components/ReorderCategory'
import CasinoSubCategory from '../CasinoSubCategory'
import CasinoGames from '../CasinoGames'
import ReorderSubCategory from '../CasinoSubCategory/components/ReorderSubCategory'
import AddSubCategoryGames from '../AddSubCategoryGames'
// import RestrictProviderCountries from "../RestrictProviderCountries";
import GameReorder from '../GameReorder'
import RestrictedProviders from '../RestrictedProviders'
import RestrictedGames from '../RestrictedGames'
import CreateEmailTemplate from '../EmailTemplate/createEmailTemplate'
import EditManualTemplate from '../EmailTemplate/EditManualTemplate'
import BonusListing from '../Bonus'
import CreateBonus from '../Bonus/components/CreateBonus'
import EditBonus from '../Bonus/components/EditBonus'
import BonusDetail from '../Bonus/components/BonusDetail'
import CasinoTransaction from '../CasinoTransaction'
import BankingTransaction from '../BankingTransaction'
import WithdrawRequests from '../WithdrawRequest'
import ReorderPackages from '../Packages/components/ReorderPackages'
import ReorderFtpBonus from '../Packages/components/ReorderFtpBonusPage'
import ContentPageDetails from '../ContentPages/components/PageDetails/ContentPageDetails'
import AdminAffiliate from '../AdminAffiliate'
import CreateAffiliate from '../AdminAffiliate/components/CreateAffiliate'
import EditAffiliate from '../AdminAffiliate/components/EditAffiliate'
import Tournaments from '../Tournaments'
import CreateTournament from '../Tournaments/components/CreateTournament'
import EditTournament from '../Tournaments/components/EditTournament'
import ViewTournament from '../Tournaments/components/ViewTournament'
import ViewTier from '../Tier/components/ViewTier'
import EditTier from '../Tier/components/EditTier'
import CreateTier from '../Tier/components/CreateTier'
import Tiers from '../Tier'
import Raffle from '../Raffle'
import CreateRaffle from '../Raffle/component/CreateRaffle'
import EditRaffle from '../Raffle/component/EditRaffle'
import RafflePayout from '../Raffle/component/RafflePayout'
import ViewRaffle from '../Raffle/component/ViewRaffle'
// import PromotionBonus from "../PromotionBonus";
import CreatePromotionBonus from '../PromotionBonus/component/CreatePromotionBonus'
import EditPromotionBonus from '../PromotionBonus/component/EditPromotionBonus'
import ViewPromotionBonus from '../PromotionBonus/component/ViewPromotionBonus'
import SpinWheel from '../SpinWheel'
import EditSpinWheel from '../SpinWheel/EditSpinWheel'
import PromoCodeBonus from '../Promocode'
import CreatePromoCode from '../Promocode/component/CreatePromoCode'
import EditPromoCode from '../Promocode/component/EditPromoCode'
import ViewPromoCode from '../Promocode/component/ViewPromoCode'
import ReferralBonusListing from '../ReferralBonus'
import CreateReferralBonus from '../ReferralBonus/components/CreateReferralBonus'
import EditReferralBonus from '../ReferralBonus/components/EditReferralBonus'
import ReferralBonusDetail from '../ReferralBonus/components/ReferralBonusDetail'
import RedeemRequestRule from '../WithdrawRequest/Components/RedeemRequestRule'
import CreateRedeemRules from '../WithdrawRequest/Components/CreateRedeemRules'
// import EditRedeemRules from '../WithdrawRequest/Components/EditRedeemRules';
import ReorderProvider from '../CasinoProviders/components/ReorderProvider'
import ViewPackages from '../Packages/components/ViewPackages'
import VaultData from '../VaultData'
import UnarchivePage from '../Packages/components/UnarchivePage'
import ExportCenter from '../ExportCenter'
import AmoeData from '../../components/Amoe/AmoeData'
// import GeoBlocking from '../GeoBlocking'
import DomainBlocking from '../DomainBlocking'
import CreateBlockDomain from '../DomainBlocking/component/CreateBlockDomain'
import EditBlockedDomain from '../DomainBlocking/component/EditBlockedDomain'
import PromoCodeBlocking from '../PromoCodeBlocking'
import CRMPromoBonus from '../CRMPromotion'
import CreateCRMPromoBonus from '../CRMPromotion/component/CreatePromoCode'
import EditCRMPromoBonus from '../CRMPromotion/component/EditPromoCode'
import ViewCRMPromoBonus from '../CRMPromotion/component/ViewPromoCode'
import CreateCRMPromoCode from '../CRMPromoCode/component/CreatePromoCode'
import EditCRMPromoCode from '../CRMPromoCode/component/EditPromoCode'
import ViewCRMPromoCode from '../CRMPromoCode/component/ViewPromoCode'
import CRMPromoCode from '../CRMPromoCode'
import ViewMoreCRMPromoBonus from '../CRMPromotion/component/ViewMore'
import ViewArchivePackages from '../Packages/components/ViewArchivePackages'
import ReorderTournaments from '../Tournaments/components/ReorderTournaments'
import EmailCenter from '../EmailCenter'

import SendMail from '../EmailCenter/components/SendMail'
import CreateEmail from '../EmailCenter/components/CreateEmail'
import EditTemplate from '../EmailCenter/components/EditTemplate'
import ArchivedPromocodes from '../Promocode/component/ArchivedPromocodes'
import ViewArchivedPromoCode from '../Promocode/component/ViewArchivedPromocodes'
import NotificationCenter from '../NotificationCenter/NotificationCenter'
import DailyBonusStreakListing from '../DailyBonusStreak'
import RedeemRule from '../RedeemRule'
import CreateRedeemRule from '../RedeemRule/components/CreateRedeemRule'
import EditRule from '../RedeemRule/components/EditRedeemRule'
import RedeemUserSelect from '../RedeemRule/components/RedeemUserSelect'
import ViewRedeemUser from '../RedeemRule/components/ViewRedeemUser'
import PackageAutomation from '../packageAutomation'
import StaffTransactionDetails from '../AdminAddedCoins/Components/StaffTransactionDetails'
import StaffSCCreditDetails from '../AdminAddedCoins/StaffSCCreditDetails'
import VipDashboard from '../VipManagement/components/VipDashboard'
import CustomerManagement from '../VipManagement/components/CustomerManagement'
import PendingVipPlayers from '../VipManagement/components/PendingVipPlayers'
import VipPlayerDetails from '../VipManagement/components/VipPlayerDetails'
import MaintenanceMode from '../MaintenanceMode'
import CreateMaintenanceMode from '../MaintenanceMode/components/CreateMaintenanceMode'
import EditMaintenanceMode from '../MaintenanceMode/components/EditMaintenanceMode'
import PaymentProvider from '../PaymentProvider/Components/PaymentProvider'
import GameDashboard from '../CasinoGameDashboard'
import BlogsListing from '../Blogs'
import CreateBlog from '../Blogs/components/CreateBlog'
import BlogDetail from '../Blogs/components/BlogDetail'
import EditBlog from '../Blogs/components/EditBlog'
import VipDashboardHelp from '../VipManagement/components/VipDashboardHelp'
import VipformQuestions from '../VipManagement/components/VipFormQuestions'
import VipEditQuestion from '../VipManagement/components/VipFormQuestions/VipEditQuestion'
import VipCreateQuestions from '../VipManagement/components/VipFormQuestions/VipCreateQuestions'
import VipViewQuestion from '../VipManagement/components/VipFormQuestions/VipViewQuestion'
import DuplicateTournament from '../Tournaments/components/duplicateTournament'
import VipReorderQuestion from '../VipManagement/components/VipFormQuestions/VipReorderQuestion'
import VipFormPreview from '../VipManagement/components/VipFormQuestions/FormPreview'
import JackpotSettings from '../Jackpot'
import CreateJackpot from '../Jackpot/components/CreateJackpot'
import EditJackpot from '../Jackpot/components/EditJackpot'
import ViewFaq from '../Blogs/components/VIewFaq'
import PurchaseReport from '../Reports/PurchaseReport'

import BonusReport from '../Reports/BonusReport'
import PromotionManagement from '../PromotionManagement'
import FreeSpinGames from '../CasinoManagement/FreeSpin'
import FreeSpinCreate from '../CasinoManagement/FreeSpin/FreeSpinCreate'
import Scratchcard from '../ScratchCard'
import CreateScratchCard from '../ScratchCard/component/CreateScratchCard'
import GamePageListing from '../DynamicGamePage'
import CreateGamePage from '../DynamicGamePage/components/CreateGamePage'
import GamePageDetail from '../DynamicGamePage/components/GamePageDetail'
import EditGamePage from '../DynamicGamePage/components/EditGamePage'
import ViewGamePageFaq from '../DynamicGamePage/components/ViewGamePageFaq'
import CreateGamePageCard from '../DynamicGamePage/components/CreateGamePageCard'
import ViewGameCard from '../DynamicGamePage/components/ViewGameCard'
import EditGamePageCard from '../DynamicGamePage/components/EditGameCard'
import ViewFreeSpinUser from '../CasinoManagement/FreeSpin/ViewFreeSpinUser'
import EditFreeSpin from '../CasinoManagement/FreeSpin/EditFreeSpin'
import ViewFreeSpin from '../CasinoManagement/FreeSpin/ViewFreeSpin'
import ViewScratchCard from '../ScratchCard/component/ViewScratchCard'
import VipManagerCommissionReport from '../VipManagement/components/VipManagerCommissionReport'
import ScheduledEvents from '../Calendar/Components/ScheduledEvents'
import SubscriptionFeature from '../Subscription/SubscriptionFeature'
import SubscriptionPlan from '../Subscription/SubscriptionPlan'
import CreateSubscriptionPlan from '../Subscription/CreateSubscriptionPlan'
import EditSubscriptionFeature from '../Subscription/EditSubscriptionFeature'
import PromotionBonusComponent from '../PromotionBonus/PromotionBonusComponent'
import DailyUserReport from '../Reports/DailyUserReport'
import EditSubscriptionPlan from '../Subscription/SubscriptionPlan/EditSubscriptionPlan'
import ViewSubscriptionPlan from '../Subscription/SubscriptionPlan/ViewSubscriptionPlan'
import UserSubscriptionList from '../Subscription/UserSubscription/UserSubscriptionList'
import CasinoProviderDashboard from '../CasinoProviderDashboard'
import CreateProviderRateMatrix from '../CasinoProviderDashboard/components/CreateProviderRateMatrix'
import EditProviderRateMatrix from '../CasinoProviderDashboard/components/EditProviderRateMatrix'
import UserDailyReportHelp from '../Reports/DailyUserReport/UserDailyReportHelp'
import CasinoGameLobby from '../CasinoGameLobby'
import EditGameDiscountRate from '../CasinoGameLobby/components/EditGameDiscountRate'
import SubscriptionReport from '../Reports/SubscriptionReport'
import RedeemRateReport from '../Reports/RedemptionReport'
const AdminPages = () => (
  <Routes>
    {/* Public Routes without sidebar */}
    <Route
      path={AdminRoutes.AdminSignin}
      element={<AdminSignIn />}
    />
    <Route
      path={AdminRoutes.DefaultRoute}
      element={<AdminSignIn />}
    />
    <Route
      path={AdminRoutes.AdminRoute}
      element={<AdminSignIn />}
    />
    <Route
      path={AdminRoutes.Dashboard}
      element={
        <PrivateRoute module={{ Report: 'DR' }}>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Profile}
      element={
        <PrivateRoute>
          {typeof window !== 'undefined' &&
          window.location.hostname.includes('icebarcatmf-admin-demo')
            ? (
              <Navigate replace to={AdminRoutes.Dashboard} />
              )
            : (
          <ProfilePage />
              )}
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Players}
      element={
        <PrivateRoute module={{ Users: 'R' }}>
          <Players />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PlayerDetails}
      element={
        <PrivateRoute module={{ Users: 'R' }}>
          <PlayerDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Packages}
      element={
        <PrivateRoute module={{ Package: 'R' }}>
          <Packages />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Tournament}
      element={
        <PrivateRoute module={{ Tournaments: 'R' }}>
          <Tournaments />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Tier}
      element={
        <PrivateRoute module={{ Tiers: 'R' }}>
          <Tiers />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreatePackage}
      element={
        <PrivateRoute module={{ Package: 'C' }}>
          <CreatePackages />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PackageAutomation}
      element={
        <PrivateRoute module={{ Package: 'C' }}>
          <PackageAutomation />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReorderPackage}
      element={
        <PrivateRoute module={{ Package: 'U' }}>
          <ReorderPackages />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.UnarchivePackage}
      element={
        <PrivateRoute module={{ Package: 'U' }}>
          <UnarchivePage />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReorderFtpBonus}
      element={
        <PrivateRoute module={{ Package: 'U' }}>
          <ReorderFtpBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditPackageDetails}
      element={
        <PrivateRoute module={{ Package: 'U' }}>
          <EditPackageDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RaffleEdit}
      element={
        <PrivateRoute module={{ Raffles: 'U' }}>
          <EditRaffle />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.GameDashboard}
      element={
        <PrivateRoute module={{ Report: 'DR' }}>
          <GameDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PurchaseReport}
      element={
        <PrivateRoute module={{ Report: 'DR' }}>
          <PurchaseReport />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Bonusreport}
      element={
        <PrivateRoute module={{ Report: 'DR' }}>
          <BonusReport />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.UserDailyReport}
      element={
        <PrivateRoute module={{ Report: 'DR' }}>
          <DailyUserReport />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.UserDailyReportHelp}
      element={
        <PrivateRoute module={{ Report: 'DR' }}>
          <UserDailyReportHelp />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RedeemRateReport}
      element={
        <PrivateRoute>
          <RedeemRateReport />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.GameLobby}
      element={
        <PrivateRoute module={{ GamePages: 'R' }}>
          <CasinoGameLobby />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.EditGameDiscountRate}
      element={
        <PrivateRoute module={{ GamePages: 'R' }}>
          <EditGameDiscountRate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.DashboardCasinoProviders}
      element={
        <PrivateRoute module={{ ProviderDashboard: 'R' }}>
          <CasinoProviderDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateProvidersRateMatrix}
      element={
        <PrivateRoute module={{ ProviderDashboard: 'C' }}>
          <CreateProviderRateMatrix />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditProvidersRateMatrix}
      element={
        <PrivateRoute module={{ ProviderDashboard: 'U' }}>
          <EditProviderRateMatrix />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CasinoProviders}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoProviders />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Aggregators}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoAggregator />
        </PrivateRoute>
      }
    />
    {/* <Route
      path={AdminRoutes.RestrictedProviderCountries}
      element={
        <PrivateRoute module={{ CasinoManagement: "R" }}>
          <RestrictProviderCountries />
        </PrivateRoute>
      }
    /> */}
    <Route
      path={AdminRoutes.CasinoCategories}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoCategory />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CasinoGames}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoGames />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReorderCasinoCategories}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <ReorderCategory />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReorderCasinoProviders}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <ReorderProvider />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CasinoSubCategories}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoSubCategory />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReorderCasinoSubCategories}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <ReorderSubCategory />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.AddSubCategoryGames}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <AddSubCategoryGames />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReorderGames}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <GameReorder />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.GameFreeSpin}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <FreeSpinGames />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.FreeSpinGames}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <FreeSpinCreate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.viewFreeSpinUsers}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <ViewFreeSpinUser />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.viewFreeSpin}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <ViewFreeSpin />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.VipDashboard}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipPendingUserLists}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <PendingVipPlayers />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipCustomerManagement}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <CustomerManagement />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipPlayerDetails}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipPlayerDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipDashboardHelp}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipDashboardHelp />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipDashboardQuestionForm}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipformQuestions />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipReorderQuestion}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipReorderQuestion />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipViewForm}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipFormPreview />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VipCreateQuestion}
      element={
        <PrivateRoute module={{ VipManagement: 'C' }}>
          <VipCreateQuestions />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.EditVipQuestion}
      element={
        <PrivateRoute module={{ VipManagement: 'U' }}>
          <VipEditQuestion />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ViewVipQuestion}
      element={
        <PrivateRoute module={{ VipManagement: 'R' }}>
          <VipViewQuestion />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.VipCommissionReport}
      element={
        <PrivateRoute module={{ VipManagement: 'CR' }}>
          <VipManagerCommissionReport />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.BannerManagement}
      element={
        <PrivateRoute module={{ Banner: 'R' }}>
          <BannerManagement />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CmsListing}
      element={
        <PrivateRoute module={{ CMS: 'R' }}>
          <CMSListing />
        </PrivateRoute>
      }
    />
    {/* <Route
      path={AdminRoutes.ContentPagesListing}
      element={
        <PrivateRoute>
          <ContentPagesListing />
        </PrivateRoute>
      }
    /> */}
    <Route
      path={AdminRoutes.ContentPageDetails}
      element={
        <PrivateRoute>
          <ContentPageDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CmsDetails}
      element={
        <PrivateRoute module={{ CMS: 'R' }}>
          <CMSDetail />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CmsEdit}
      element={
        <PrivateRoute module={{ CMS: 'U' }}>
          <EditCms />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CmsCreate}
      element={
        <PrivateRoute module={{ CMS: 'C' }}>
          <CreateCms />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EmailCenter}
      element={
        <PrivateRoute module={{ emailCenter: 'R' }}>
          <EmailCenter />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Blogs}
      element={
        <PrivateRoute module={{ BlogPost: 'R' }}>
          <BlogsListing />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BlogPageCreate}
      element={
        <PrivateRoute module={{ BlogPost: 'C' }}>
          <CreateBlog />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BlogDetails}
      element={
        <PrivateRoute module={{ BlogPost: 'R' }}>
          <BlogDetail />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BlogEdit}
      element={
        <PrivateRoute module={{ BlogPost: 'U' }}>
          <EditBlog />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ViewFaq}
      element={
        <PrivateRoute module={{ BlogPost: 'R' }}>
          <ViewFaq />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePages}
      element={
        <PrivateRoute module={{ GamePages: 'R' }}>
          <GamePageListing />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePageCreate}
      element={
        <PrivateRoute module={{ GamePages: 'C' }}>
          <CreateGamePage />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePageDetails}
      element={
        <PrivateRoute module={{ GamePages: 'R' }}>
          <GamePageDetail />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePageEdit}
      element={
        <PrivateRoute module={{ GamePages: 'U' }}>
          <EditGamePage />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePageCard}
      element={
        <PrivateRoute module={{ GamePages: 'C' }}>
          <CreateGamePageCard />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePageCardView}
      element={
        <PrivateRoute module={{ GamePages: 'R' }}>
          <ViewGameCard />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.GamePageCardEdit}
      element={
        <PrivateRoute module={{ GamePages: 'U' }}>
          <EditGamePageCard />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.ViewGamePageFaq}
      element={
        <PrivateRoute module={{ GamePages: 'R' }}>
          <ViewGamePageFaq />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.RedeemRulelisting}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <RedeemRule />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RedeemRuleCreate}
      element={
        <PrivateRoute>
          <CreateRedeemRule />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.MaintenanceMode}
      element={
        <PrivateRoute module={{ MaintenanceMode: 'R' }}>
          <MaintenanceMode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PaymentProvider}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <PaymentProvider />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateMaintenanceMode}
      element={
        <PrivateRoute module={{ MaintenanceMode: 'C' }}>
          <CreateMaintenanceMode />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.EditMaintenanceMode}
      element={
        <PrivateRoute module={{ MaintenanceMode: 'U' }}>
          <EditMaintenanceMode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditFreeSpin}
      element={
        <PrivateRoute>
          <EditFreeSpin />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.RedeemUserSelect}
      element={
        <PrivateRoute>
          <RedeemUserSelect />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RedeemViewUser}
      element={
        <PrivateRoute>
          <ViewRedeemUser />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RedeemRuleEdit}
      element={
        <PrivateRoute>
          <EditRule />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BonusListing}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <BonusListing />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BonusCreate}
      element={
        <PrivateRoute module={{ Bonus: 'C' }}>
          <CreateBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EmailCreate}
      element={
        <PrivateRoute module={{ emailCenter: 'C' }}>
          <CreateEmail />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EmailSend}
      element={
        <PrivateRoute module={{ emailCenter: 'C' }}>
          <SendMail />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EmailEdit}
      element={
        <PrivateRoute module={{ emailCenter: 'U' }}>
          <EditTemplate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BonusEdit}
      element={
        <PrivateRoute module={{ Bonus: 'U' }}>
          <EditBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BonusDetails}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <BonusDetail />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReferralBonusListing}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <ReferralBonusListing />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.DailyBonusStreakListing}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <DailyBonusStreakListing />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReferralBonusCreate}
      element={
        <PrivateRoute module={{ Bonus: 'C' }}>
          <CreateReferralBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReferralBonusEdit}
      element={
        <PrivateRoute module={{ Bonus: 'U' }}>
          <EditReferralBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReferralBonusDetails}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <ReferralBonusDetail />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.SpinWheel}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <SpinWheel />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.SpinWheelEdit}
      element={
        <PrivateRoute module={{ Admins: 'U' }}>
          <EditSpinWheel />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ImageGallery}
      element={
        <PrivateRoute>
          <ImageGallery module={{ Gallery: 'R' }} />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Staff}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <Staff />
        </PrivateRoute>
      }
    />
    {/* <Route
      path={AdminRoutes.Countries}
      element={
        <PrivateRoute module={{ Admins: "R" }}>
          <Countries />
        </PrivateRoute>
      }
    /> */}
    <Route
      path={AdminRoutes.CountriesRestrictedProviders}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <RestrictedProviders />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CountriesRestrictedGames}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <RestrictedGames />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateAdmin}
      element={
        <PrivateRoute module={{ Admins: 'C' }}>
          <CreateStaffAdmin />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditAdmin}
      element={
        <PrivateRoute module={{ Admins: 'U' }}>
          <EditStaffAdmin />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.AdminDetails}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <AdminDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EmailTemplates}
      element={
        <PrivateRoute module={{ EmailTemplate: 'R' }}>
          <EmailTemplate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateEmailTemplate}
      element={
        <PrivateRoute module={{ EmailTemplate: 'C' }}>
          <CreateEmailTemplate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditManualTemplate}
      element={
        <PrivateRoute module={{ EmailTemplate: 'U' }}>
          <EditManualTemplate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditEmailTemplates}
      element={
        <PrivateRoute module={{ EmailTemplate: 'U' }}>
          {/* <EditEmailTemplate /> */}
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CasinoTransactions}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <CasinoTransaction />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BankingTransactions}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <BankingTransaction />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Raffle}
      element={
        <PrivateRoute module={{ Raffles: 'R' }}>
          <Raffle />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RafflePayout}
      element={
        <PrivateRoute module={{ RafflePayout: 'R' }}>
          <RafflePayout />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RaffleView}
      element={
        <PrivateRoute module={{ Raffles: 'R' }}>
          <ViewRaffle />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Affiliate}
      element={
        <PrivateRoute module={{ Affiliates: 'R' }}>
          <AdminAffiliate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateAffiliate}
      element={
        <PrivateRoute module={{ Affiliates: 'R' }}>
          <CreateAffiliate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.AffiliateDetail}
      element={
        <PrivateRoute module={{ Affiliates: 'R' }}>
          <EditAffiliate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.WithdrawRequest}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <WithdrawRequests />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.VaultRequest}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <VaultData />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.StaffTransactionDetails}
      element={
        <PrivateRoute module={{ AdminAddedCoins: 'R' }}>
          <StaffTransactionDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.StaffCreditDetails}
      element={
        <PrivateRoute module={{ AdminAddedCoins: 'R' }}>
          <StaffSCCreditDetails />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.AmoeRequest}
      element={
        <PrivateRoute module={{ Amoe: 'R' }}>
          <AmoeData />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RedeemReqRuleConfig}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <RedeemRequestRule />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateRedeemReqRuleConfig}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <CreateRedeemRules />
        </PrivateRoute>
      }
    />
    {/* <Route
      path={AdminRoutes.EditRedeemReqRuleConfig}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <EditRedeemRules />
        </PrivateRoute>
      }
    /> */}
    <Route
      path={AdminRoutes.TournamentEdit}
      element={
        <PrivateRoute module={{ Tournaments: 'U' }}>
          <EditTournament />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.tournamentCreate}
      element={
        <PrivateRoute module={{ Tournaments: 'C' }}>
          <CreateTournament type={'CREATE'} />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.duplicateTournamentCreate}
      element={
        <PrivateRoute module={{ Tournaments: 'C' }}>
          <DuplicateTournament />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ReordertournamentList}
      element={
        <PrivateRoute module={{ Tournaments: 'U' }}>
          <ReorderTournaments />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.tierDetails}
      element={
        <PrivateRoute module={{ Tiers: 'R' }}>
          <ViewTier />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.tierEdit}
      element={
        <PrivateRoute module={{ Tiers: 'U' }}>
          <EditTier />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.tierCreate}
      element={
        <PrivateRoute module={{ Tiers: 'C' }}>
          <CreateTier />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.RaffleCreate}
      element={
        <PrivateRoute module={{ Raffles: 'C' }}>
          <CreateRaffle />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromotionBonus}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <PromotionBonusComponent />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromotionBonusCreate}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <CreatePromotionBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromotionBonusEdit}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <EditPromotionBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromotionBonusView}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <ViewPromotionBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromocodeArchived}
      element={
        <PrivateRoute module={{ Promocode: 'R' }}>
          <ArchivedPromocodes />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromoCodeBonus}
      element={
        <PrivateRoute module={{ Promocode: 'R' }}>
          <PromoCodeBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromoCodeCreate}
      element={
        <PrivateRoute module={{ Promocode: 'R' }}>
          <CreatePromoCode />
        </PrivateRoute>
      }
    />
    {/* <Route
      path={AdminRoutes.GeoBlocking}
      element={
        <PrivateRoute module={{ GeoComply: "R" }}>
          <GeoBlocking />
        </PrivateRoute>
      }
    /> */}
    <Route
      path={AdminRoutes.DomainBlock}
      element={
        <PrivateRoute module={{ DomainBlock: 'R' }}>
          <DomainBlocking />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.DomainBlockCreate}
      element={
        <PrivateRoute module={{ DomainBlock: 'R' }}>
          <CreateBlockDomain />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.DomainBlockEdit}
      element={
        <PrivateRoute module={{ DomainBlock: 'R' }}>
          <EditBlockedDomain />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromoCodeEdit}
      element={
        <PrivateRoute module={{ Promocode: 'R' }}>
          <EditPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromoCodeView}
      element={
        <PrivateRoute module={{ Promocode: 'R' }}>
          <ViewPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ArchivedPromoCodeView}
      element={
        <PrivateRoute module={{ Promocode: 'R' }}>
          <ViewArchivedPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CRMPromoBonus}
      element={
        <PrivateRoute module={{ CrmPromotion: 'R' }}>
          <CRMPromoBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoBonusCreate}
      element={
        <PrivateRoute module={{ CrmPromotion: 'C' }}>
          <CreateCRMPromoBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoBonusEdit}
      element={
        <PrivateRoute module={{ CrmPromotion: 'U' }}>
          <EditCRMPromoBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoBonusView}
      element={
        <PrivateRoute module={{ CrmPromotion: 'R' }}>
          <ViewCRMPromoBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoBonusViewMore}
      element={
        <PrivateRoute module={{ CrmPromotion: 'R' }}>
          <ViewMoreCRMPromoBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CRMPromoCode}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <CRMPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoCodeCreate}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <CreateCRMPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoCodeEdit}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <EditCRMPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CrmPromoCodeView}
      element={
        <PrivateRoute module={{ PromotionBonus: 'R' }}>
          <ViewCRMPromoCode />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.PromoCodeBlocking}
      element={
        <PrivateRoute module={{ BlockUsers: 'R' }}>
          <PromoCodeBlocking />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ViewPackages}
      element={
        <PrivateRoute module={{ Package: 'R' }}>
          <ViewPackages />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ViewArchivePackages}
      element={
        <PrivateRoute module={{ Package: 'R' }}>
          <ViewArchivePackages />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.TournamentDetails}
      element={
        <PrivateRoute module={{ Tournaments: 'R' }}>
          <ViewTournament />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ExportCenter}
      element={
        <PrivateRoute module={{ ExportCenter: 'R' }}>
          <ExportCenter />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.NotificationCenter}
      element={
        <PrivateRoute module={{ NotificationCenter: 'R' }}>
          <NotificationCenter />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Jackpot}
      element={
        <PrivateRoute module={{ Jackpot: 'R' }}>
          <JackpotSettings />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateJackpot}
      element={
        <PrivateRoute module={{ Jackpot: 'C' }}>
          <CreateJackpot />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditJackpot}
      element={
        <PrivateRoute module={{ Jackpot: 'U' }}>
          <EditJackpot />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ScratchCard}
      element={
        <PrivateRoute module={{ ScratchCardConfiguration: 'R' }}>
          <Scratchcard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateScratchCard}
      element={
        <PrivateRoute module={{ ScratchCardConfiguration: 'C' }}>
          <CreateScratchCard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditScratchCard}
      element={
        <PrivateRoute module={{ ScratchCardConfiguration: 'U' }}>
          <CreateScratchCard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ViewScratchCard}
      element={
        <PrivateRoute module={{ ScratchCardConfiguration: 'U' }}>
          <ViewScratchCard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.UnarchiveScratchCard}
      element={
        <PrivateRoute module={{ ScratchCardConfiguration: 'U' }}>
          <Scratchcard />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Calendar}
      element={
        <PrivateRoute module={{ Calender: 'R' }}>
          <ScheduledEvents />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.PromotionManagement}
      element={
        <PrivateRoute module={{ PromotionThumbnail: 'R' }}>
          <PromotionManagement />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.SubscriptionFeature}
      element={
        <PrivateRoute module={{ Subscription: 'R' }}>
          <SubscriptionFeature />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.SubscriptionPlan}
      element={
        <PrivateRoute module={{ Subscription: 'R' }}>
          <SubscriptionPlan />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateSubscriptionPlan}
      element={
        <PrivateRoute module={{ Subscription: 'C' }}>
          <CreateSubscriptionPlan />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditSubscriptionPlan}
      element={
        <PrivateRoute module={{ Subscription: 'U' }}>
          <EditSubscriptionPlan />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.ViewSubscriptionPlan}
      element={
        <PrivateRoute module={{ Subscription: 'R' }}>
          <ViewSubscriptionPlan />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.UserSubscription}
      element={
        <PrivateRoute module={{ Subscription: 'R' }}>
          <UserSubscriptionList />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditSubscriptionFeature}
      element={
        <PrivateRoute module={{ Subscription: 'R' }}>
          <EditSubscriptionFeature />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.SubscriptionReport}
      element={
        <PrivateRoute module={{ Subscription: 'R' }}>
          <SubscriptionReport />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.NotFound}
      element={<NotFound />}
    />
    <Route
      path='*'
      element={
        <Navigate
          replace
          to={AdminRoutes.NotFound}
        />
      }
    />
  </Routes>
)
export default AdminPages
