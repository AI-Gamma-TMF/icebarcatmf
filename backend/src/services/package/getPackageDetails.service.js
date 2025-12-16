import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { prepareImageUrl } from '../../utils/common'
import { Readable } from 'stream'
import { Parser } from 'json2csv'
export class GetPackageDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        User: UserModel,
        NonPurchasePackages: NonPurchasePackagesModel,
        ScratchCards: ScratchCardsModel,
        FreeSpinBonusGrant: FreeSpinBonusGrantModel
      },
      req
    } = this.context
    const { packageId } = req.params
    const { csvDownload, isArchive = '' } = this.args
    let query, packageList, stream
    let userDetails = []

    try {
      if (packageId) query = { ...query, packageId }
      if (isArchive !== '') {
        query = { ...query, deletedAt: { [Op.not]: null } }
      }

      packageList = await PackageModel.findOne({
        where: query,
        include: [ // Including the NonPurchasePackages to get the sub packages for the package
          {
            as: 'nonPurchasePackages',
            model: NonPurchasePackagesModel,
            attributes: [
              'nonPurchasePackageId',
              'packageId',
              'discountedAmount',
              [Sequelize.col('interval_day'), 'intervalDays'],
              [Sequelize.col('is_active'), 'subpackageIsActive'],
              [Sequelize.col('bonus_percentage'), 'subpackageBonusPercentage'],
              [Sequelize.col('sc_coin'), 'subpackageScCoin'],
              [Sequelize.col('gc_coin'), 'subpackageGcCoin'],
              [Sequelize.col('sc_bonus'), 'subpackageScBonus'],
              [Sequelize.col('gc_bonus'), 'subpackageGcBonus'],
              [Sequelize.col('no_of_purchases'), 'subpackageNoOfPurchase'],
              [Sequelize.col('last_purchased'), 'subpackagePurchaseDate'],
              'createdAt', 'updatedAt', 'deletedAt'],
            required: false,
            order: [['intervalDay', 'ASC']],
            paranoid: true
          },
          {
            as: 'scratchCard',
            model: ScratchCardsModel,
            attributes: ['scratchCardName']
          },
          {
            as: 'freeSpinBonus',
            model: FreeSpinBonusGrantModel,
            attributes: ['freeSpinId', 'title', 'status']
          }
        ],
        paranoid: !isArchive
      })
      if (!packageList) return this.addError('NotFound')
      packageList.dataValues.imageUrl = prepareImageUrl(packageList?.imageUrl)
      packageList.dataValues.isScheduled = packageList?.validFrom != null && packageList?.validTill != null
      packageList.dataValues.freezeValidFrom = packageList?.validFrom != null && packageList?.validFrom < new Date()
      packageList.dataValues.freezeValidTill = packageList?.validTill != null && packageList?.validTill < new Date()
      if (packageList?.playerId?.length > 0) {
        userDetails = await UserModel.findAll({ // Getting User details for showing list of users assigned to the package on edit package page & CSV download
          attributes: ['userId', 'email', 'username', 'isActive'],
          where: { userId: { [Op.in]: packageList?.playerId }, isActive: true, isBan: false, isRestrict: false, isInternalUser: false },
          order: [['userId', 'ASC']],
          raw: true
        })
        packageList.dataValues.userDetails = userDetails
        if (csvDownload && csvDownload === 'true') {
          stream = await this.createStream({ userDetails })
          return { stream, packageId, message: 'CSV file generated successfully' }
        }
      }
      if (stream) {
        return stream
      }

      return { packageList, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }

  async createStream ({ userDetails }) {
    const stream = new Readable({ objectMode: true })
    stream._read = () => {
      if (userDetails.length > 0) {
        const modifiedChunk = userDetails.map(item => {
          return {
            email: item.email
          }
        })
        const json2csv = new Parser()
        const csv = json2csv.parse(modifiedChunk)
        stream.push(csv + '\n')
        userDetails.length = 0
      } else {
        stream.push(null)
      }
    }
    return stream
  }
}
