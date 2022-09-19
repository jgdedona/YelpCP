const express = require('express');
const wrapAsync = require('../utilities/wrapAsync');
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');

const router = express.Router();

router.get('/register', users.renderRegistrationForm);

router.post('/register', wrapAsync(users.registerUser));

router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;