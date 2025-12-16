'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.bulkInsert('questionnaire', [
      { question: 'What is your preferred promotion? (Lossback, Match Bonus, Promo Sweep Coins, Bet and Get)', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite casino game?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your profession?', created_at: new Date(), updated_at: new Date() },
      { question: 'Are you currently a VIP at any other platforms? If yes, what is your tier and what platform?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your preferred method of communication (call, text, email)?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your preferred hospitality event (sports games, concerts, trips, etc.)?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite sport?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite sports league?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite sports team?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite restaurant?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite type of food?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is on your bucket list for 2025?', created_at: new Date(), updated_at: new Date() },
      { question: 'Who is your favorite artist/celebrity?', created_at: new Date(), updated_at: new Date() },
      { question: 'What is your favorite clothing brand?', created_at: new Date(), updated_at: new Date() }
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.bulkDelete('questionnaire', null, {})
  }
}
