const express = require('express');
const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user');
const router = express.Router();

router.get("/", checkAuth, userController.login);
