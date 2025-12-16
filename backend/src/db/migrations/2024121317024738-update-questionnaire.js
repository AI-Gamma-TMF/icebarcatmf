module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('questionnaire', 'options', {
        type: Sequelize.JSONB, // Store options as array of strings or objects
        allowNull: true
      }),
      queryInterface.addColumn('questionnaire', 'question_type', {
        type: Sequelize.STRING, // 'one_liner', 'single_choice', 'multi_choice', 'tick_mark', 'sequence'
        allowNull: true
      }),
      queryInterface.addColumn('questionnaire', 'frontend_question_type', {
        type: Sequelize.STRING, // 'email', 'select', 'textarea', 'checkbox', etc
        allowNull: true
      }),
      queryInterface.addColumn('questionnaire', 'required', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }),
      queryInterface.addColumn('questionnaire', 'more_details', {
        type: Sequelize.JSONB,
        allowNull: true
      }),
      queryInterface.addColumn('questionnaire', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true
      })
    ])
    await queryInterface.removeColumn('user_questionnaire_answer', 'answer')
    await queryInterface.addColumn('user_questionnaire_answer', 'answer', {
      type: Sequelize.JSONB,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('questionnaire', 'options'),
      queryInterface.removeColumn('questionnaire', 'question_type'),
      queryInterface.removeColumn('questionnaire', 'frontend_question_type'),
      queryInterface.removeColumn('questionnaire', 'required'),
      queryInterface.removeColumn('questionnaire', 'more_details'),
      queryInterface.removeColumn('user_questionnaire_answer', 'answer'),
      queryInterface.removeColumn('questionnaire', 'deleted_at')
    ])
  }
}
