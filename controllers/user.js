const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            console.log('already registered')
        }

        bcrypt.hash(req.body.password, 10)
            .then(hashPassword => {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashPassword
                })
                    .then(createdUser => {
                        console.log(createdUser);
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            })
            .catch(err => console.log(err)
            )
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.login = (req, res, next) => {

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {

        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user.password)
            .then(doMatch => {
                const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });

            })
            .catch(err => {
                res.status(401).json({
                    message: "Auth failed"
                });
            });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
