const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");

// print all listing
router.get("/",async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", {allListing});
});
  
  // new Route
router.get("/new" , isLoggedIn ,(req,res)=>{
  res.render("./listing/new.ejs");
});
  
  // Show Route
  // Using populate we can use review at the objectId
router.get("/:id",async(req,res)=>{
    let {id} = req.params;
    // we have all review with owner
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
});

  
// create route
router.post("/", 
validateListing,
isLoggedIn ,
wrapAsync(async (req, res,next) => {  
      if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
      }  
      // let {title,description, image, price, country, location} = req.params;
      const newlisting = new Listing(req.body.listing);
      // passort is save user naem in user._id
      // save listing with owner
      newlisting.owner = req.user._id;
      await newlisting.save();
      req.flash("success","New Listing Created");
      res.redirect("/listings");
}));

// Edit rout
router.get("/:id/edit",isLoggedIn,async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
 
    res.render('listing/edit.ejs', {listing});
});

// update Route -> error 
router.put(
'/:id',
validateListing,
isLoggedIn,
isOwner,
(async (req, res) => {
    let {id} = req.params;
    console.log("inside put route : ", id);
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log("update : " , listing);
    console.log(listing);
    // flash for update
    req.flash('success','Listing Updated');
    console.log("Updated listing");
    res.redirect("/listings")
}));

// delete Route
router.delete('/:id',isLoggedIn ,async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // flash for delete  
    req.flash("success","Listing Deleted");
    res.redirect('/listings');
});    

module.exports = router;