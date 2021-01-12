const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//utils
const sequelize = require('./utils/database');

//models
const User = require('./models/user');
const Task = require('./models/task');

//routes
const authRoutes = require('./routes/auth');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
        .json({
            error: {
                message: error.message
            }
        })
});

User.hasMany(Task);
Task.belongsTo(User);

sequelize.sync()
    // .sync({
    //     force: true
    // })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
