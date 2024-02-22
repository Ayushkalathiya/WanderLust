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


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')


main().
catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));;
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24   * 60 * 60 * 1000 ,// one week
    maxAge : 7 * 24   * 60 * 60 * 1000 ,
    httpOnly: true,
  },
}
app.get("/",(req,res)=>{
    res.send("Hello");
});

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
  console.log("All");
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