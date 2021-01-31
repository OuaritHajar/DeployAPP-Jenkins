
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
            
            models.User.belongsToMany(models.Post, {
                through: models.Image,
                foreignKey: 'userId',
                otherKey: 'postId'
            });

            models.Post.belongsToMany(models.User, {
                through: models.Image,
                foreignKey: 'postId',
                otherKey: 'userId'
            });

            models.Image.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });

            models.Image.belongsTo(models.Post, {
                foreignKey: 'postId',
                as: 'post'
            });
        }

    };
    Image.init({
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        data: DataTypes.BLOB("long"),

        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Post',
                key: 'id'
            }
        }
    },
    
    {
        sequelize,
        modelName: 'Image',
    });
    return Image;
};

