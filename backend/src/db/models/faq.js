'use strict'

module.exports = function (sequelize, DataTypes) {
  const Faq = sequelize.define(
    'Faq',
    {
      faqId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      blogPostId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'faq',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  Faq.associate = function (models) {
    Faq.belongsTo(models.BlogPost, {
      foreignKey: 'blogPostId', onDelete: 'cascade'
    })
  }

  return Faq
}
