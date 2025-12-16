'use strict'

module.exports = (sequelize, DataTypes) => {
  const MasterGameSubCategory = sequelize.define('MasterGameSubCategory', {
    masterGameSubCategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    thumbnailType: {
      type: DataTypes.STRING,
      allowNull: 'short'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'master_game_sub_categories',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  MasterGameSubCategory.associate = function (model) {
    MasterGameSubCategory.hasMany(model.MasterCasinoGame, {
      foreignKey: 'masterGameSubCategoryId'
    })
  }

  return MasterGameSubCategory
}
