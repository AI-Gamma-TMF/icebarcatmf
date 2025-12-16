'use strict';

module.exports = (sequelize, DataTypes) => {
  const BlockedUsers = sequelize.define('BlockedUsers', {
    userId: {
      autoIncrement: false,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    isAvailPromocodeBlocked: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
    {
      sequelize,
      tableName: 'blocked_users',
      schema: 'public',
      timestamps: true,
      updatedAt: false,
      underscored: true

    })

  BlockedUsers.associate = function (model) {
    BlockedUsers.belongsTo(model.User, {
      foreignKey: 'userId',
      as:'user'
    })
  }

  return BlockedUsers
}
