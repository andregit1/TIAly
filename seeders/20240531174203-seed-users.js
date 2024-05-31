'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123123123', 10);
    const roles = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name='admin';`
    );

    const adminRoleId = roles[0][0].id;
    await queryInterface.bulkInsert('users', [{
      username: 'root',
      password: hashedPassword,
      roleId: adminRoleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
