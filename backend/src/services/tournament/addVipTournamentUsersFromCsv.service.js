import ServiceBase from '../../libs/serviceBase'
import { parse } from 'csv-parse'
// import { TOURNAMENT_STATUS } from '../../utils/constants/constant'

export class AddVipTournamentUsersFromCSV extends ServiceBase {
  async run () {
    const { file, /* tournamentId, */ vipTournament } = this.args
    const {
      dbModels: {
        // Tournament: TournamentModel,
        User: UserModel,
        UserTier: UserTierModel
      },
      sequelize
      // sequelizeTransaction: transaction
    } = this.context

    if (!file || !file.buffer) {
      return this.addError('RequestInputValidationErrorType')
    }
    try {
      // const tournament = await TournamentModel.findOne({
      //   attributes: { exclude: ['createdAt', 'updatedAt'] },
      //   where: { tournamentId: tournamentId },
      //   raw: true
      // })

      // if (!tournament) {
      //   return this.addError('TournamentNotExistErrorType')
      // }

      if (!vipTournament) {
        return this.addError('VipTournamentErrorType')
      }
      // if ([TOURNAMENT_STATUS.COMPLETED, TOURNAMENT_STATUS.CANCELLED].includes(+tournament?.status)) {
      //   return this.addError('TournamentAlreadyFinishedErrorType')
      // }
      // Parse the CSV file
      let emails = await this.parseCsv(file.buffer)
      const inputEmailCount = emails.length
      emails = [...new Set(emails)]
      const validEmails = emails.filter(email => this.isValidEmail(email))

      if (!validEmails.length) {
        return this.addError('RequestInputValidationErrorType')
      }
      // get corresponding userIds from user table
      const allowedUsersArray = (await UserModel.findAll({
        attributes: ['userId', 'email', 'username', 'UserTier.level', [
          sequelize.literal(`
            (SELECT name
              FROM tiers
              WHERE "tiers"."tier_id" = "UserTier"."tier_id")
          `),
          'tierName'
        ]],
        include: [
          {
            model: UserTierModel,
            attributes: []
          }
        ],
        where: {
          email: validEmails,
          isActive: true
        },
        raw: true
      }))

      const validUserIdCount = allowedUsersArray.length
      // const updatedAllowedUsers = [...new Set([...(tournament.allowedUsers || []), ...allowedUsersArray])]

      // await TournamentModel.update({
      //   allowedUsers: updatedAllowedUsers,
      //   vipTournament: vipTournament
      // },
      // {
      //   where: {
      //     tournamentId: +tournament.tournamentId
      //   },
      //   transaction
      // })

      return {
        success: true,
        // message: `For ${validUserIdCount} users out of ${inputEmailCount}, ${inputEmailCount - validUserIdCount} invalid and in-active user's email(s) rejected.`,
        // data: {
        //   tournamentId: +tournament?.tournamentId,
        //   vipTournament: tournament.vipTournament
        // }
        message: `For ${validUserIdCount} users out of ${inputEmailCount}, ${inputEmailCount - validUserIdCount} invalid and in-active user's email(s) rejected.`,
        data: { allowedUsersArray }
      }
    } catch (error) {
      const errorMessage = `Error parsing CSV file: ${error.message}`
      console.error(errorMessage)
      if (error.status === 422) {
        return {
          status: error.status,
          message: errorMessage
        }
      }
      throw new Error(`Error processing CSV: ${error.message}`)
    }
  }

  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const emails = []

      // Parse the CSV from the file buffer
      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record

        while ((record = parser.read())) {
          if (!record.email) {
            const err = new Error('Invalid CSV file: "email" column is required')
            err.status = 422
            reject(err)
          }
          emails.push(record.email.toLowerCase())
        }
      })

      parser.on('end', () => {
        resolve(emails)
      })

      parser.on('error', err => {
        reject(err)
      })

      // Write the buffer into the parser
      parser.write(fileBuffer)
      parser.end()
    })
  }

  isValidEmail (email) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return emailRegex.test(email)
  }
}
