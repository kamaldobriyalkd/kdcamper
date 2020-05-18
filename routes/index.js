var express      = require("express");
var router       = express.Router();
var passport = require("passport");
var user = require("../models/users");

router.get("/", function(req, res) {
    res.render("landing");
  });
  //===========
//auth routes
//===========

//signup form
router.get("/signup",function(req,res){
    res.render("signup");
    });

    //signup handle
    router.post("/signup",function(req,res){
      if(req.body.password===req.body.cpassword){
        user.register(new user({username:req.body.username}), req.body.password, function(err,user){
          if(err){
            req.flash("error", err.message);
            return res.render("signup");
          }passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to KDCamper "+user.username);
            res.redirect("/campgrounds");
          });
         });
    }else{
      req.flash("error", "You Entered Different Password.");
      res.redirect("/signup");
    }

    });

    //login form
    router.get("/login",function(req,res){
    res.render("login");
    });

    //login handle
    router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
    })
    ,function(req,res){
    });

    //logout
    router.get("/logout",function(req,res){
      req.logOut();
      req.flash("success", "You have been logged out successfully.")
      res.redirect("/campgrounds")
    });
    
    module.exports=router;