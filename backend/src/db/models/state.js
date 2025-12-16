'use strict'

module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    stateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stateCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'state',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  return State
}
