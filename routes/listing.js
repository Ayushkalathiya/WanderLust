const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
// for take image using form
const multer = require('multer');
// save image in cloud
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});


// controller of mvc
const listingController = require("../controllers/listing.js");

// print all listing
// create route
// route.route -> if path is same 
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post( 
    isLoggedIn ,
    upload.single('listing[image]'),
    validateListing,  
    wrapAsync(listingController.createListing));

  
  // new Route
router.get("/new" , isLoggedIn ,(req,res)=>{
  res.render("./listing/new.ejs");
});
  

// show , update and delete routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(
    isLoggedIn ,
    wrapAsync(listingController.destroyListing));     
  
  

// Edit rout
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));
   

module.exports = router;