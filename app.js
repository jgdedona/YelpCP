const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas');
const CustomErr = require('./utilities/CustomErr');
const wrapAsync = require('./utilities/wrapAsync');
const Joi = require('joi');
const override = require('method-override');
const Campground = require('./models/campground');

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

function validateCamp(req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new CustomErr(msg, 400);
    }
    next();
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCamp, wrapAsync(async (req, res) => {
    const campground = new Campground({ ...req.body.campground });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCamp, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
}));

app.all('*', (req, res, next) => {
    next(new CustomErr('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "Error!";
    }
    res.status(status).render('error.ejs', { err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});