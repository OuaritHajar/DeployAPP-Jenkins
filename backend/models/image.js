
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate(models) {
            Image.belongsTo(models.User, {
                foreignKey: {
                  allowNull: false
                }
            });
            Image.belongsTo(models.Post, {
                foreignKey: {
                  allowNull: false
                }
            });
        }
    };
    Image.init({
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        data: DataTypes.BLOB('long'),
        url: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Image',
    });
    return Image;
};

