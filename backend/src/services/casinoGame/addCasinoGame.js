import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteSubCategoryKeys, refreshMaterializedView, uploadFile } from '../../utils/common'
export class AddCasinoGameService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GameSubCategory: GameSubCategoryModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameSubCategory: MasterGameSubCategoryModel
      },
      req: { file: gameThumbnail },
      sequelizeTransaction: transaction
    } = this.context

    const {
      masterGameSubCategoryId,
      gameName,
      providerId,
      identifier,
      returnToPlayer,
      isActive
    } = this.args

    try {
      let fileName
      const isProviderExist = await MasterCasinoProviderModel.findOne({
        where: { masterCasinoProviderId: +providerId },
        attributes: ['name'],
        transaction
      })

      const ifGameExist = await MasterCasinoGameModel.findOne({
        where: {
          identifier,
          masterCasinoProviderId: +providerId
        },
        transaction
      })

      if (ifGameExist) return this.addError('GameAlreadyExistErrorType')

      if (!isProviderExist) return this.addError('CasinoProviderNotFoundErrorType')

      if (gameThumbnail) {
        if (gameThumbnail && typeof gameThumbnail === 'object') {
          fileName = `${config.get('env')}/games/assets/${
            isProviderExist.name
          }/${identifier}-long-${Date.now()}.${
            gameThumbnail.originalname.split('.')[1]
          }`

          await uploadFile(gameThumbnail, fileName)
        }
      }

      const newGame = await MasterCasinoGameModel.create(
        {
          name: gameName,
          identifier: identifier,
          masterCasinoProviderId: +providerId,
          isDemoSupported: true,
          returnToPlayer: returnToPlayer,
          imageUrl: fileName,
          isActive
        },
        { transaction }
      )

      if (masterGameSubCategoryId) {
        const isGameSubCategoryExist = await MasterGameSubCategoryModel.findOne(
          {
            where: { masterGameSubCategoryId: +masterGameSubCategoryId },
            transaction
          }
        )

        if (!isGameSubCategoryExist) return this.addError('GameSubCategoryNotExistsErrorType')

        await GameSubCategoryModel.create(
          {
            masterCasinoGameId: +newGame.masterCasinoGameId,
            masterGameSubCategoryId: +masterGameSubCategoryId
          },
          { transaction }
        )
      }

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
