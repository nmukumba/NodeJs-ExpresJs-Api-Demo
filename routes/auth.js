const express = require('express');
const bcrypt = require('bcryptjs');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');
const userController = require('../controllers/user');
const router = express.Router();

router.post('/login',
    [
        body('email').normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5})
    ],
    userController.login
);

router.post('/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                return User.findAll({
                    limit: 1,
                    where: {
                        email: value
                    }
                }).then(users => {
                    if (users.length > 0) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    userController.register
);

router.get('/users', isAuth, userController.getUsers);

router.get('/users/:userId', isAuth, userController.getUser);

router.put('/users/:userId',
    isAuth,
    userController.updateUser);

router.put('/users/password/:userId', [
    body('password')
        .custom((value, {req}) => {
            return User.findByPk(req.params.userId).then(user => {
                if (user) {
                    return bcrypt.compare(req.body.password, user.password).then(res => {
                        //throw new Error('Incorrect current password!');
                        console.log(res);
                        if (!res) {
                            return Promise.reject('Incorrect current password!');
                        }
                        return true;
                    })
                }
            });
        }),
    body('newPassword')
        .trim()
        .not()
        .isEmpty()
], isAuth, userController.updatePassword);

module.exports = router;
