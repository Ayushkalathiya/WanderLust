const Listing = require("../models/listing.js");
// for mapbox geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken });

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", {allListing});
};

// Using populate we can use review at the objectId
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    // we have all review with owner
    // nested populate
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    
    res.render("./listing/show.ejs",{listing});
};

module.exports.createListing = async (req, res) => {  

  // geocoding -> call the function
  // limit -> 1 means only one cordinates will be genrete
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send();

    // for read file of photo 
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    console.log("Crerate Listing : ",req.body.listing);
    // passort is save user naem in user._id
    // save listing with owner
    // console.log(newlisting);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename}; 
    // read response of mapbox and save in databse(geometry)
    newlisting.geometry = response.body.features[0].geometry;
    
    let save = await newlisting.save();
    console.log(save);

    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing you requested for dose not exist!");
        res.redirect("/listings");
    }
// for privew image decrise image pixel
// using cloudinary Image transformations
// h_300 -> is for hight same for width 
    let originalImageUrl = listing.image.url;
    originalImageUrl =   originalImageUrl.replace("/upload","/upload/h_300/w_250");
    res.render('./listing/edit.ejs', {listing , originalImageUrl});
};

module.exports.updateListing = (async (req, res) => {
    let {id} = req.params;
    // console.log("inside put route : ", id);
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(listing);
    // Edit the listing with new photo
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    
    // flash for update
    req.flash('success','Listing Updated');
    // console.log("Updated listing");
    res.redirect("/listings")
});

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // flash for delete  
    req.flash("success","Listing Deleted");
    res.redirect('/listings');
};