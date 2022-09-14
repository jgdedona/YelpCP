const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const CustomErr = require('./utilities/CustomErr');
const override = require('method-override');
const flash = require('connect-flash');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-cp')
    .then(() => {
        console.log("Connection Opened!");
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(override('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'fixthislater',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new CustomErr('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "Error!";
    }
    res.status(status).render('error', { err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});