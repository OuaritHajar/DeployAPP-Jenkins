'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      models.Post.hasMany(models.Comment),



      models.Post.belongsTo(models.User, {
        foreignKey:{
          allowNull:false
        }
      })
    }
  };
  Post.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    img_url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};