const bcrypt = require('bcryptjs');

const UserAccount = require('../models/user-account');

exports.isRegistered = (phoneNumber, menu) => {
    UserAccount.findOne({
        where: {
            phoneNumber: phoneNumber
        }
    }).then(user => {
        if (!user) {
            return menu.go('showRegistration');
        } else {
            return menu.go('showLogin');
        }
    }).catch(err => console.log(err));
};

exports.login = (phoneNumber, pin, menu) => {

    let logedInUser;

    UserAccount.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        }).then(user => {
            logedInUser = user;

            if (!user) {
                return menu.end('This number is not registered on this platform. Please register to continue.');
            }
            bcrypt.compare(pin, user.pin)
                .then(doMatch => {
                    if (doMatch) {
                        // if(logedInU)
                        return menu.con('Welcome. Choose option:' +
                            '\n1. Send Money' +
                            '\n2. Pay Merchant' +
                            '\n3. Cash Out' +
                            '\n4. Buy Airtime' +
                            '\n5. Pay Bill' +
                            '\n6. Account');
                    }
                    return menu.end('Incorrect pin.');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};