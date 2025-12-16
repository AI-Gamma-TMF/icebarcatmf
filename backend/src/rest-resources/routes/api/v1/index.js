import express from 'express'
import commonRoutes from './common.routes'
import adminRoutes from './admin.routes'
import cmsRoutes from './cms.routes'
import userRoutes from './user.routes'
import packageRoutes from './package.routes'
import emailRoutes from './email.routes'
import casinoRoutes from './casino.routes'
import bannerRoutes from './banner.routes'
import galleryRoutes from './image-gallery.routes'
import countryRoutes from './country.router'
import bonusRoutes from './bonus.routes'
import paymentRoutes from './payment.routes'
import reportRoute from './report.route'
import alertRouter from './alert.routes'
import antiFraudRouter from './anti.fraud.routes'
import pageContentRoutes from './page-content.routes'
import aleaRouter from './alea.routes'
import affiliateRouter from './affiliates.routes'
import tournamentRouter from './tournament.routes'
import tierRouter from './tier.routes'
import raffleRouter from './raffles.routes'
import rafflePayoutRouter from './rafflePayout.routes'
import promotionEventRouter from './promotionEvent.routes'
import walletPermissionRouter from './walletPermission.routes'
import promocodeRouter from './promocode.routes'
import exportCenterRouter from './exportcenter.routes'
import crmPromotionRouter from './crmPromotions.routes'
import blockUserRouter from './blockUsers.routes'
import emailCenterRouter from './emailCenter.routes'
import amoeRoutes from './amoe.routes'
import adminNotificationsRouter from './adminNotifications.routes'
import adminCreditRouter from './adminCredit.routes'
import domainBlockRoutes from './domain.block.routes'
import maintenanceModeRouter from './maintenanceMode.routes'
import vipDashBoardRouter from './vip.dashbaord.routes'
import cashierManagementRoutes from './cashierManagement.routes'
import blogPostRoutes from './blogPost.routes'
// import dynamoRouter from './dynamo.routes'
import jackpotRoutes from './jackpot.routes'
import vipManagedBydRouter from './vip.managedBy.routes'
import promotionThumbnail from './promotion.thumbnail.routes'
import gamePageRouter from './gamePage.routes'
import calenderRouter from './calender.routes'
import subscriptionRouter from './subscription.routes'
import providerDashboardRoutes from './providerDashboard.routes'

const v1Router = express.Router()
v1Router.get('/', async (_, res) => {
  try {
    res.json({ message: 'welcome admin backend version 1st api' })
  } catch (error) {
    res.status(503)
    res.send()
  }
})
v1Router.use('/', commonRoutes)
v1Router.use('/admin', adminRoutes)
v1Router.use('/cms', cmsRoutes)
v1Router.use('/user', userRoutes)
v1Router.use('/package', packageRoutes)
v1Router.use('/gallery', galleryRoutes)
v1Router.use('/country', countryRoutes)
v1Router.use('/email', emailRoutes)
v1Router.use('/casino', casinoRoutes)
v1Router.use('/banner', bannerRoutes)
v1Router.use('/bonus', bonusRoutes)
v1Router.use('/payment', paymentRoutes)
v1Router.use('/report', reportRoute)
v1Router.use('/alert', alertRouter)
v1Router.use('/anti-fraud', antiFraudRouter)
v1Router.use('/pages', pageContentRoutes)
v1Router.use('/alea', aleaRouter)
v1Router.use('/affiliate', affiliateRouter)
v1Router.use('/tournament', tournamentRouter)
v1Router.use('/tier', tierRouter)
v1Router.use('/raffle', raffleRouter)
v1Router.use('/rafflePayout', rafflePayoutRouter)
v1Router.use('/promotion', promotionEventRouter)
v1Router.use('/walletCoin', walletPermissionRouter)
v1Router.use('/promocode', promocodeRouter)
v1Router.use('/exportCenter', exportCenterRouter)
v1Router.use('/crm-promotion', crmPromotionRouter)
v1Router.use('/domainBlock', domainBlockRoutes)
v1Router.use('/blockUsers', blockUserRouter)
v1Router.use('/email-center', emailCenterRouter)
v1Router.use('/amoe', amoeRoutes)
v1Router.use('/admin-notification-center', adminNotificationsRouter)
v1Router.use('/admin-credit', adminCreditRouter)
v1Router.use('/maintenance-mode', maintenanceModeRouter)
v1Router.use('/vip', vipDashBoardRouter)
v1Router.use('/cashier-management', cashierManagementRoutes)
v1Router.use('/blog-post', blogPostRoutes)
// v1Router.use('/dynamo', dynamoRouter) // disabled -- plans to reuse it later
v1Router.use('/jackpot', jackpotRoutes)
v1Router.use('/vip-managed-by', vipManagedBydRouter)
v1Router.use('/promotion-thumbnail', promotionThumbnail)
v1Router.use('/game-pages', gamePageRouter)
v1Router.use('/calender', calenderRouter)
v1Router.use('/subscription', subscriptionRouter)
v1Router.use('/provider-dashboard', providerDashboardRoutes)

export default v1Router
