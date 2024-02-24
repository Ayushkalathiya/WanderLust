const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
// const ExpressError = require("../utils/ExpressError.js");

// controller of mvc
const reviewController = require("../controllers/reviews.js");

// post review Route
router.post('/',
isLoggedIn,
validateReview ,
 wrapAsync(reviewController.createReview));

// delete route (For review)
// $pull 
router.delete("/:reviewId", 
isLoggedIn,
isReviewAuthor,
wrapAsync(reviewController.destroyReview));

module.exports=router;