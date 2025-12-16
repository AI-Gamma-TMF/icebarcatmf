'use strict'
module.exports = (sequelize, DataTypes) => {
  const promotionThumbnails = sequelize.define('promotionThumbnails', {
    promotionThumbnailId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desktopImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobileImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    navigateRoute: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'promotion_thumbnails',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  promotionThumbnails.associate = function (models) {
    // associations can be defined here
  }
  return promotionThumbnails
}
