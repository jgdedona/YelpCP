const express = require('express');
const wrapAsync = require('../utilities/wrapAsync');
const { validateUser } = require('../middleware');
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');

const router = express.Router();

router.route('/register')
    .get(users.renderRegistrationForm)
    .post(validateUser, wrapAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;