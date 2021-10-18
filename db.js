const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:cd94b5cfce0844f3a6b941fb63f8c6ce@localhost:5432/WorkoutLog');

module.exports = sequelize;