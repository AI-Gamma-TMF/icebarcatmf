import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import { removeData, prepareImageUrl, convertToWebPAndUpload } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    visibility: { type: 'string', enum: ['0', '1', '2'] }, // 0 - Before Login, 1 - After Login, 2 - Both
    btnText: { type: ['string', 'null'] },
    // textOne: { type: ['string', 'null'] },
    // textTwo: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    navigateRoute: {
      type: ['string', 'null']
    },
    pageRoute: {
      type: ['string', 'null']
    },
    isCountDown: { type: 'string', enum: ['true', 'false'] },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    isNavigate: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['visibility', 'isActive']
}

const constraints = ajv.compile(schema)

export class UploadBannerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      isActive,
      visibility,
      navigateRoute: btnRedirection,
      textThree,
      pageRoute: pageName,
      isNavigate
      // btnText,
      // textOne,
      // textTwo,
      // isCountDown,
      // startDate,
      // endDate,
      // name,
    } = this.args

    const {
      dbModels: {
        PageBanner: PageBannerModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const desktopBannerImageExists = this.context.req.files.desktopBannerImage
    const mobileBannerImageExists = this.context.req.files.mobileBannerImage

    try {
      let lastOrderId = await PageBannerModel.max('order')
      if (!lastOrderId) lastOrderId = 0
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

      //   if (
      //     isDateValid(eventStartDate) &&
      //     isDateValid(eventEndDate) &&
      //     eventStartDate >= currentDate &&
      //     currentDate <= eventEndDate &&
      //     eventEndDate >= eventStartDate
      //   ) {
      //     countDown.isCountDown = true
      //     countDown.startDate = eventStartDate
      //     countDown.endDate = eventEndDate
      //   } else {
      //     return this.addError('InvalidDateErrorType')
      //   }
      // }

      const bannerData = {
        visibility: +visibility,
        isActive,
        pageName: pageName || '',
        order: lastOrderId + 1,
        textThree: textThree || '',
        isNavigate: isNavigate === 'true',
        btnRedirection: isNavigate === 'true' ? btnRedirection : ''
      }

      // if (isCountDown === 'true') {
      //   bannerData = { ...bannerData, ...countDown }
      // }
      if (textThree !== '') bannerData.textThree = textThree // text -description

      const createBanner = await PageBannerModel.create(
        bannerData,
        { transaction }
      )

      let updateObj = {}
      let desktopBannerImage
      let bannerDesktopImage
      if (desktopBannerImageExists && desktopBannerImageExists[0] && typeof desktopBannerImageExists[0] === 'object') {
        bannerDesktopImage = this.context.req.files?.desktopBannerImage[0]
        const fileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.BANNER}/${createBanner.pageBannerId}-${Date.now()}.webp`
        desktopBannerImage = await convertToWebPAndUpload(bannerDesktopImage, fileName)
        updateObj = { ...updateObj, desktopImageUrl: desktopBannerImage }
      }

      let mobileBannerImage
      let bannerMobileImage
      if (mobileBannerImageExists && mobileBannerImageExists[0] && typeof mobileBannerImageExists[0] === 'object') {
        bannerMobileImage = this.context.req.files?.mobileBannerImage[0]
        const fileName = `${config.get('env')}/assets/desktop/${LOGICAL_ENTITY.BANNER}/${createBanner.pageBannerId}-${Date.now()}.webp`
        mobileBannerImage = await convertToWebPAndUpload(bannerMobileImage, fileName)
        updateObj = { ...updateObj, mobileImageUrl: mobileBannerImage }
      }

      await PageBannerModel.update(
        updateObj,
        {
          where: { pageBannerId: createBanner.pageBannerId },
          transaction
        }
      )

      createBanner.dataValues.desktopBannerImage = prepareImageUrl(desktopBannerImage)
      createBanner.dataValues.mobileBannerImage = prepareImageUrl(mobileBannerImage)
      createBanner.dataValues.pageRoute = pageName
      createBanner.dataValues.isNavigate = !!btnRedirection
      createBanner.dataValues.navigateRoute = btnRedirection
      const keysToDelete = [
        'desktopImageUrl',
        'mobileImageUrl',
        'pageName',
        'btnRedirection',
        'deletedAt',
        'name',
        'textOne',
        'textTwo'
      ]
      keysToDelete.forEach(key => delete createBanner.dataValues[key])
      await removeData('bannerData')
      return {
        createBanner,
        message: SUCCESS_MSG.CREATE_SUCCESS,
        success: true
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
