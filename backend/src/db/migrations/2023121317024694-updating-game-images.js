'use strict'
import db, { sequelize } from '../models'
import { THUMBNAIL_TYPE } from '../../utils/constants/constant'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      MasterCasinoGame: MasterCasinoGameModel,
      MasterCasinoGamesThumbnail: MasterCasinoGamesThumbnailModel
    } = db

    const transaction = await sequelize.transaction()
    try {
      const thumbnails = await MasterCasinoGamesThumbnailModel.findAll({
        where: {
          thumbnailType: THUMBNAIL_TYPE.LONG
        },
        raw: true,
        transaction
      })

      await Promise.all(thumbnails.map(async thumbnail => {
        return await MasterCasinoGameModel.update({ imageUrl: thumbnail?.thumbnail }, { where: { masterCasinoGameId: thumbnail.masterCasinoGameId }, transaction })
      }))

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
