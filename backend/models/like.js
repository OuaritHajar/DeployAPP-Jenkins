'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            Like.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });
            //
            Like.belongsTo(models.Post, {
                foreignKey: {
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });
        }
    };
    Like.init({}, {
        sequelize,
        modelName: 'Like',
    });

    return Like;
};