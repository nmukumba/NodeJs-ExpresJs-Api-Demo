const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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
//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization”)');
//     next();
// });
app.use(cors());

app.use('/api/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
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
