const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    //req.user have -> use information and 
    // it is default function of passport
    // console.log(req.user);
    if(!req.isAuthenticated()){
        // make object in session -> redirectUrl
        // and save originalUrl
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logges in to create listing");
        return res.redirect("/login");
    }
    next();
};

// for save redirectUrl
// because passport.authenticate is autometic reset the session so we can not change in 
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    console.log("In Middlware : ", id);
    let listing = await Listing.findById(id);
    console.log("Listing in Middlware : ", listing);
    
    if(!listing.owner.equals(res.locals.CurrUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// validate
module.exports.validateListing = (req,res,next) =>{
    // check all the condition (by Joi) at scema.js
    let {error} = listingSchema.validate(req.body);
    console.log( "validateListing : " , req.body.listing);
    console.log("validateListing Title : ", req.body.listing.title);
    if(error){
     let errMsg = error.details.map((el)=>el.message).join(",");
    //  console.log(error);
      throw new ExpressError(404,errMsg);
    } else{
     next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    // check all the condition (by Joi) at scema.js
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
     let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(404,errMsg);
    } else{
     next();
    }
 };

 module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id} = req.params
    let {reviewId} = req.params;
    // console.log("In Middlware : ", id);
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.CurrUser._id)){
        req.flash("error","You are not author of review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
