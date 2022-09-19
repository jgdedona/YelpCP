const express = require("express");
const wrapAsync = require('../utilities/wrapAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCamp, errorFlashes, isAuthorizedCamp } = require('../middleware');


const router = express.Router();

router.get('/', wrapAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCamp, wrapAsync(campgrounds.createCampground));

router.get('/:id/edit', isLoggedIn, isAuthorizedCamp, errorFlashes, wrapAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthorizedCamp, validateCamp, wrapAsync(campgrounds.editCampground));

router.delete('/:id', isLoggedIn, isAuthorizedCamp, wrapAsync(campgrounds.deleteCampground));

router.get('/:id', errorFlashes, wrapAsync(campgrounds.showCampground));

module.exports = router;