import { Op } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY, OK } from '../../utils/constants/constant'
import {
  updateTierLevel,
  updateUsersTierJobScheduler,
  uploadFile,
  validateIconFile
} from '../../utils/common'

export class CreateTierService extends ServiceBase {
  async run () {
    const {
      dbModels: { Tier: TierModel },
      req: { file },
      sequelizeTransaction: transaction
    } = this.context

    const {
      name,
      requiredXp,
      bonusGc,
      bonusSc,
      isActive,
      weeklyBonusPercentage,
      monthlyBonusPercentage,
      isWeekelyBonusActive,
      isMonthlyBonusActive
    } = this.args

    const numberOfTiers = await TierModel.count()

    if (numberOfTiers > 6) return this.addError('TiersCannotBeMoreThanSixErrorType')

    const findTier = await TierModel.findOne({
      where: {
        [Op.or]: [
          {
            name
          },
          { requiredXp: +requiredXp }
        ]
      }
    })

    if (findTier) return this.addError('TiersCannotHaveSameNameOrRequiredXpErrorType')

    if (file && typeof file === 'object') {
      const fileCheckResponse = validateIconFile(null, file)
      if (fileCheckResponse !== OK) return this.addError('FileTypeNotSupportedErrorType')
    }

    const createdTier = await TierModel.create({
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      requiredXp: +requiredXp,
      bonusGc,
      bonusSc,
      isActive,
      weeklyBonusPercentage,
      monthlyBonusPercentage,
      isWeekelyBonusActive,
      isMonthlyBonusActive
    })

    await updateTierLevel(transaction)

    if (file && typeof file === 'object') {
      const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.TIER}/${
        createdTier.tierId
      }-${Date.now()}.${file.originalname.split('.')[1]}`
      await uploadFile(file, fileName)

      await TierModel.update(
        {
          icon: fileName
        },
        {
          where: {
            tierId: createdTier.tierId
          },
          transaction
        }
      )
    }

    await updateUsersTierJobScheduler()

    return {
      success: true,
      message: SUCCESS_MSG.CREATE_SUCCESS
    }
  }
}
