import { Op } from 'sequelize'
import { plus, round } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'
import config from '../../configs/app.config'
import { checkIfIntOrNull, convertToWebPAndUpload, tournamentJobScheduler, triggerTournamentNotification } from '../../utils/common'
export class CreateTournamentService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tournament: TournamentModel,
        User: UserModel,
        MasterCasinoGame: MasterCasinoGameModel
      },
      req: { file: tournamentImg },
      sequelizeTransaction: transaction
    } = this.context
    const {
      title,
      description,
      entryAmount,
      entryCoin,
      startDate,
      endDate,
      gameId,
      winGc,
      winSc,
      vipTournament,
      allowedUsers,
      playerLimit,
      // isActive = true,
      winnerPercentage = [100],
      imageUrl,
      vipTournamentTitle,
      isSubscriberOnly
    } = this.args
    const { id } = this.context.req.body

    try {
      const gameStartDate = new Date(startDate)
      const gameEndDate = new Date(endDate)
      const gameIdArray = gameId.map(Number)
      const winnerPercentageArray = winnerPercentage.map(Number)
      const gamePlayerLimit = checkIfIntOrNull(playerLimit)

      let fileName, allowedUsersArray

      if (!(gameStartDate instanceof Date) || isNaN(gameStartDate) || !(gameEndDate instanceof Date) || isNaN(gameEndDate) || gameStartDate <= new Date() || gameEndDate <= new Date() || gameStartDate >= gameEndDate) { return this.addError('InvalidDateErrorType') }

      if (+entryAmount < 0 || +winGc < 0 || +winSc < 0) { return this.addError('InvalidAmountErrorType') }
      if (gameIdArray.length < 1) { return this.addError('MinimumGameLimitBreachedErrorType') }
      if (gameIdArray.length > 50) { return this.addError('MaximumGameLimitExceededErrorType') }

      let winnerPercentageSum = winnerPercentageArray.reduce((sum, value) => +plus(+sum, +value), 0)
      // rounding it upto next integer value
      winnerPercentageSum = Math.round(winnerPercentageSum)
      // We can add upto 100 winner
      if (winnerPercentageArray.length > 100) { return this.addError('WinnerPercentageCannotBeOtherThan100ErrorType') }
      if (winnerPercentageSum !== 100) { return this.addError('WinnerPercentageCannotBeOtherThan100ErrorType') }
      if (+gamePlayerLimit && +gamePlayerLimit < winnerPercentageArray.length) return this.addError('WinnersCannotBeMoreThanAllowedPlayersErrorType')
      if (vipTournament) {
        // if (!allowedUsers?.length) {
        //   return this.addError('VipTournamentRequiredMoreThanZeroUsersErrorType')
        // }
        if (allowedUsers && allowedUsers.length > 0) {
          allowedUsersArray = (await UserModel.findAll({
            attributes: ['userId'],
            where: {
              userId: {
                [Op.in]: allowedUsers
              },
              isActive: true
            },
            raw: true
          })).map(user => user.userId)
        }
      }
      // For Duplicate Tournament
      if (imageUrl) {
        // Create a URL object
        const parsedUrl = new URL(imageUrl)
        // Get the pathname (removes domain part)
        fileName = parsedUrl.pathname.slice(1)
      }

      if (tournamentImg) {
        if (tournamentImg && typeof tournamentImg === 'object') {
          fileName = `${config.get('env')}/tournament/assets/${title}/-long-${Date.now()}.webp`
          fileName = fileName.split(' ').join('')
          await convertToWebPAndUpload(tournamentImg, fileName)
        }
      }
      const masterCasinoGameIds = (
        await MasterCasinoGameModel.findAll({
          where: {
            masterCasinoGameId: {
              [Op.in]: gameIdArray
            },
            isActive: true
          }
        })
      ).map(game => {
        return game.masterCasinoGameId
      })

      // Game Dashboard Analytics for Game wise GGR
      const gameBetWinStats = masterCasinoGameIds.reduce((acc, id) => {
        acc[id] = { totalBet: 0, totalWin: 0 }
        return acc
      }, {})

      let moreDetails = {}
      if (vipTournamentTitle !== undefined && vipTournamentTitle !== '') {
        moreDetails = { ...moreDetails, vipTournamentTitle }
      }

      const createObj = {
        title,
        description,
        entryAmount: round(+entryAmount, 2),
        entryCoin,
        startDate: gameStartDate,
        endDate: gameEndDate,
        gameId: masterCasinoGameIds,
        winSc: round(+winSc, 2),
        winGc: round(+winGc, 2),
        playerLimit: gamePlayerLimit,
        vipTournament: vipTournament,
        allowedUsers: allowedUsersArray,
        winnerPercentage: winnerPercentageArray,
        status: TOURNAMENT_STATUS.UPCOMING,
        imageUrl: fileName,
        gameBetWinStats: gameBetWinStats,
        moreDetails: moreDetails,
        isSubscriberOnly
      }
      const createdTournament = await TournamentModel.create(createObj, {
        transaction
      })

      triggerTournamentNotification(
        createObj.title,
        createObj.entryAmount,
        createObj.winGc,
        createObj.winSc,
        createObj.startDate,
        createObj.endDate,
        id,
        fileName
      )

      tournamentJobScheduler('POST', +createdTournament.tournamentId)

      return {
        success: true,
        message: SUCCESS_MSG.CREATE_SUCCESS,
        data: { tournamentId: +createdTournament.tournamentId }
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
