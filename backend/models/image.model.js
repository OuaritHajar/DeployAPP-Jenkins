
'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        models.Post.belongsToMany(models.User, {
          through: models.Image
        });
  
        models.User.belongsToMany(models.Post, {
          through: models.Image
        });
  
        models.Image.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
  
        models.Image.belongsTo(models.Post, {
          foreignKey: {
            allowNull: false
          }
        });
      }
  
    };
    Image.init({
      type: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.BLOB("long"),
      }
    }, {
      sequelize,
      modelName: 'Image',
    });
    return Image;
  };
  
  