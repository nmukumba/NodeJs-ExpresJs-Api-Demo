const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Task = sequelize.define('task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Task;
