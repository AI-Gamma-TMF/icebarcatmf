import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import { Op } from 'sequelize'
import { removeData, uploadFile } from '../../../utils/common'
import config from '../../../configs/app.config'
import { LOGICAL_ENTITY } from '../../../utils/constants/constant'
import redisClient from '../../../libs/redisClient'

const s3Config = config.getProperties().s3

export class UpdateScratchCardService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ScratchCardConfiguration: ScratchCardConfigurationModel,
        Bonus: BonusModel,
        Package: PackageModel,
        ScratchCards: ScratchCardsModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const { configId, scratchCardId, scratchCardName, isActive, rewardType, minReward, maxReward, percentage, playerLimit, isActive: configIsActive, imageUrl, image, message: configMessage } = this.args
    let msg = SUCCESS_MSG.UPDATE_SUCCESS

    try {
      // Parent data logic (no id)
      if (!configId) {
        // Check before in active the scratch card if it enabled for any bonus or package
        if (isActive === false) {
          const [bonusCheck, packagesCheck] = await Promise.all([
            BonusModel.findAll({ where: { scratchCardId }, transaction }),
            PackageModel.findAll({ where: { scratchCardId }, transaction })
          ])

          if (bonusCheck.length > 0) {
            return { success: false, message: 'Scratch Card is already in use for Daily bonus' }
          }
          if (packagesCheck.length > 0) {
            return { success: true, message: 'Scratch Card is already in use for Package' }
          }

          await ScratchCardsModel.update({ isActive: false }, { where: { scratchCardId }, transaction })

          msg = SUCCESS_MSG.UPDATE_SUCCESS
        }

        const updateObj = {}
        // Active the scratch card
        if (isActive === true) {
          updateObj.isActive = true
        }
        // Update scratch card name & checks if the name already exists
        if (scratchCardName) {
          const trimmedName = scratchCardName.trim()
          if (!trimmedName) {
            return { success: false, message: 'Scratch Card Name Should Not Be Empty' }
          }
          updateObj.scratchCardName = trimmedName
        }
        if (configMessage) { // update message
          updateObj.message = configMessage
        }
        await ScratchCardsModel.update(updateObj, { where: { scratchCardId }, transaction })
      }

      // Config data logic (has id, child data)
      if (configId) {
        // Fetch existing active records (excluding soft-deleted ones)
        const existingRecords = await ScratchCardConfigurationModel.findAll({
          where: { scratchCardId, rewardType, isActive: true },
          paranoid: true,
          transaction
        })
        // Exclude current record from the check
        const others = existingRecords.filter(r => r.id !== configId)

        const totalPercentage = others.reduce((sum, item) => {
          return sum + (item.percentage)
        }, 0)

        if (totalPercentage + percentage > 100) {
          msg = `Total percentage of Scratch Card is ${totalPercentage + percentage}%. It should not exceed 100%.`
          return { success: false, message: msg }
        }

        // Validate percentage
        if (percentage === 0 && configIsActive !== false) return { success: false, message: 'percentage Should Be Greater Than Zero' }
        // Check for reward range conflict
        const hasRewardRangeConflict = others.some(r => r.minReward === minReward && r.maxReward === maxReward)
        if (hasRewardRangeConflict) {
          return {
            success: false,
            message: `Min ${minReward} and Max ${maxReward} reward already exist for scratchCardId ${scratchCardId} and rewardType ${rewardType}`
          }
        }
        // Check if an exact duplicate record exists
        const exactExistingRecord = await ScratchCardConfigurationModel.findOne({
          where: {
            id: { [Op.ne]: configId },
            scratchCardId,
            rewardType,
            minReward,
            maxReward,
            percentage,
            playerLimit,
            isActive: configIsActive
          },
          transaction
        })

        if (exactExistingRecord) {
          return { success: false, message: 'Record Already exist' }
        }

        const updateObj = { minReward, maxReward, percentage, playerLimit, isActive: configIsActive, imageUrl, message: configMessage || null }

        if (imageUrl) {
          // Create a URL object
          const parsedUrl = new URL(imageUrl)
          // Get the pathname (removes domain part)
          const fileName = parsedUrl.pathname.slice(1)
          updateObj.imageUrl = fileName
        } else if (image && typeof image === 'object') {
          const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.SCRATCH_CARD}/${Date.now()}.${image.mimetype.split('/')[1]}`

          await uploadFile(image, fileName)
          updateObj.imageUrl = fileName
          const imageUrlArray = `${s3Config.S3_DOMAIN_KEY_PREFIX}${fileName}`
          await redisClient.client.sadd('scratchCardIdImageArray', imageUrlArray)
        }
        await ScratchCardConfigurationModel.update(updateObj, { where: { id: configId }, transaction })
      }
      await removeData(`scratchCardConfig:${scratchCardId}`)
      return { success: true, message: msg }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
