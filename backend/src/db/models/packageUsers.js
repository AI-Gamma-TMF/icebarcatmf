'use strict'
module.exports = (sequelize, DataTypes) => {
  const PackageUsers = sequelize.define('PackageUsers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'package_users',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  PackageUsers.associate = function (models) {
    PackageUsers.belongsTo(models.User, { foreignKey: 'userId' })
    PackageUsers.belongsTo(models.Package, { foreignKey: 'packageId' })
  }
  return PackageUsers
}
