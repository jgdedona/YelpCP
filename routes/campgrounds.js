const express = require("express");
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');


const router = express.Router();

function validateCamp(req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new CustomErr(msg, 400);
    }
    next();
}

router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCamp, wrapAsync(async (req, res) => {
    const campground = new Campground({ ...req.body.campground });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCamp, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

module.exports = router;