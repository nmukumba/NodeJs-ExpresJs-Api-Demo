const express = require('express');
const bodyParser = require('body-parser');
const UssdMenu = require('ussd-menu-builder');
const bcrypt = require('bcryptjs');

//utils
const sequelize = require('./utils/database');

const app = express();

app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});