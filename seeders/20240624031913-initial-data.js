'use strict';

const bcrypt = require('bcryptjs')
const initialData = require('../public/jsons/restaurant.json').results

initialData.forEach((data) => {
  if (data.id < 5) data.userId = 1
  else data.userId = 2

  data.createdAt = new Date()
  data.updatedAt = new Date()
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash('12345678', salt)
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          name: 'user1',
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          id: 2,
          name: 'user2',
          email: 'user2@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })


      /*let seedData = initialData.map((data) => {
        if (data.id < 5) {
          ({
            name: data.name,
            name_en: data.name_en,
            category: data.category,
            image: data.image,
            location: data.location,
            phone: data.phone,
            google_map: data.google_map,
            rating: data.rating,
            description: data.description,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        } else {
          ({
            name: data.name,
            name_en: data.name_en,
            category: data.category,
            image: data.image,
            location: data.location,
            phone: data.phone,
            google_map: data.google_map,
            rating: data.rating,
            description: data.description,
            userId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      )*/

      await queryInterface.bulkInsert('Restaurants', initialData, { transaction })


      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
      console.error('Seeding error:', error)
      throw error
    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};