const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');

router.get('/singup',(req, res)=>{
    res.render("users/signup.ejs");
});

router.post('/singup',wrapAsync(async (req, res)=>{
   try{
       let {username, email, password} = req.body;
       const newUser = new User({email,username});
       const register = await User.register(newUser ,password);
    //default function of passport
       req.login(register, (err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success","welcome to wnderlust");
            res.redirect("/listings");
       });   
   } catch(e){
        req.flash("error",e.message);
        res.redirect("/singup");
   }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl
    ,passport.authenticate("local", {
    // if login fail redirect to /login
    failureRedirect: '/login', 
    failureFlash: true
}),
    async (req,res)=>{
        req.flash("success" ,"welcome back to Wanderlust.");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req,res,next)=>{
    // default function in passsport
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success',"you are now logged out");
        res.redirect("/listings");
    });
});

module.exports = router;