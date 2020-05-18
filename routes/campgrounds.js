var express      = require("express");
var router       = express.Router();

var campGround      = require("../models/campgrounds");
var middleware      = require("../middleware");

var camps;
campGround.find({},function(err,campGrounds){
camps=campGrounds;
});

//home page route  
  router.get("/", function(req, res) {
    campGround.find({},function(err,campGrounds){
      if(err){
        console.log("Something Went Wrong!");
      }
      else{
        res.render("campgrounds/campgrounds", { campGrounds: campGrounds });
      }
    });
  });
  
  //routes for adding new campGround
  router.get("/addcamp", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/addcamp");
  });
  
  router.post("/", middleware.isLoggedIn, function(req, res) {
  campGround.create(req.body.newCampGround,function(err,camp){
    if(err){
        console.log(err);
    }else{
      camp.author.id=req.user._id;
      camp.author.username=req.user.username;
      camp.save();
      req.flash("info","You have successfully created a new post.")
      res.redirect("/campgrounds");
      console.log(camp);
    }});

  });
  
  //route to see full post of a campGround
  router.get("/:id", function(req,res){
    campGround.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
      if(err || (foundCamp===null)){
        req.flash("error", "No Such Campground Found.");
        res.redirect("/campgrounds");
      }else{
        res.render("campgrounds/show",{foundCamp:foundCamp, camps:camps});
      }
    });
  });

//route to get edit form for campground
router.get("/:id/edit", middleware.ifCampgroundOwner, function(req,res){
  campGround.findById(req.params.id, function(err,foundCamp){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.render("campgrounds/edit",{foundCamp:foundCamp});
    }
  }); 
});

//route to update campground
router.put("/:id", middleware.ifCampgroundOwner, function(req,res){
campGround.findByIdAndUpdate(req.params.id, req.body.campGround ,function(err, updatedCamp){
   if(err){
     console.log(err);
     res.send("<h1>Error 404</h1>")
   }else{
     req.flash("info", "You have succesfully edited your post.");
     res.redirect("/campgrounds/"+ updatedCamp._id)
   }
  });
});

//route for deleting campground
router.delete("/:id", middleware.ifCampgroundOwner, function(req,res){
campGround.findByIdAndDelete(req.params.id, function(err){
   if(err){
     console.log(err);
     res.send("<h1>Error 404</h1>");
    }
    else{
      req.flash("error", "You have successfully deleted your post.")
     res.redirect("/campgrounds");
   }
});
});

//not letting comment unauthorized user

  module.exports=router;