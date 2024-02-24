// 
if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
// mongo store for data
const MongoStore = require('connect-mongo');


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js');
const { error } = require('console');

//const mongodbUrl = 'mongodb://127.0.0.1:27017/wanderlust'
// for connect atlas of mongodb and use cloud
const dbUrl = process.env.ATLASDB_URL;

main().
catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));;
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// for store session details on Atlas
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error", (error)=>{
  console.log(error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24   * 60 * 60 * 1000 ,// one week
    maxAge : 7 * 24   * 60 * 60 * 1000 ,
    httpOnly: true,
  },
};




// app.get("/",(req,res)=>{
//     res.send("Hello");
// });

// for cookie
app.use(session(sessionOptions));

// flash
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// save for flash into locals
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
//   let fackuser = new User(
//     {
//       email:"123@gmail.com",
//       username: "Ayush"
//     }
//   );

//   let register = await User.register(fackuser, "AK");
//   res.send(register);
// });

// express router
// use router(which is in router folder)
// for all /listings
app.use("/listings", listingRouter);

// Reviews Route
app.use("/listings/:id/reviews", reviewRouter);

// user router
app.use("/", userRouter);

// app.get("/testListing" , async(req,res)=>{
//   let smapleListing = new Listing({
//     title : "My new villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Goa",
//     country: "india"
//   });

//   await smapleListing.save();
//   console.log("sample saved");
//   res.send("Sample was saved successfully");

// });

// if request is not match any of the above requests
// if page is not availabe
app.all("*", (req,res,next)=>{
  console.log("Not Found Page");
  next(new ExpressError(404,"Page Not Found"));
});


app.use((err,req,res,next)=>{
  let {statusCode = 500, message = "Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("Error.ejs", {err})
})

// middelware for error
// app.use((err,req,res,next)=>{
//   res.send("something wrong");
// })

app.listen(8080,()=>{
    console.log("Server is listing to port 8080");
});