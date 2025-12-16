'use strict'
import {
  ROLE,
  SIGN_IN_METHOD,
  STATUS_VALUE
} from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      userId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      uniqueId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: true
      },
      signInCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      signInIp: {
        type: DataTypes.INET,
        allowNull: true
      },
      signInMethod: {
        type: DataTypes.ENUM(Object.values(SIGN_IN_METHOD)),
        allowNull: false,
        comment: 'normal:0, google:1, facebook:2'
      },
      parentType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      countryCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      selfExclusion: {
        type: DataTypes.DATE,
        allowNull: true
      },
      selfExclusionUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      disabledAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      disabledByType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disabledById: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      disableReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      mfaType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      newPasswordKey: {
        type: DataTypes.STRING,
        allowNull: true
      },
      newPasswordRequested: {
        type: DataTypes.DATE,
        allowNull: true
      },
      emailToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      zipCode: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      affiliateId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      kycStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: STATUS_VALUE.PENDING
      },
      sumsubKycStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'sumsub_kyc_status'
      },
      kycApplicantId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      loyaltyPoints: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      loggedIn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      deviceType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine_2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tags: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      affiliateStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      trackingToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      isAffiliateUpdated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      state: {
        type: DataTypes.STRING
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      fbUserId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otpVerifiedDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isBan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isRestrict: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      passwordAttempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isInternalUser: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isScTournamentTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isGcTournamentTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          isRedemptionSubscribed: false,
          isSubscribed: false,
          lexisNexisComprehensiveIndex: 0,
          verified: false
        }
      },
      paysafeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'paysafe_customer_id'
      },
      trustlyCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'trustly_customer_id'
      },
      referredBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'referred_by'
      },
      affiliateCode: {
        type: DataTypes.UUID,
        allowNull: true
      },
      authSecret: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authEnable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      emailMarketing: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      smsMarketing: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      reasonId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isClearWallet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      identityVerification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isPaymentAction: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      nonPurchasePackageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'NonPurchasePackages',
          key: 'non_purchase_package_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      isUserDynamoLinked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      d10xLinkId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
      },
      isJackpotTermsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isJackpotOptedIn: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      jackpotMultiplier: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      subscriptionStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  User.associate = function (model) {
    User.hasMany(model.UserDocument, {
      as: 'userDocuments',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PackageUsers, {
      as: 'packageUsers',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.ResponsibleGambling, {
      as: 'responsibleGambling',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasOne(model.Wallet, {
      foreignKey: 'ownerId',
      as: 'userWallet',
      constraints: false,
      scope: {
        owner_type: ROLE.USER
      },
      onDelete: 'cascade'
    })
    User.hasOne(model.Limit, {
      foreignKey: 'userId',
      as: 'userLimit',
      constraints: false,
      onDelete: 'cascade'
    })
    User.hasMany(model.TransactionBanking, {
      foreignKey: 'actioneeId',
      as: 'transactionBanking',
      constraints: false,
      scope: {
        actioneeType: ROLE.USER
      }
    })
    User.hasMany(model.FavoriteGame, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.UserBonus, {
      as: 'userBonus',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.UserDocument, {
      as: 'userDocument',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.CasinoTransaction, {
      as: 'casinoTransactions',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.ActivityLog, {
      foreignKey: 'actioneeId',
      sourceKey: 'userId',
      scope: {
        actioneeType: ROLE.USER
      }
    })
    User.hasMany(model.UserActivities, {
      as: 'userActivity',
      foreignKey: 'userId'
    })
    User.hasMany(model.PersonalBonus, {
      as: 'personalBonus',
      foreignKey: 'createdBy',
      sourceKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.PersonalBonus, {
      foreignKey: 'claimedBy',
      sourceKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasOne(model.UserTier, {
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.hasMany(model.RafflesEntry, {
      as: 'RafflesEntry',
      foreignKey: 'userId',
      onDelete: 'cascade'
    })
    User.belongsTo(model.BanUserSetting, {
      as: 'banReason',
      foreignKey: 'reasonId' // reasonId in User pointing to BanUserSetting
    })
    User.hasOne(model.UserReports, {
      foreignKey: 'userId',
      as: 'UserReport',
      onDelete: 'cascade'
    })
    User.hasOne(model.BlockedUsers, {
      foreignKey: 'userId',
      as: 'blockedUsers'
    })
    User.belongsTo(model.NonPurchasePackages, {
      foreignKey: 'nonPurchasePackageId'
    })
    User.hasOne(model.UserInternalRating, {
      foreignKey: 'userId',
      constraints: false,
      onDelete: 'cascade'
    })
    User.hasMany(model.UserQuestionnaireAnswer, { foreignKey: 'userId' })
    User.hasOne(model.UserGameStats, {
      foreignKey: 'userId',
      constraints: false
    })
    User.hasMany(model.UserSubscription, {
      foreignKey: 'userId',
      as: 'Subscription',
      onDelete: 'cascade'
    })
    User.hasMany(model.VipManagerAssignment, { foreignKey: 'userId' })
  }

  return User
}
