'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'image', {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'location', {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'phone', {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'google_map', {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'rating', {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'description', {
      allowNull: true,
      type: Sequelize.STRING
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'image', {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'location', {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'phone', {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'google_map', {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'rating', {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Restaurants', 'description', {
      allowNull: false,
      type: Sequelize.STRING
    });
  }
};