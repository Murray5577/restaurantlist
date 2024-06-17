'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'name_en', {
      allowNull: true,
      type: Sequelize.STRING
    });
      
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'name_en', {
      allowNull: false,
      type: Sequelize.STRING
    });
  }
};