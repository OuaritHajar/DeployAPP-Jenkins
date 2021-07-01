
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            
            //models.Image.belongsTo(models.Post, {
            //    foreignKey: 'postId',
            //    as: 'post'
            //});

            models.Image.belongsTo(models.User, {
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

