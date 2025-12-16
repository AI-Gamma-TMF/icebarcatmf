import { parse } from 'csv-parse'
import ajv from '../../../libs/ajv'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { removeData, updateRedeemJobTime } from '../../../utils/common'

const schema = {
  type: 'object',
  properties: {
    ruleId: {
      type: 'number'
    },
    file: {
      type: ['object']
    }
  },
  required: ['ruleId']
}

const constraints = ajv.compile(schema)

export class GetUsersFromCsvService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        RedeemRule: RedeemRuleModel,
        User: UserModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { ruleId, file } = this.args

    try {
      const isRuleExist = await RedeemRuleModel.findOne({
        attributes: ['playerIds'],
        where: { ruleId },
        transaction
      })

      if (!isRuleExist) return this.addError('RuleNotFoundErrorType')

      let userEmails

      userEmails = await this.parseCsv(file.buffer)
      const totalUsersCount = userEmails.length

      userEmails = [...new Set(userEmails)]
      const validEmails = userEmails.filter(email => this.isValidEmail(email))

      if (!validEmails.length) {
        return this.addError('RequestInputValidationErrorType')
      }

      const playerIds = (
        await UserModel.findAll({
          where: { email: validEmails, isActive: true },
          attributes: ['userId'],
          raw: true,
          transaction
        })
      ).map(({ userId }) => userId)

      const existingPlayerIds = isRuleExist?.playerIds || []

      const updatedUsers = [...new Set([...existingPlayerIds, ...playerIds])]

      await RedeemRuleModel.update({
        playerIds: updatedUsers
      }, { where: { ruleId }, transaction })

      await removeData('redeem-rule-data')

      updateRedeemJobTime(ruleId)

      return { success: true, message: `Out of ${totalUsersCount} users, emails of ${totalUsersCount - playerIds.length} invalid or inactive users were rejected.` }
    } catch (error) {
      if (error.status === 422) {
        return this.addError('InvalidCsvFileEmailColumnIsRequiredErrorType')
      }
      console.log('ERROR OCCUR IN ProcessUserEmailFromCsvService')
      return this.addError('InternalServerErrorType', error)
    }
  }

  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const emails = []

      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record

        while ((record = parser.read())) {
          if (!record.email) {
            const err = new Error(
              'Invalid CSV file: "email" column is required'
            )
            err.status = 422
            reject(err)
          }
          emails.push(record.email)
        }
      })

      parser.on('end', () => {
        resolve(emails)
      })

      parser.on('error', err => {
        reject(err)
      })

      parser.write(fileBuffer)
      parser.end()
    })
  }

  isValidEmail (email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return emailRegex.test(email)
  }
}
