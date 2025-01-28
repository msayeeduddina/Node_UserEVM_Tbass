const { Sequelize } = require("sequelize");
const { sequelize } = require("./config/users/users.config.js");
const usersKey1Model = require("./model/users/usersKey1.model.js");

const startConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const UsersKey = usersKey1Model(sequelize, Sequelize.DataTypes);
    await UsersKey.sync({ force: false });
    console.log("UsersKey table created successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startConnection();
