const User = require("../models/user.js");

module.exports.renderLoginForm =(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.renderSingup = (req, res)=>{
    res.render("./users/signup.ejs");
};


module.exports.signup = async (req, res)=>{
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
 };

 module.exports.login = async (req,res)=>{
    req.flash("success" ,"welcome back to Wanderlust.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    // default function in passsport
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success',"you are now logged out");
        res.redirect("/listings");
    });
};