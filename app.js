const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const CustomErr = require('./utilities/CustomErr');
const override = require('method-override');
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
app.use(express.urlencoded({ extended: true }));
app.use(override('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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