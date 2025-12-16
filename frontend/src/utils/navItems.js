import {
  faCommentAlt,
  faImage,
  faListAlt,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";

import {
  faChartPie,
  faScrewdriverWrench,
  faFileExport,
  faListCheck,
  faGamepad,
  faMoneyCheckDollar,
  faDollarSign,
  faVault,
  faList12,
  faPeopleGroup,
  faPhotoVideo,
  faShieldAlt,
  faShippingFast,
  faUserAlt,
  faUsers,
  faAward,
  faCreditCard,
  faMoneyBillWave,
  faBell,
  faPager,
  faGift,
  faEnvelope,
  faHourglassHalf,
  faUsersGear,
  faFileCirclePlus,
  faTrophy,
  faFileLines,
  faCircleDollarToSlot,
  faFan,
  faStream,
  faPuzzlePiece,
  faGlobe,
  faDice,
} from "@fortawesome/free-solid-svg-icons";

import { AdminRoutes, AffiliateRoute } from "../routes";

export const navItems = [
  {
    titleKey: "dashboard",
    link: AdminRoutes.Dashboard,
    icon: faChartPie,
    permissionLabel: "Report",
    inSidePermissionLabel: "DR",
  },

  {
    titleKey: "staff",
    link: AdminRoutes.Staff,
    icon: faPeopleGroup,
    permissionLabel: "Admins",
  },
  {
    titleKey: "Admin Added Coins",
    link: AdminRoutes.StaffCreditDetails,
    icon: faVault,
    permissionLabel: "AdminAddedCoins",
  },

  {
    titleKey: "players",
    link: AdminRoutes.Players,
    icon: faUsers,
    permissionLabel: "Users",
  },
  {
    titleKey: "casinoManagement",
    path: "casino-management",
    icon: faListAlt,
    permissionLabel: "CasinoManagement",
    isCollapsable: true,
    options: [
      {
        titleKey: "providerDashboard",
        link: AdminRoutes.DashboardCasinoProviders,
        icon: faChartPie,
        permissionLabel: "CasinoManagement",
      },
      {
        titleKey: "gameDashboard",
        link: AdminRoutes.GameDashboard,
        icon: faChartPie,
        permissionLabel: "CasinoManagement",
      },
      {
        titleKey: "gameLobby",
        link: AdminRoutes.GameLobby,
        icon: faDice,
        permissionLabel: "CasinoManagement",
      },

      {
        titleKey: "Aggregators",
        link: AdminRoutes.Aggregators,
        icon: faUserCircle,
        permissionLabel: "CasinoManagement",
      },

      {
        titleKey: "providers",
        link: AdminRoutes.CasinoProviders,
        icon: faUserCircle,
        permissionLabel: "CasinoManagement",
      },

      {
        titleKey: "subCategories",
        link: AdminRoutes.CasinoSubCategories,
        icon: faList12,
        permissionLabel: "CasinoManagement",
      },
      {
        titleKey: "games",
        link: AdminRoutes.CasinoGames,
        icon: faGamepad,
        permissionLabel: "CasinoManagement",
      },
      {
        titleKey: "gamesFreeSpin",
        link: AdminRoutes.GameFreeSpin,
        icon: faFan,
        permissionLabel: "CasinoManagement",
      },
      {
        titleKey: "Scratch Card",
        link: AdminRoutes.ScratchCard,
        icon: faStream,
        permissionLabel: "ScratchCardConfiguration",
      },
      {
        titleKey: "Jackpot",
        link: AdminRoutes.Jackpot,
        icon: faCircleDollarToSlot,
        permissionLabel: "Jackpot",
      },
    ],
  },
  {
    titleKey: "bannerManagement",
    link: AdminRoutes.BannerManagement,
    icon: faPhotoVideo,
    permissionLabel: "Banner",
  },
  {
    titleKey: "Reports",
    path: "report",
    icon: faListAlt,
    permissionLabel: "Report",

    isCollapsable: true,
    options: [
      {
        titleKey: "Purchase Report",
        link: AdminRoutes.PurchaseReport,
        icon: faChartPie,
        permissionLabel: "Report",
      },
      {
        titleKey: "Bonus Report",
        link: AdminRoutes.Bonusreport,
        icon: faChartPie,
        permissionLabel: "Report",
      },
      {
        titleKey: "Users Daily Report",
        link: AdminRoutes.UserDailyReport,
        icon: faChartPie,
        permissionLabel: "Report",
      },
       {
        titleKey: 'Redeem Rate Report',
        link: AdminRoutes.RedeemRateReport,
        icon: faChartPie,
        permissionLabel: 'Report',
      },
    ],
  },
  {
    titleKey: "vipManagement",
    path: "vip-management",
    icon: faListCheck,
    permissionLabel: "VipManagement",
    isCollapsable: true,
    options: [
      {
        titleKey: "dashboard",
        link: AdminRoutes.VipDashboard,
        icon: faChartPie,
        permissionLabel: "VipManagement",
      },
      {
        titleKey: "pendingVip",
        link: AdminRoutes.VipPendingUserLists,
        icon: faHourglassHalf,
        permissionLabel: "VipManagement",
      },
      {
        titleKey: "customerManagement",
        link: AdminRoutes.VipCustomerManagement,
        icon: faUsersGear,
        permissionLabel: "VipManagement",
      },
      {
        titleKey: "vipQuestionnaire",
        link: AdminRoutes.VipDashboardQuestionForm,
        icon: faFileCirclePlus,
        permissionLabel: "VipManagement",
      },
      {
        titleKey: "VipManagerCommissionReport",
        link: AdminRoutes.VipCommissionReport,
        icon: faChartPie,
        permissionLabel: "VipManagement",
        inSidePermissionLabel: "CR",
      },
    ],
  },
  {
    titleKey: "Maintenance Mode",
    link: AdminRoutes.MaintenanceMode,
    icon: faScrewdriverWrench,
    permissionLabel: "MaintenanceMode",
  },

  {
    titleKey: "Seo Management",
    path: "/blog",
    icon: faGlobe,
    permissionLabel: "BlogPost",
    isCollapsable: true,
    options: [
      {
        titleKey: "Dynamic Blog Post",
        link: AdminRoutes.Blogs,
        icon: faFileLines,
        permissionLabel: "BlogPost",
      },
      {
        titleKey: "Dynamic Game Pages",
        link: AdminRoutes.GamePages,
        icon: faPuzzlePiece,
        permissionLabel: "BlogPost",
      },
      {
        titleKey: "Image Gallery",
        link: AdminRoutes.ImageGallery,
        icon: faImage,
        permissionLabel: "Gallery",
      },
    ],
  },

  {
    titleKey: "transactions",
    path: "transactions",
    icon: faMoneyCheckDollar,
    permissionLabel: "Transactions",
    isCollapsable: true,
    options: [
      {
        titleKey: "casinoTransactions",
        link: AdminRoutes.CasinoTransactions,
        icon: faCreditCard,
        permissionLabel: "Transactions",
      },
      {
        titleKey: "transactionsBanking",
        link: AdminRoutes.BankingTransactions,
        icon: faDollarSign,
        permissionLabel: "Transactions",
      },
      {
        titleKey: "withdrawRequests",
        link: AdminRoutes.WithdrawRequest,
        icon: faMoneyBillWave,
        permissionLabel: "Transactions",
      },
      {
        titleKey: "Vault",
        link: AdminRoutes.VaultRequest,
        icon: faVault,
        permissionLabel: "Transactions",
      },
    ],
  },
  {
    titleKey: "Cashier Management",
    path: "payment",
    icon: faMoneyCheckDollar,
    permissionLabel: "CashierManagement",
    isCollapsable: true,
    options: [
      {
        titleKey: "Reedem Rules",
        link: AdminRoutes.RedeemRulelisting,
        icon: faMoneyBillWave,
        permissionLabel: "CashierManagement",
      },
      {
        titleKey: "Payment Provider",
        link: AdminRoutes.PaymentProvider,
        icon: faCreditCard,
        permissionLabel: "CashierManagement",
      },
    ],
  },
  {
    titleKey: "packages",
    link: AdminRoutes.Packages,
    icon: faShippingFast,
    permissionLabel: "Package",
  },
  {
    titleKey: "subscription",
    path: "subscription",
    icon: faMoneyCheckDollar,
    permissionLabel: "Subscription",
    isCollapsable: true,
    options: [
      {
        titleKey: "Subscription Report",
        link: AdminRoutes.SubscriptionReport,
        icon: faChartPie,
        permissionLabel: "Subscription",
      },
      {
        titleKey: "User Subscription",
        link: AdminRoutes.UserSubscription,
        icon: faUsers,
        permissionLabel: "Subscription",
      },
      {
        titleKey: "Subscription Plan",
        link: AdminRoutes.SubscriptionPlan,
        icon: faMoneyBillWave,
        permissionLabel: "Subscription",
      },
      {
        titleKey: "Subscription Feature",
        link: AdminRoutes.SubscriptionFeature,
        icon: faCreditCard,
        permissionLabel: "Subscription",
      },
    ],
  },
  {
    titleKey: "Tournaments",
    link: AdminRoutes.Tournament,
    icon: faTrophy,
    permissionLabel: "Tournaments",
  },
  {
    titleKey: "Tiers",
    link: AdminRoutes.Tier,
    icon: faPager,
    permissionLabel: "Tiers",
  },
  {
    titleKey: "Giveaways",
    link: AdminRoutes.Raffle,
    icon: faPager,
    permissionLabel: "Raffles",
  },

  {
    titleKey: "cms",
    path: "cms",
    icon: faCommentAlt,
    permissionLabel: "CMS",
    isCollapsable: true,
    options: [
      {
        titleKey: "dynamicCms",
        link: AdminRoutes.CmsListing,
        icon: faShieldAlt,
        permissionLabel: "CMS",
      },
    ],
  },

  {
    titleKey: "Email Center",
    link: AdminRoutes.EmailCenter,
    icon: faEnvelope,
    permissionLabel: "emailCenter",
  },
  {
    titleKey: "bonus",
    link: AdminRoutes.BonusListing,
    icon: faAward,
    permissionLabel: "Bonus",
  },

  {
    titleKey: "Affiliate",
    link: AdminRoutes.Affiliate,
    icon: faUsers,
    permissionLabel: "Affiliates",
  },
  {
    titleKey: "AMOE Bonus",
    link: AdminRoutes.AmoeRequest,
    icon: faGift,
    permissionLabel: "Amoe",
  },
  {
    titleKey: "promoCode",
    path: "promotion-bonus",
    icon: faListAlt,
    permissionLabel: "Promocode",
    isCollapsable: true,
    options: [
      {
        titleKey: "Affiliate Promo Codes",
        link: AdminRoutes.PromotionBonus,
        icon: faImage,
        permissionLabel: "PromotionBonus",
      },
      {
        titleKey: "Purchase Promo Codes",
        link: AdminRoutes.PromoCodeBonus,
        icon: faImage,
        permissionLabel: "Promocode",
      },
    ],
  },
  {
    titleKey: "CRM Promotion",
    path: "crm-promotion",
    icon: faMoneyCheckDollar,
    permissionLabel: "CrmPromotion",
    isCollapsable: true,
    options: [
      {
        titleKey: "CRM Promo Code",
        link: AdminRoutes.CRMPromoCode,
        icon: faAward,
        permissionLabel: "Promocode",
      },
      {
        titleKey: "CRM Promo Bonus",
        link: AdminRoutes.CRMPromoBonus,
        icon: faAward,
        permissionLabel: "CrmPromotion",
      },
    ],
  },
  {
    titleKey: "Export Center",
    link: AdminRoutes.ExportCenter,
    icon: faFileExport,
    permissionLabel: "ExportCenter",
  },
  {
    titleKey: "Notification Center",
    link: AdminRoutes.NotificationCenter,
    icon: faBell,
    permissionLabel: "NotificationCenter",
  },
  // {
  //   titleKey: "Geo Blocking",
  //   // labelKey: "Geo-blocking",
  //   link: AdminRoutes.GeoBlocking,
  //   icon: faImage,
  //   permissionLabel: "GeoComply",
  // },
  {
    titleKey: "Domain Blocking",
    // labelKey: "Geo-blocking",
    link: AdminRoutes.DomainBlock,
    icon: faImage,
    permissionLabel: "DomainBlock",
  },
  {
    titleKey: "Promocode Blocking",
    link: AdminRoutes.PromoCodeBlocking,
    icon: faImage,
    permissionLabel: "BlockUsers",
  },
  // {
  //   titleKey: 'Jackpot Settings',
  //   link: AdminRoutes.Jackpot,
  //   icon: faCircleDollarToSlot,
  //   permissionLabel: 'Jackpot',
  // },
  {
    titleKey: "Promotion Management",
    link: AdminRoutes.PromotionManagement,
    icon: faPhotoVideo,
    permissionLabel: "PromotionThumbnail",
  },
];

export const affiliateNavLink = [
  {
    titleKey: "Players",
    link: AffiliateRoute.AffiliatePlayers,
    icon: faUsers,
    permissionLabel: "AffiliatePlayers",
  },
  {
    titleKey: "Profile",
    link: AffiliateRoute.AffiliateProfile,
    icon: faUserAlt,
  },
];
