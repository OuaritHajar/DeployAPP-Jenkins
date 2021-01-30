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
      models.User.hasMany(models.Post),
      models.User.hasMany(models.Comment),
      models.User.hasMany(models.Like)
    }
  };
  User.init({
    first_name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name:{
      type:DataTypes.STRING,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin:  {
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
