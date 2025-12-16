import { Op } from 'sequelize'
import { plus, round } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'
import config from '../../configs/app.config'
import { checkIfIntOrNull, convertToWebPAndUpload, isDateValid, refreshMaterializedView, tournamentJobScheduler, triggerTournamentUpdateNotification } from '../../utils/common'

export class UpdateTournamentService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Tournament: TournamentModel,
        UserTournament: UserTournamentModel,
        MasterCasinoGame: MasterCasinoGameModel
      },
      req: { file: tournamentImg },
      sequelizeTransaction: transaction
    } = this.context

    const {
      tournamentId,
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
      winnerPercentage,
      removeAllAllowedUsers,
      vipTournamentTitle,
      isSubscriberOnly
    } = this.args

    try {
      const tournamentExist = await TournamentModel.findOne({
        where: { tournamentId: +tournamentId }
      })

      if (!tournamentExist) return this.addError('TournamentNotExistErrorType')
      if (
        tournamentExist?.endDate < new Date() ||
        [TOURNAMENT_STATUS.COMPLETED, TOURNAMENT_STATUS.CANCELLED].includes(+tournamentExist?.status)
      ) {
        return this.addError('TournamentAlreadyFinishedErrorType')
      }
      const currentDate = new Date()
      let fileName, gameStartDate, gameEndDate, gameIdArray, gamePlayerLimit, winnerPercentageArray, winnerPercentageSum, masterCasinoGameIds, winGcUpdated, winScUpdated, entryAmountUpdated, allowedUsersArray, gameBetWinStatsUpdated
      let moreDetails = { ...tournamentExist?.moreDetails }
      if (startDate && endDate) {
        const updatedStartDate = new Date(startDate)
        const updatedEndDate = new Date(endDate)
        if (
          isDateValid(updatedStartDate) &&
          isDateValid(updatedEndDate) &&
          updatedStartDate >= currentDate &&
          updatedEndDate >= currentDate &&
          updatedStartDate <= updatedEndDate &&
          +tournamentExist.status === TOURNAMENT_STATUS.UPCOMING
        ) {
          gameStartDate = updatedStartDate
          gameEndDate = updatedEndDate
        } else {
          this.addError('InvalidDateErrorType')
        }
      } else if (startDate) {
        const updatedStartDate = new Date(startDate)
        if (
          !isDateValid(updatedStartDate) ||
          updatedStartDate < currentDate ||
          updatedStartDate > tournamentExist?.endDate
        ) {
          this.addError('InvalidDateErrorType')
        } else if (+tournamentExist.status === TOURNAMENT_STATUS.RUNNING) {
          this.addError('TournamentIsRunningStartDateErrorType')
        } else {
          gameStartDate = updatedStartDate
        }
      } else if (endDate) {
        const updatedEndDate = new Date(endDate)
        if (
          !isDateValid(updatedEndDate) ||
          updatedEndDate < currentDate ||
          tournamentExist?.startDate > updatedEndDate
        ) {
          this.addError('TournamentEndDateErrorType')
        } else {
          gameEndDate = updatedEndDate
        }
      }

      if (gameId) {
        gameIdArray = gameId.map(Number)
        if (gameIdArray.length < 1) { return this.addError('MinimumGameLimitBreachedErrorType') }
        if (gameIdArray.length > 50) { return this.addError('MaximumGameLimitExceededErrorType') }
        masterCasinoGameIds = (
          await MasterCasinoGameModel.findAll({
            where: {
              masterCasinoGameId: {
                [Op.in]: gameIdArray
              },
              isActive: true
            }
          })).map(game => {
          // Check if the gameId key exists in the gameData JSON
          if (!tournamentExist?.gameBetWinStats[game.masterCasinoGameId]) {
            tournamentExist.gameBetWinStats[game.masterCasinoGameId] = { totalBet: 0, totalWin: 0 }
            gameBetWinStatsUpdated = tournamentExist.gameBetWinStats
          }
          return game.masterCasinoGameId
        })
      }
      if (vipTournament !== undefined || tournamentExist.vipTournament) {
        if (vipTournament === true && Array.isArray(allowedUsers) && allowedUsers.length <= 0) {
          return this.addError('VipTournamentRequiredMoreThanZeroUsersErrorType')
        }
        if (Array.isArray(allowedUsers) && allowedUsers.length > 0) {
          allowedUsersArray = (await UserModel.findAll({
            attributes: ['userId'],
            where: {
              userId: { [Op.in]: allowedUsers },
              isActive: true
            },
            raw: true
          })).map(user => user.userId)
        } else if (removeAllAllowedUsers) {
          allowedUsersArray = null
        }
        if (vipTournamentTitle !== undefined) {
          moreDetails = { ...moreDetails, vipTournamentTitle }
        }
      }
      if (playerLimit !== undefined) {
        gamePlayerLimit = checkIfIntOrNull(playerLimit)
      }

      if (winnerPercentage) {
        winnerPercentageArray = winnerPercentage.map(Number)
        winnerPercentageSum = winnerPercentageArray.reduce((sum, value) => +plus(+sum, +value), 0)
        // rounding it upto next integer value
        winnerPercentageSum = Math.round(winnerPercentageSum)
        // We can add upto 100 winner
        if (winnerPercentageArray.length > 100) { return this.addError('WinnerPercentageCannotBeOtherThan100ErrorType') }
        if (winnerPercentageSum !== 100) { return this.addError('WinnerPercentageCannotBeOtherThan100ErrorType') }
      }
      if (entryAmount !== undefined) entryAmountUpdated = round(+entryAmount, 2)
      if (winGc !== undefined) winGcUpdated = round(+winGc, 2)
      if (winSc !== undefined) winScUpdated = round(+winSc, 2)
      if (+entryAmount < 0 || +winGc < 0 || +winSc < 0) { return this.addError('InvalidAmountErrorType') }
      if (gamePlayerLimit !== null) {
        if (winnerPercentageArray && (gamePlayerLimit < winnerPercentageArray.length)) {
          return this.addError('WinnersCannotBeMoreThanAllowedPlayersErrorType')
        }
        if (!winnerPercentageArray && gamePlayerLimit < +(tournamentExist?.winnerPercentage).length) {
          return this.addError('WinnersCannotBeMoreThanAllowedPlayersErrorType')
        }
      }

      const alreadyRegisteredUsers = await UserTournamentModel.count({ where: { tournamentId: +tournamentExist.tournamentId } }) || 0

      if (gamePlayerLimit && alreadyRegisteredUsers > gamePlayerLimit) return this.addError('RegisteredUserExceedErrorType')

      if (tournamentImg) {
        if (tournamentImg && typeof tournamentImg === 'object') {
          fileName = `${config.get('env')}/tournament/assets/${
            title || tournamentExist?.title
          }/-updatedImg-long-${Date.now()}.webp`
          fileName = fileName.split(' ').join('')
          if (tournamentExist.imageUrl) {
            const key = tournamentExist.imageUrl.split(' ').join('')
            await convertToWebPAndUpload(tournamentImg, fileName, key)
          } else {
            await convertToWebPAndUpload(tournamentImg, fileName)
          }
        }
      }

      const updateObj = {
        title: title,
        description: description,
        entryAmount: entryAmountUpdated,
        entryCoin: entryCoin,
        startDate: gameStartDate,
        endDate: gameEndDate,
        gameId: masterCasinoGameIds,
        winGc: winGcUpdated,
        winSc: winScUpdated,
        playerLimit: gamePlayerLimit,
        vipTournament: vipTournament,
        allowedUsers: allowedUsersArray,
        // isActive: isActive,
        winnerPercentage: winnerPercentageArray,
        imageUrl: fileName,
        gameBetWinStats: gameBetWinStatsUpdated,
        moreDetails: moreDetails,
        isSubscriberOnly: isSubscriberOnly
      }
      await TournamentModel.update(updateObj, {
        where: { tournamentId },
        transaction
      })

      if (masterCasinoGameIds && +tournamentExist.status === TOURNAMENT_STATUS.RUNNING) { await refreshMaterializedView(transaction) }

      triggerTournamentUpdateNotification(
        updateObj.title || tournamentExist.title,
        updateObj.entryAmount || tournamentExist.entryAmount,
        updateObj.winGc || tournamentExist.winGc,
        updateObj.winSc || tournamentExist.winSc,
        updateObj.startDate || tournamentExist.startDate,
        updateObj.endDate || tournamentExist.endDate,
        null,
        fileName || tournamentExist.imageUrl
      )

      tournamentJobScheduler('PUT', +tournamentExist.tournamentId)

      return {
        success: true,
        message: SUCCESS_MSG.UPDATE_SUCCESS,
        data: { tournamentId: +tournamentExist?.tournamentId }
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
