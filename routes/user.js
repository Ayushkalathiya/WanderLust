const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');

// controller of mvc
const userController = require("../controllers/users.js");

// router.router
router
    .route("/singup")
    .get(wrapAsync(userController.renderSingup))
    .post(wrapAsync(userController.signup));


router
    .route("/login")
    .get( userController.renderLoginForm)
    .post(saveRedirectUrl
        ,passport.authenticate("local", {
        // if login fail redirect to /login
        failureRedirect: '/login', 
        failureFlash: true
    }),
     wrapAsync(userController.login));


// router.get('/singup',wrapAsync(userController.renderSingup));

// router.post('/singup',wrapAsync(userController.signup));

// router.get("/login", userController.renderLoginForm);

// router.post("/login",
//     saveRedirectUrl
//     ,passport.authenticate("local", {
//     // if login fail redirect to /login
//     failureRedirect: '/login', 
//     failureFlash: true
// }),
//  wrapAsync(userController.login)   
// );

router.get("/logout", userController.logout);

module.exports = router;