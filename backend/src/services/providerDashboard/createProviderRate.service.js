import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class CreateProviderRateService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ProviderRate: ProviderRateModel
      },
      sequelizeTransaction: transaction
    } = this.context

    let { aggregatorId, providerId, rateEntries } = this.args

    try {
      const existingRate = await ProviderRateModel.findOne({
        attributes: ['aggregatorId', 'providerId'],
        where: {
          aggregatorId,
          providerId
        },
        transaction
      })

      if (existingRate) return this.addError('ProviderRateAlreadyExistErrorType')

      if (rateEntries.length === 0) {
        return this.addError('EmptyRateEntriesErrorType')
      }

      rateEntries = [...rateEntries].sort((a, b) => a.ggrMinimum - b.ggrMinimum)

      if (rateEntries[0].ggrMinimum !== 0) {
        return this.addError('FirstRangeMustStartFromZeroErrorType')
      }

      if (rateEntries[rateEntries.length - 1].ggrMaximum !== null) {
        return this.addError('LastRangeMustBeInfiniteErrorType')
      }

      rateEntries[0].aggregatorId = aggregatorId
      rateEntries[0].providerId = providerId

      for (let index = 0; index < rateEntries.length; index++) {
        const current = rateEntries[index]
        const { ggrMinimum, ggrMaximum } = current

        if (ggrMinimum < 0 || (ggrMaximum !== null && ggrMinimum >= ggrMaximum)) {
          return this.addError('InvalidNumberRangeErrorType')
        }

        // compare current entry data with last entry (skip first entry)
        if (index > 0) {
          const lastEntry = rateEntries[index - 1]
          const expectedCurrentEntryGgrMinimum = (lastEntry?.ggrMaximum ?? 0) + 1
          if (ggrMinimum !== expectedCurrentEntryGgrMinimum) return this.addError('RangeMustBeSequentialErrorType')
        }
      }

      const insertPayload = rateEntries.map(entry => ({
        aggregatorId,
        providerId,
        ...entry
      }))

      await ProviderRateModel.bulkCreate(insertPayload, { transaction })

      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
