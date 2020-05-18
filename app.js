var express      = require("express"),
app              = express(),
bodyParser       = require("body-parser"),
Comment          = require("./models/comments"),
campGround       = require("./models/campgrounds"),
methodOverride   = require("method-override"),
passport = require("passport"),
localStrategy = require("passport-local"),
flash = require("connect-flash"),
passportLocalMongoose = require("passport-local-mongoose"),
user = require("./models/users"),
mongoose         =require("mongoose");

//==============
  //routes files
//==============
var indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds");

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("assets"));
app.use(flash());

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/kamal");

app.use(require("express-session")({
secret:"KD is the best",
resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  next();
});
app.use(function(req,res,next){
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  res.locals.info=req.flash("info");
  next();
});
//==============
  //using routes
//==============

app.use(indexRoutes);
app.use("/campgrounds/:id/comment",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(process.env.PORT || 2020, function(){
console.log("KDCamper server launched!");
});
