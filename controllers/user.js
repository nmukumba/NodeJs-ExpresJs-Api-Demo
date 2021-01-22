const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');
const jwt = require("jsonwebtoken");
const User = require('../models/user');

exports.register = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        bcrypt.hash(password, 10)
            .then(hashPassword => {
                User.create({
                    name: name,
                    email: email,
                    password: hashPassword
                })
                    .then(createdUser => {
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
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    }).catch(err => {
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
console.log(user)
        if (!user) {
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
                        expiresIn: "4h"
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

exports.getUsers = (req, res, next) => {
    User.findAll().then(users => {
        res.status(200).json({
            message: 'Fetched users successfully.',
            data: users
        });
    })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.getUser = (req, res, next) => {
    User.findByPk(req.params.userId)
        .then(user => {
            res.status(200).json({
                message: 'Fetched user successfully.',
                data: user
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.updateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const userId = req.params.userId;

    User.findByPk(userId)
        .then(user => {
            if (!user) {
                const error = new Error('Could not find user.');
                error.statusCode = 404;
                throw error;
            }

            User.update({name: name, email: email}, {where: {id: userId}})
                .then(user => {
                    res.status(201).json({
                        message: "User updated"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.updatePassword = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const newPassword = req.body.newPassword;
    const userId = req.params.userId;
    bcrypt.hash(newPassword, 10)
        .then(hashPassword => {
            User.update({
                    password: hashPassword
                },
                {
                    where: {
                        id: userId
                    }
                })
                .then(updatedPassword => {
                    res.status(201).json({
                        message: "Password updated"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}
