'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    try {
      await queryInterface.sequelize.query(`
        UPDATE master_casino_games
        SET has_freespins = true
        WHERE master_casino_provider_id = 
          (SELECT master_casino_provider_id FROM master_casino_providers where name = 'MANCALA')
        AND REPLACE(identifier, 'MANCALA-', '') IN 
        ('75001', '74001', '58002', '70001', '71001', '41006', '73001', '69001', '72001', '65001', '68001', '64001', '67001', 
        '38002', '53002', '61001', '31003', '63001', '62001', '60001', '59001', '42003', '58001', '57001', '56001', '35004', 
        '54001', '29005', '49001', '52001', '41003', '48001', '47001', '42002', '46001', '45001', '41002', '44001', '43001', 
        '41001', '29004', '42001', '39001', '38001', '31002', '35001', '27002', '22002', '34001', '33001', '31001', '30001', 
        '27001', '29001', '26001', '24001', '23001', '21001', '20001', '18001', '16001');
  
        UPDATE master_casino_providers
        SET free_spin_allowed = true
        WHERE name = 'MANCALA';
      `)
    } catch (error) {
      console.log(error)
      console.log('------------------PLEASE RERUN THIS AFTER DEPLOYMENT IS COMPLETE------------------------')
    }
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query('')
  }
}
