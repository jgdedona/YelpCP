const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { cloudinary } = require('../cloudinary/index');

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    let campgrounds = null;
    if ('query' in req.query && 'type' in req.query) {
        const { query, type } = req.query;
        campgrounds = await Campground.find({[type]: new RegExp('.*' + query + '.*', 'i')});
    } else {
        campgrounds = await Campground.find({});
    }
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    var geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    if (!geoData.body.features.length) {
        req.flash('error', 'Invalid location');
        return res.redirect('/campgrounds/new');
    }
    const campground = new Campground({ ...req.body.campground });
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    req.flash('success', 'Successfully created a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', populate: { path: 'author' }
    }).populate('author');
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    var geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    if (!geoData.body.features.length) {
        req.flash('error', 'Invalid location');
        return res.redirect(`/campgrounds/${id}`);
    }
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, runValidators: true });
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    updatedCamp.images.push(...images);
    updatedCamp.geometry = geoData.body.features[0].geometry;
    await updatedCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds');
}