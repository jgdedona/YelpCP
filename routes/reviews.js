const express = require("express");
const wrapAsync = require('../utilities/wrapAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isAuthorizedReview } = require('../middleware');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.get('/', reviews.redirectToCampground);

router.delete('/:reviewId', isLoggedIn, isAuthorizedReview, wrapAsync(reviews.deleteReview));

module.exports = router;