'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UrlAccessLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UrlAccessLog.init({
    urlId: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UrlAccessLog',
    tableName: 'url_access_logs'
  });
  return UrlAccessLog;
};