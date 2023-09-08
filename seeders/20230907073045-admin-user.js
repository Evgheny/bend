'use strict';

const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('1234', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Admin',
          email: 'admin@admin.com',
          type: 'admin',
          passwordHash: hashedPassword,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
