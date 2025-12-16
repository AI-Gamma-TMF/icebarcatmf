'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('global_settings', [
      {
        key: 'GLOBAL_REGISTRATION',
        value: JSON.stringify({
          email: 2,
          password: 2,
          confirmPassword: 2,
          username: 2,
          firstName: 2,
          lastName: 2,
          dateOfBirth: 2,
          address: 2,
          phone: 0,
          gender: 2,
          preferredLanguage: 0,
          countryCode: 2,
          newsLetter: 0,
          currencyCode: 2,
          sms: 0
        }),
        created_at: new Date(),
        updated_at: new Date()
      }, {
        key: 'LOYALTY_LEVEL',
        value: JSON.stringify([
          {
            level: 1,
            startPoint: 0,
            endPoint: 2000,
            cashback_multiplier: 0.02
          },
          {
            level: 2,
            startPoint: 2000,
            endPoint: 4000,
            cashback_multiplier: 0.03
          },
          {
            level: 3,
            startPoint: 4000,
            endPoint: 6000,
            cashback_multiplier: 0.04
          },
          {
            level: 4,
            startPoint: 6000,
            endPoint: 8000,
            cashback_multiplier: 0.05
          },
          {
            level: 5,
            startPoint: 8000,
            endPoint: 10000,
            cashback_multiplier: 0.06
          },
          {
            level: 6,
            startPoint: 10000,
            endPoint: 12000,
            cashback_multiplier: 0.07
          },
          {
            level: 7,
            startPoint: 12000,
            endPoint: 14000,
            cashback_multiplier: 0.08
          },
          {
            level: 8,
            startPoint: 14000,
            endPoint: 16000,
            cashback_multiplier: 0.09
          },
          {
            level: 9,
            startPoint: 16000,
            endPoint: 18000,
            cashback_multiplier: 0.1
          },
          {
            level: 10,
            startPoint: 18000,
            endPoint: 20000,
            cashback_multiplier: 0.11
          },
          {
            level: 11,
            startPoint: 20000,
            endPoint: 22000,
            cashback_multiplier: 0.12
          },
          {
            level: 12,
            startPoint: 22000,
            endPoint: 24000,
            cashback_multiplier: 0.13
          },
          {
            level: 13,
            startPoint: 24000,
            endPoint: 26000,
            cashback_multiplier: 0.14
          },
          {
            level: 14,
            startPoint: 26000,
            endPoint: 28000,
            cashback_multiplier: 0.15
          },
          {
            level: 15,
            startPoint: 28000,
            endPoint: 30000,
            cashback_multiplier: 0.16
          },
          {
            level: 16,
            startPoint: 30000,
            endPoint: 32000,
            cashback_multiplier: 0.17
          },
          {
            level: 17,
            startPoint: 32000,
            endPoint: 34000,
            cashback_multiplier: 0.18
          },
          {
            level: 18,
            startPoint: 34000,
            endPoint: 36000,
            cashback_multiplier: 0.19
          },
          {
            level: 19,
            startPoint: 36000,
            endPoint: 38000,
            cashback_multiplier: 0.2
          },
          {
            level: 20,
            startPoint: 38000,
            endPoint: 40000,
            cashback_multiplier: 0.21
          },
          {
            level: 21,
            startPoint: 40000,
            endPoint: 42000,
            cashback_multiplier: 0.22
          },
          {
            level: 22,
            startPoint: 42000,
            endPoint: 44000,
            cashback_multiplier: 0.23
          },
          {
            level: 23,
            startPoint: 44000,
            endPoint: 46000,
            cashback_multiplier: 0.24
          },
          {
            level: 24,
            startPoint: 46000,
            endPoint: 48000,
            cashback_multiplier: 0.25
          },
          {
            level: 25,
            startPoint: 48000,
            endPoint: 50000,
            cashback_multiplier: 0.26
          },
          {
            level: 26,
            startPoint: 50000,
            endPoint: 52000,
            cashback_multiplier: 0.27
          },
          {
            level: 27,
            startPoint: 52000,
            endPoint: 54000,
            cashback_multiplier: 0.28
          },
          {
            level: 28,
            startPoint: 54000,
            endPoint: 56000,
            cashback_multiplier: 0.29
          },
          {
            level: 29,
            startPoint: 56000,
            endPoint: 58000,
            cashback_multiplier: 0.3
          },
          {
            level: 30,
            startPoint: 58000,
            endPoint: 60000,
            cashback_multiplier: 0.31
          },
          {
            level: 31,
            startPoint: 60000,
            endPoint: 70000,
            cashback_multiplier: 0.32
          }
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'ADMIN_GALLERY',
        value: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'SUPPORT_EMAIL_ADDRESS',
        value: 'support@gammastack-gaming.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'SENDGRID_EMAIL',
        value: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'SENDGRID_API_KEY',
        value: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'SITE_NAME',
        value: 'Gaming',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'LOGO_URL',
        value: 'http://gammastack-gaming.com/logo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'ORIGIN',
        value: 'http://gammastack-gaming.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'BANNER',
        value: JSON.stringify({
          casinoBackground: 'https://gammastack-casino.s3.amazonaws.com/development/casino_game_thumbnail/undefined-1682447358272.jpeg',
          casinoBanner: 'https://gammastack-casino.s3.amazonaws.com/development/casino_game_thumbnail/undefined-1682447358272.jpeg',
          homeBackground: 'https://gammastack-casino.s3.amazonaws.com/development/casino_game_thumbnail/undefined-1682447358272.jpeg',
          homeBanner: 'https://gammastack-casino.s3.amazonaws.com/development/casino_game_thumbnail/undefined-1682447358272.jpeg',
          promotionsBackground: 'https://gammastack-casino.s3.amazonaws.com/development/casino_game_thumbnail/undefined-1682447358272.jpeg',
          promotionsBanner: 'https://gammastack-casino.s3.amazonaws.com/development/casino_game_thumbnail/undefined-1682447358272.jpeg'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'geo:allowed:regions:sets',
        value: '{"UA": ["Kievska Oblast", "Lvivska Oblast"]}',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'geo:enabled',
        value: 'false',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'geo:allowed:crids',
        value: '["176.16.2.3/32"]',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'PACKAGE_TYPES',
        value: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('global_settings', null, {})
  }
}
