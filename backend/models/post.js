'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {

            Post.belongsTo(models.User, {
                foreignKey: {
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