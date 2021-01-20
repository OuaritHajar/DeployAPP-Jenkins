'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model:'Users',
          key:'id'
        }
      },

      post_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model:'Posts',
          key:'id'
        }
      },
      like_post_value: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Likes');
  }
};