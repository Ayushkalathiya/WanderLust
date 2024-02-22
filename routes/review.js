const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const {validateReview} = require("../middleware.js");
// const ExpressError = require("../utils/ExpressError.js");


// post review Route
router.post('/',validateReview , wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    let id = req.params.id;
    // console.log(id);
    // console.log(req.params);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created")
    console.log("New review saved successfully");
    res.redirect(`/listings/${id}`);

}));

// delete route (For review)
// $pull 
router.delete("/:reviewId", 
wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: {reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("deleted")
    // flash for delete
    req.flash('success','Review Deleted');
    res.redirect(`/listings/${id}`);
  }
));

module.exports=router;