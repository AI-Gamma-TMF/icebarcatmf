import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import { removeData, convertToWebPAndUpload } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    pageBannerId: { type: 'string', pattern: '^[0-9]+$' },
    btnText: { type: ['string', 'null'] },
    navigateRoute: {
      type: ['string', 'null']
    },
    // textOne: { type: ['string', 'null'] },
    // textTwo: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    pageRoute: {
      type: ['string', 'null']
    },
    isCountDown: { type: 'string', enum: ['true', 'false'] },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    isNavigate: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['pageBannerId', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdateBannerPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      pageBannerId,
      isActive,
      navigateRoute: btnRedirection,
      textThree,
      pageRoute: pageName,
      isNavigate
      // btnText,
      // textOne,
      // textTwo,
      // name,
      // isCountDown,
      // startDate,
      // endDate
    } = this.args
    const desktopBannerImageExist = this.context.req.files?.desktopBannerImage
    const mobileBannerImageExist = this.context.req.files?.mobileBannerImage

    const {
      dbModels: {
        PageBanner: PageBannerModel
      },
      sequelizeTransaction: transaction
    } = this.context
    let updateObj
    try {
      const isBannerExist = await PageBannerModel.findOne({
        where: { pageBannerId },
        attributes: ['pageBannerId', 'desktopImageUrl', 'pageName']
      })

      if (!isBannerExist) return this.addError('BannerNotFoundErrorType')

      // const countDown = {}
      // if (isCountDown === 'true') {
      //   const eventStartDate = new Date(startDate)
      //   const eventEndDate = new Date(endDate)
      //   const currentDate = new Date()

      //   // Set seconds and milliseconds to 00
      //   eventStartDate.setSeconds(0)
      //   eventStartDate.setMilliseconds(0)
      //   eventEndDate.setSeconds(0)
      //   eventEndDate.setMilliseconds(0)

      //   if (isDateValid(eventStartDate) && isDateValid(eventEndDate) && eventStartDate >= currentDate && currentDate <= eventEndDate && eventEndDate >= eventStartDate) {
      //     countDown.isCountDown = true
      //     countDown.startDate = eventStartDate
      //     countDown.endDate = eventEndDate
      //   } else {
      //     return this.addError('InvalidDateErrorType')
      //   }
      // } else {
      //   countDown.isCountDown = false
      //   countDown.startDate = null
      //   countDown.endDate = null
      // }

      updateObj = {
        isActive,
        textThree: textThree,
        isNavigate: isNavigate,
        btnRedirection: btnRedirection,
        pageName: pageName
      }

      // if (pageName && pageName !== isBannerExist.pageName) {
      //   const bannerCount = await PageBannerModel.count({
      //     where: { pageName: isBannerExist.pageName }
      //   })

      //   if (bannerCount <= 1) {
      //     return this.addError('UpdateRouteRequiresAtLeastOneBannerErrorType')
      //   }
      //   updateObj.pageName = pageName
      // }

      let bannerWebPFileName
      let desktopBannerImage
      if (desktopBannerImageExist && desktopBannerImageExist[0] && typeof desktopBannerImageExist[0] === 'object') {
        desktopBannerImage = this.context.req.files?.desktopBannerImage[0]
        const fileName = `${config.get('env')}/assets/desktop/${
          LOGICAL_ENTITY.BANNER
        }/${pageBannerId}-${Date.now()}.webp`
        bannerWebPFileName = await convertToWebPAndUpload(desktopBannerImage, fileName)

        updateObj = { ...updateObj, desktopImageUrl: bannerWebPFileName }
      }

      let mobileBannerWebPFileName
      let mobileBannerImage
      if (mobileBannerImageExist && mobileBannerImageExist[0] && typeof mobileBannerImageExist[0] === 'object') {
        mobileBannerImage = this.context.req.files?.mobileBannerImage[0]
        const fileName = `${config.get('env')}/assets/desktop/${
          LOGICAL_ENTITY.BANNER
        }/${pageBannerId}-${Date.now()}.webp`
        mobileBannerWebPFileName = await convertToWebPAndUpload(mobileBannerImage, fileName)

        updateObj = { ...updateObj, mobileImageUrl: mobileBannerWebPFileName }
      }

      const updateBanner = await PageBannerModel.update(
        updateObj,
        {
          where: { pageBannerId },
          transaction
        }
      )
      await removeData('bannerData')
      return { updateBanner, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
