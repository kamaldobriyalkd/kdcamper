var campGround = require("../models/campgrounds"),
    Comment    = require("../models/comments");
    
var middleware={

};

middleware.ifCampgroundOwner = function(req,res,next){
    if(req.isAuthenticated()){
      campGround.findById(req.params.id, function(err,foundCamp){
        if(err  || (foundCamp===null)){
          req.flash("error", "Something Went Wrong.");
          res.redirect("/campgrounds");
        }else{
          if(foundCamp.author.id.equals(req.user._id)){
            return next();
          }else{
            res.redirect("back");
          }
        }
      });
    }else{
      res.redirect("back");
    }
}

middleware.ifCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err  || (foundComment===null)){
          req.flash("error", "Something Went Wrong.");
          res.redirect("/campgrounds/"+req.params.id);
        }else{
          if(foundComment.author.id.equals(req.user._id)){
            return next();
          }else{
            res.redirect("back");
          }
        }
      });
    }else{
      res.redirect("back");
    }
    }

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
          return next();
        }
        req.flash("error", "You have to login first");
        res.redirect("/login");
}


module.exports = middleware;