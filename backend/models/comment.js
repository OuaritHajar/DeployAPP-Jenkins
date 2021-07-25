'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {

            Comment.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });

            Comment.belongsTo(models.Post, {
                foreignKey: {
                    allowNull: false,
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

    return Comment;
};