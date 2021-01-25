const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('mysql::memory:');

class User extends Model {}

User.init({
  // Model attributes are defined here
  //id: {
  //  type: DataTypes.INTEGER,
  //  autoIncrement: true,
  //  primaryKey: true,
  //  allowNull: false
  //},

  first_Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false
  },
  password:{
      type:  DataTypes.STRING,
      allowNull: false
  }
},{
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

// the defined model is the class itself
console.log(User === sequelize.models.User); // true










//'use strict';
//const { Model } = require('sequelize');
//
//module.exports = (sequelize, DataTypes) => {
//  class User extends Model {
//    /**
//     * Helper method for defining associations.
//     * This method is not a part of Sequelize lifecycle.
//     * The `models/index` file will call this method automatically.
//     */
//    static associate(models) {
//      models.User.hasMany(models.Post),
//      models.User.hasMany(models.Comment),
//      models.User.hasMany(models.Like)
//    }
//  };
//  User.init({
//    first_name: {
//      type: DataTypes.STRING,
//      allowNull: false
//    },
//    last_name:{
//      type:DataTypes.STRING,
//      allowNull: false
//    },
//    email: {
//      type: DataTypes.STRING,
//      allowNull: false
//    },
//    password:{
//      type:  DataTypes.STRING,
//      allowNull: false
//    }
//  },
//  // Sequelize option
//  {
//    sequelize,
//    modelName: 'users'
//  });
//  console.log(User === sequelize.models.User);
//  return User;
//};



