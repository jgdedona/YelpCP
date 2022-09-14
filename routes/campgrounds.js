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

async function errorFlashes(req, res, next) {
    const { id } = req.params;
    const reg = /[a-f0-9]{24}/gi;
    if (!id.match(reg)) {
        req.flash('error', 'Invalid campground ID');
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
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
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id/edit', errorFlashes, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCamp, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'campground deleted!')
    res.redirect('/campgrounds');
}));

router.get('/:id', errorFlashes, wrapAsync(async (req, res) => {
    const { id } = req.params;
    // if (id.length != 24) {
    //     req.flash('error', 'Invalid campground ID');
    //     res.redirect('/campgrounds');
    // }
    const campground = await Campground.findById(id).populate('reviews');
    // if (!campground) {
    //     req.flash('error', 'Campground not found');
    //     res.redirect('/campgrounds');
    // }
    res.render('campgrounds/show', { campground });
}));

module.exports = router;