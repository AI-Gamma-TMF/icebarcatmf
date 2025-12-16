'use strict'

module.exports = (sequelize, DataTypes) => {
  const ProviderRate = sequelize.define(
    'ProviderRate',
    {
      rateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      aggregatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ggrMinimum: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ggrMaximum: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'provider_rate',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  )

  ProviderRate.associate = function (models) {
    ProviderRate.belongsTo(models.MasterCasinoProvider, {
      foreignKey: 'providerId',
      targetKey: 'masterCasinoProviderId'
    })
  }

  return ProviderRate
}
