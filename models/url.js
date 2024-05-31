'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Url.hasMany(models.UrlAccessLog, { foreignKey: 'urlId' });
    }
  }
  Url.init({
    slug: DataTypes.STRING,
    originalUrl: DataTypes.TEXT,
    clickCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Url',
    tableName: 'urls'
  });
  return Url;
};