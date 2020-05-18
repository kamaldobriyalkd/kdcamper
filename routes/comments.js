var express      = require("express");
var router       = express.Router({mergeParams:true});

var campGround      = require("../models/campgrounds"),
Comment         = require("../models/comments");

var middleware  = require("../middleware");

//routes for adding comments to campGrounds posts
 router.post("/", middleware.isLoggedIn,function(req,res){
   campGround.findById(req.params.id,function(err,campGround){
     if(err){
       console.log(err);
       res.send("<h1>Error 404</h1>");
     }else{
       Comment.create(req.body.comment,function(err,comment){
         if(err){
           console.log(err);
           res.send("<h1>Error 404</h1>");
         }else{
           comment.author.id=req.user._id;
           comment.author.username=req.user.username;
           comment.save();
           campGround.comments.push(comment);
           campGround.save();
           res.redirect("/campgrounds/"+req.params.id);
         }
       });
     }
   });
 });

 //route to get edit form
  router.get("/:comment_id/edit", middleware.ifCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log(err);
        res.redirect("back");
      }else{
        res.render("comments/edit",{campground_id: req.params.id, foundComment: foundComment});
      }
    });
 });

//route to update comments
router.put("/:comment_id", middleware.ifCommentOwner, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      req.flash("error", "You have successfully edited your comment.");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//route to delete comments
router.delete("/:comment_id", middleware.ifCommentOwner, function(req,res){
  Comment.findByIdAndDelete(req.params.comment_id, function(err){
    if(err){
      console.log(err);
      res.send("<h1>Error 404</h1>");
    }else{
      req.flash("error", "You have successfully deleted your comment.");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

 module.exports=router;