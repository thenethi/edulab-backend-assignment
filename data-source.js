// src/data-source.js

require("dotenv").config();
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "sqlite", // You can change this to any other database type like 'postgres', 'mysql', etc.
  database: "./tasks.db", // Path to your SQLite database file
  synchronize: true, // Automatically synchronize the database with your entities
  logging: false, // Enable logging for development
  entities: [
    require("./entity/User"),
    require("./entity/Role"),
    require("./entity/Task"),
  ], // Add all your entities here
});

module.exports = AppDataSource;
