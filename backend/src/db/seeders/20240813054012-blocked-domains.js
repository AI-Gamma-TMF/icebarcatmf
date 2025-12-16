module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('blocked_domains', [
      {
        domain_name: 'mailinator.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'yopmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'dispostable.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'fakeinbox.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: '10minutemail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'guerrillamail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'throwawaymail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'maildrop.cc',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'mytemp.email',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'temp-mail.org',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'tempmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'tempmailo.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'getnada.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'mohmal.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'minutemailbox.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'emailondeck.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'burnermail.io',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'spamgourmet.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: '10mail.org',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'mailnesia.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'trashmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'inboxbear.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'mail7.io',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'sharklasers.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'fakemail.net',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'tutanota.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'protonmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'tempail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'mailcatch.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'trashmail.net',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'trashmail.me',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'armyspy.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'rhyta.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'jourrapide.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'easytrashmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'fakeinbox.net',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'emailtemp.org',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'privaterelay.appleid.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'moakt.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'harakirimail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'airmail.cc',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'mailforspam.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'tempemail.co',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'spammotel.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'anonbox.net',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: '24hourmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'instantemailaddress.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'klikmail.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        domain_name: 'lroid.com',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('blocked_domains', null, {})
  }
}
