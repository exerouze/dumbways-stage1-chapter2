"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  projects.init(
    {
      name_project: DataTypes.STRING,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      interval: DataTypes.STRING,
      desc_project: DataTypes.STRING,
      tech: Sequelize.ARRAY(Sequelize.STRING),
      image: DataTypes.STRING,
      author: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "projects",
    }
  );
  return projects;
};
