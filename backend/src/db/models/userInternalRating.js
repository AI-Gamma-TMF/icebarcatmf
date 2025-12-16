'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserInternalRating = sequelize.define(
    'UserInternalRating',
    {
      userInternalRatingId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER, // 0-5
        allowNull: true
      },
      score: {
        type: DataTypes.DOUBLE(10, 2), // 0-5
        allowNull: true,
        defaultValue: 0.0
      },
      vipStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      managedBy: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      vipApprovedDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      vipRevokedDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      managedByAssignmentDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'user_internal_rating',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  UserInternalRating.associate = function (model) {
    UserInternalRating.belongsTo(model.User, {
      foreignKey: 'userId',
      constraints: false
    })
    UserInternalRating.hasMany(model.VipManagerAssignment, {
      foreignKey: 'userId'
    })
    UserInternalRating.belongsTo(model.AdminUser, {
      foreignKey: 'managedBy'
    })
  }

  return UserInternalRating
}
