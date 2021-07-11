'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      User.hasMany(models.Post, {onDelete: 'CASCADE', hooks:true})
      User.hasMany(models.Comment, {onDelete: 'CASCADE', hooks:true}),
      User.hasMany(models.Like,{onDelete: 'CASCADE', hooks:true}),
      User.hasMany(models.Image)
    }
  };
  User.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
    // Sequelize option
    {
      sequelize,
      modelName: 'User'
    });
  console.log(User === sequelize.models.User);
  return User;
};
