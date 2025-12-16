module.exports = function (sequelize, DataTypes) {
  const WhalePlayers = sequelize.define('WhalePlayers', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    totalPurchaseAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'total_purchase_amount'
    },
    purchaseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'purchase_count'
    },
    totalRedemptionAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'total_redemption_amount'
    },
    redemptionCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'redemption_count'
    },
    adminBonus: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'admin_bonus'
    },
    siteBonusDeposit: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'site_bonus_deposit'
    },
    siteBonus: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'site_bonus'
    },
    totalPendingRedemptionAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'total_pending_redemption_amount'
    },
    pendingRedemptionCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'pending_redemption_count'
    },
    cancelledRedemptionCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'cancelled_redemption_count'
    },
    totalScBetAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'total_sc_bet_amount'
    },
    totalScWinAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'total_sc_win_amount'
    },
    vipQuestionnaireBonusCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'vip_questionnaire_bonus_count'
    },
    vipQuestionnaireBonusAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      field: 'vip_questionnaire_bonus_amount'
    },
    managedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'whale_players',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: 'whale_players_user_id_idx',
        fields: ['user_id']
      },
      {
        name: 'whale_players_timestamp_idx',
        fields: ['timestamp']
      }
    ]
  })

  return WhalePlayers
}
