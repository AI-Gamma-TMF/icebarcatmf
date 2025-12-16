import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY, OK } from '../../utils/constants/constant'
import { removeData, updateTierLevel, updateUsersTierJobScheduler, uploadFile, validateIconFile } from '../../utils/common'

export class UpdateTierService extends ServiceBase {
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
      tierId,
      weeklyBonusPercentage,
      monthlyBonusPercentage,
      isWeekelyBonusActive,
      isMonthlyBonusActive
    } = this.args

    let updateObj = {}

    const findTier = await TierModel.findOne({
      where: {
        tierId
      }
    })

    if (!findTier) throw this.addError('TierNotFoundErrorType')

    if (file && typeof file === 'object') {
      const fileCheckResponse = validateIconFile(null, file)
      if (fileCheckResponse !== OK) return this.addError('FileTypeNotSupportedErrorType')

      const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.TIER}/${
        findTier.tierId
      }-${Date.now()}.${file.originalname.split('.')[1]}`
      await uploadFile(file, fileName)

      updateObj = {
        ...updateObj,
        icon: fileName
      }
    }

    updateObj = {
      ...updateObj,
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      requiredXp: +requiredXp,
      bonusGc,
      bonusSc,
      weeklyBonusPercentage,
      monthlyBonusPercentage,
      isWeekelyBonusActive,
      isMonthlyBonusActive
    }

    if (findTier.level === 1) {
      delete updateObj.requiredXp
      delete updateObj.bonusGc
      delete updateObj.bonusSc
    }

    await TierModel.update(updateObj, { where: { tierId }, transaction })

    await Promise.all([updateTierLevel(transaction), removeData('tier-data'), removeData('base-tier-data')])

    await updateUsersTierJobScheduler()

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }
}
