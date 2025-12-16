'use strict'

const { default: axios } = require('axios')
const { default: config } = require('../../configs/app.config')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Register event for scheduled Campaigns
    const scheduledCampaignsOptions = {
      url: `${config.get('optimove.base_url')}/General/RegisterEventListener`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      },
      data: JSON.stringify({
        EventTypeID: 13,
        ListenerURL: `${config.get('adminBeUrl')}/api/v1/crm-promotion/scheduled-webhook`,
        ChannelID: 504
      })
    }
    // Register event for Triggered Campaigns
    const triggeredCampaignsOptions = {
      url: `${config.get('optimove.base_url')}/General/RegisterEventListener`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': config.get('optimove.secret_key')
      },
      data: JSON.stringify({
        EventTypeID: 11,
        ListenerURL: `${config.get('adminBeUrl')}/api/v1/crm-promotion/triggered-webhook`,
        ChannelID: 15
      })
    }

    await Promise.allSettled([
      axios(scheduledCampaignsOptions),
      axios(triggeredCampaignsOptions)
    ])
  },

  down: async (queryInterface, Sequelize) => {
  }
}
