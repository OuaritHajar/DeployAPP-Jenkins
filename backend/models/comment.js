'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          onDelete: 'cascade'
        }
      });

      Comment.belongsTo(models.Post, {
        foreignKey:{
          allowNull:false,
          onDelete: 'cascade'
        }
      });
    }
  };
  Comment.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comment',
  });


  //Comment.beforeDestroy(async comment => {
  //  const post = await comment.getPost()
  //  await post.update({
  //    comments: post.comments - 1
  //  })
  //})

  return Comment;
};