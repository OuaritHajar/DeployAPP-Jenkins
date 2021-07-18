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

      Post.belongsTo(models.User, {
        foreignKey:{
          allowNull: false,
          onDelete: 'cascade'
        }
      })
      
      Post.hasMany(models.Comment)
      Post.hasMany(models.Like)
      Post.hasMany(models.Image)

    }
  };
  Post.init({
    title: DataTypes.STRING,
    img_url: DataTypes.STRING,
    description: DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};