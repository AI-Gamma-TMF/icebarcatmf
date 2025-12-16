'use strict'
import db from '../../db/models'
import { getOne } from '../../utils/crud'
import cityJson from '../../scripts/city.json'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const getCountryId = await getOne({
      model: db.Country,
      data: { code: 'US' }
    })
    const data = [
      {
        name: 'Alaska',
        stateCode: 'AK',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Alabama',
        stateCode: 'AL',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Arkansas',
        stateCode: 'AS',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Arizona',
        stateCode: 'AZ',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'California',
        stateCode: 'CA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Colorado',
        stateCode: 'CO',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Connecticut',
        stateCode: 'CT',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'District of Columbia',
        stateCode: 'DC',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Delaware',
        stateCode: 'DE',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Florida',
        stateCode: 'FL',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Georgia',
        stateCode: 'GA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hawaii',
        stateCode: 'HI',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Iowa',
        stateCode: 'IA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      // {
      //   name: 'Idaho',
      //   stateCode: 'ID',
      //   countryId: getCountryId.countryId,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // },
      {
        name: 'Illinois',
        stateCode: 'IL',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Indiana',
        stateCode: 'IN',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kansas',
        stateCode: 'KS',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      // {
      //   name: 'Kentucky',
      //   stateCode: 'KY',
      //   countryId: getCountryId.countryId,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // },
      {
        name: 'Louisiana',
        stateCode: 'LA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Massachusetts',
        stateCode: 'MA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Maryland',
        stateCode: 'MD',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Maine',
        stateCode: 'ME',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Michigan',
        stateCode: 'MI',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Minnesota',
        stateCode: 'MN',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Missouri',
        stateCode: 'MO',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mississippi',
        stateCode: 'MS',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Montana',
        stateCode: 'MT',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'North Carolina',
        stateCode: 'NC',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'North Dakota',
        stateCode: 'ND',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nebraska',
        stateCode: 'NE',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New Hampshire',
        stateCode: 'NH',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New Jersey',
        stateCode: 'NJ',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'New Mexico',
        stateCode: 'NM',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      // {
      //   name: 'Nevada',
      //   stateCode: 'NV',
      //   countryId: getCountryId.countryId,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // },
      {
        name: 'New York',
        stateCode: 'NY',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ohio',
        stateCode: 'OH',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oklahoma',
        stateCode: 'OK',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oregon',
        stateCode: 'OR',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pennsylvania',
        stateCode: 'PA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Rhode Island',
        stateCode: 'PI',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'South Carolina',
        stateCode: 'SC',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'South Dakota',
        stateCode: 'SD',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Tennessee',
        stateCode: 'TN',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Texas',
        stateCode: 'TX',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Utah',
        stateCode: 'UT',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Virginia',
        stateCode: 'VA',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Vermont',
        stateCode: 'VT',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      // {
      //   name: 'Washington',
      //   stateCode: 'WA',
      //   countryId: getCountryId.countryId,
      //   created_at: new Date(),
      //   updated_at: new Date()
      // },
      {
        name: 'Wisconsin',
        stateCode: 'WI',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'West Virginia',
        stateCode: 'WV',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Wyoming',
        stateCode: 'WY',
        countryId: getCountryId.countryId,
        created_at: new Date(),
        updated_at: new Date()
      }

    ]
    await db.State.bulkCreate(data, {
      updateOnDuplicate: ['name']
    })

    const cityDataToPush = []
    for (const cityData of cityJson) {
      const getStateId = await getOne({
        model: db.State,
        data: { state_code: cityData.stateCode }
      })
      if (getStateId?.stateId) {
        cityDataToPush.push({
          stateId: getStateId?.stateId,
          name: cityData.name,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    if (cityDataToPush.length) {
      await db.City.bulkCreate(cityDataToPush, {
        updateOnDuplicate: ['name']
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('state', null, {})
    } catch (error) {
      console.log(error)
    }
  }
}
