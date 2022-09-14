const express = require('express');
const wrapAsync = require('../utilities/wrapAsync');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const user = await new User({ username, email })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash('success', `Welcome, ${registeredUser.username}!`);
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', `${e.message}`);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', "Welcome!");
    const redirectUrl = req.session.redirectedFrom || '/campgrounds'
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;