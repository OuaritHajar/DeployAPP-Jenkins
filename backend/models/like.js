'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //models.User.belongsToMany(models.Post, {
      //  through: models.Like,
      //  foreignKey: 'userId',
      //  otherKey: 'postId',
      //});
////
      //models.Post.belongsToMany(models.User, {
      //  through: models.Like,
      //  foreignKey: 'postId',
      //  otherKey: 'userId',
      //});
//
        Like.belongsTo(models.User, {
          foreignKey:{
            allowNull:false,
            onDelete: 'cascade'
          }
        });
      //
        Like.belongsTo(models.Post, {
          foreignKey:{
            allowNull:false,
            onDelete: 'cascade'
          }
        });
    
      
    }
  };
  Like.init({
    //postId: {
    //  type: DataTypes.INTEGER,
    //  references: {
    //    model:'Post',
    //    key:'id'
    //  }
    //},
    //
    //userId: {
    //  type: DataTypes.INTEGER,
    //  references: {
    //    model:'User',
    //    key:'id'
    //  }
    //}

  }, {
    sequelize,
    modelName: 'Like',
  });


  //Like.afterCreate(async like => {
  //  const post = await like.getPost()
  //  await post.update({
  //    likes: post.likes + 1
  //  })
  //})

  //Like.afterDestroy(async like => {
  //  const post = await like.getPost()
  //  await post.update({
  //    likes: post.likes - 1
  //  })
  //})



  return Like;
};