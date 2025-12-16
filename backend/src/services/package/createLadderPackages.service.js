import { round } from 'number-precision'
import { Sequelize } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'
import { isDateValid, isValidAmount, prepareImageUrl, uploadFile } from '../../utils/common'
import redisClient from '../../libs/redisClient'

export class CreateLadderPackageService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      amountArray,
      gcCoinArray,
      scCoinArray,
      isActive,
      image,
      validTill,
      currency = 'USD',
      isVisibleInStore,
      purchaseLimitPerUser,
      validFrom,
      bonusScArray,
      bonusGcArray,
      playerIds,
      filterType,
      filterOperator,
      filterValue,
      packageNameArray,
      isSpecialPackageArray,
      ladderPackageCount,
      imageUrl
    } = this.args
    try {
      const packages = []
      let successMessage = SUCCESS_MSG.CREATE_SUCCESS
      let specialPackageDetail = {}
      const s3Config = config.getProperties().s3

      if (isSpecialPackageArray.filter(i => i === 'true').length > 1) return this.addError('DuplicateSpecialPackageErrorType')

      if (isSpecialPackageArray.includes('true')) {
        specialPackageDetail = await PackageModel.findOne({
          attributes: ['packageId'],
          where: {
            isSpecialPackage: true,
            purchaseNo: 0
          },
          transaction
        })
      }

      for (let i = 0; i < ladderPackageCount; i++) {
        const amount = amountArray[i]
        const gcCoin = gcCoinArray[i]
        const scCoin = scCoinArray[i]
        const bonusSc = bonusScArray[i]
        const bonusGc = bonusGcArray[i]
        const packageName = packageNameArray[i]
        const isSpecialPackage = JSON.parse(isSpecialPackageArray[i])

        if (isValidAmount(+amount)) return this.addError('AmountInvalidErrorType')
        if (isValidAmount(gcCoin) && isValidAmount(scCoin)) return this.addError('InvalidCoinAmountErrorType')

        const createPackage = {
          amount: +round(+amount, 2),
          gcCoin: +round(+gcCoin, 2),
          scCoin: +round(+scCoin, 2),
          currency,
          isActive,
          isVisibleInStore,
          purchaseLimitPerUser: purchaseLimitPerUser ? +purchaseLimitPerUser : 0,
          bonusSc: bonusSc || 0,
          bonusGc: bonusGc || 0,
          isSpecialPackage: isSpecialPackage
        }

        if (filterType && filterOperator && filterValue !== '') {
          const moreData = {
            filterType,
            filterOperator,
            filterValue: +filterValue
          }
          createPackage.playerId = playerIds
          createPackage.moreDetails = moreData
        }

        if (validTill && isDateValid(validTill)) createPackage.validTill = new Date(validTill)
        if (validFrom && isDateValid(validFrom)) createPackage.validFrom = new Date(validFrom)

        if (packageName) {
          const name = packageName.trim().toLowerCase()
          const isPackageNameExist = await PackageModel.findOne({
            where: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('package_name')), name)
          })
          if (isPackageNameExist) {
            return this.addError('PackageWithSameNameAlreadyExistErrorType')
          }
          createPackage.packageName = packageName
        }

        if (isSpecialPackage && specialPackageDetail) {
          await PackageModel.update({ isSpecialPackage: false }, { where: { packageId: specialPackageDetail.packageId }, transaction })
          successMessage = `${specialPackageDetail.packageId} was special package before, it was removed.`
        }

        packages.push(createPackage)
      }

      const newPackage = await PackageModel.bulkCreate(packages, { transaction })
      const newPackageIds = newPackage.map((item) => item.packageId)

      let fileName
      // update image through url
      if (imageUrl) {
        // Create a URL object
        const parsedUrl = new URL(imageUrl)
        // Get the pathname (removes domain part)
        fileName = parsedUrl.pathname.slice(1)

        await PackageModel.update({ imageUrl: fileName }, { where: { packageId: newPackageIds }, transaction })

        for (let i = 0; i < newPackage.length; i++) {
          newPackage[i].imageUrl = prepareImageUrl(fileName)
        }
      } else if (image && typeof image === 'object') {
        fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PACKAGE}/${newPackage[0].packageId}-${Date.now()}.${image.mimetype.split('/')[1]}`

        await uploadFile(image, fileName)

        await PackageModel.update(
          {
            imageUrl: fileName
          },
          {
            where: {
              packageId: newPackageIds
            },
            transaction
          }
        )
        for (let i = 0; i < newPackage.length; i++) {
          newPackage[i].imageUrl = prepareImageUrl(fileName)
        }
      }

      if (!imageUrl) {
        const imageUrlArray = `${s3Config.S3_DOMAIN_KEY_PREFIX}${fileName}`
        // await redisClient.client.lpush('packageIdImageArray', imageUrlArray)
        await redisClient.client.sadd('packageIdImageArray', imageUrlArray)
      }

      return { createPackage: newPackage, success: true, message: successMessage }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
