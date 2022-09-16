const express = require("express");
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn, validateCamp, errorFlashes, isAuthorizedCamp } = require('../middleware');


const router = express.Router();

router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCamp, wrapAsync(async (req, res) => {
    const campground = new Campground({ ...req.body.campground });
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id/edit', isLoggedIn, isAuthorizedCamp, errorFlashes, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthorizedCamp, validateCamp, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthorizedCamp, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds');
}));

router.get('/:id', errorFlashes, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', populate: { path: 'author' }
    }).populate('author');
    console.log(campground);
    res.render('campgrounds/show', { campground });
}));

module.exports = router;