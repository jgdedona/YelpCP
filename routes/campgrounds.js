const express = require("express");
const wrapAsync = require('../utilities/wrapAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCamp, errorFlashes, isAuthorizedCamp } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage: storage })

const router = express.Router();

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('campground[image]'), validateCamp, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id/edit', isLoggedIn, isAuthorizedCamp, errorFlashes, wrapAsync(campgrounds.renderEditForm));

router.route('/:id')
    .put(isLoggedIn, isAuthorizedCamp, upload.array('campground[image]'), validateCamp, wrapAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthorizedCamp, wrapAsync(campgrounds.deleteCampground))
    .get(errorFlashes, wrapAsync(campgrounds.showCampground));

module.exports = router;