const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.login = (req, res) => {
    req.flash('success', "Welcome!");
    const redirectUrl = res.locals.redirectedFrom || '/campgrounds';
    delete res.locals.redirectedFrom;
    res.redirect(redirectUrl);
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}