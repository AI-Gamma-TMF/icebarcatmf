'use strict'

module.exports = (sequelize, DataTypes) => {
  const BlockedDomains = sequelize.define('BlockedDomains', {
    domainId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    domainName: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'blocked_domains',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return BlockedDomains
}
