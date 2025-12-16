'use strict'
module.exports = function (sequelize, DataTypes) {
  const GameSubCategory = sequelize.define('GameSubCategory', {
    gameSubcategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    masterCasinoGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    masterGameSubCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'game_subcategory',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  GameSubCategory.associate = function (model) {
    GameSubCategory.belongsTo(model.MasterCasinoGame, {
      foreignKey: 'masterCasinoGameId'
    })
    GameSubCategory.belongsTo(model.MasterGameSubCategory, {
      foreignKey: 'masterGameSubCategoryId'
    })
  }
  return GameSubCategory
}
