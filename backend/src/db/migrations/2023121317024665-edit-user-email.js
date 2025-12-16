'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch users with NULL email addresses
    const usersWithNullEmails = await queryInterface.sequelize.query(
      'SELECT user_id FROM users WHERE email IS NULL'
    )

    const updateQueries = usersWithNullEmails[0].map((user, index) => {
      const defaultEmail = `default+${index + 1}@example.com`
      return queryInterface.sequelize.query(
        `UPDATE users SET email = '${defaultEmail}' WHERE user_id = '${user.user_id}'`
      )
    })

    await Promise.all(updateQueries)

    // Change the column definition to disallow NULL values
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Change the column definition to allow NULL values
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
