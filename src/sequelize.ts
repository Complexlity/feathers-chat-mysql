const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize("feathers", "root", "complex224", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

sequelize.authenticate().then(() => console.log("I connected"))

export {sequelize}
