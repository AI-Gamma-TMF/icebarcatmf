'use strict'

module.exports = (sequelize, DataTypes) => {
  const ScratchCardConfiguration = sequelize.define(
    'ScratchCardConfiguration',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      scratchCardId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      minReward: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      maxReward: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      rewardType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['SC', 'GC']]
        }
      },
      playerLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      percentage: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'scratch_card_configuration',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  ScratchCardConfiguration.associate = function (models) {
    ScratchCardConfiguration.belongsTo(models.ScratchCards, {
      foreignKey: 'scratchCardId',
      targetKey: 'scratchCardId',
      as: 'scratchCards'
    })
  }

  return ScratchCardConfiguration
}
