'use strict'
module.exports = function (sequelize, DataTypes) {
  const TemplateCategory = sequelize.define('TemplateCategory', {
    templateCategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'template_category',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  TemplateCategory.associate = function (model) {
    TemplateCategory.hasMany(model.EmailTemplate, { as: 'emailTemplate', foreignKey: 'templateEmailCategoryId', onDelete: 'cascade' })
  }
  return TemplateCategory
}
