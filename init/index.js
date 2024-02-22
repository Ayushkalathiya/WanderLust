const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

main().
catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () =>{
  await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"65d1c4591f6133f4f0438907" }));
    await Listing.insertMany(initdata.data);
    console.log("Data saved");
}

initDB();