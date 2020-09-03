//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");  //passport local isn't required by us it is a dependancy for passportLocalMongoose
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");//to support find or create in the google strategy callback function
//const encrypt = require("mongoose-encryption");      //for encrypting fields
//const md5 = require("md5");             //a relatively easy to hack hash function
//const bcrypt = require("bcrypt");         //industry standard hash function along with built in salt capabilities
//const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

//telling our app to use session with some config
app.use(session({
  secret: "oursecret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());    //telling our app to use passport and initializing passport package
app.use(passport.session());     //using passport to deal with sessions


mongoose.connect("mongodb://localhost:27017/userDB", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useCreateIndex', true); //dealing with a deprecation warning


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);   //used to hash and salt passwords and save users into database
userSchema.plugin(findOrCreate);
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

//by using passportLocalMongoose instead of directly dealing with passportLocal only the below three lines of code is needed rest is taken care by passportLocalMongoose
passport.use(User.createStrategy());
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());
//above lines worked for local authentication, to enable google authentication below piece of code is taken from passport documentation config
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//it is important to follow the sequence of process through out the setup //general tip
//the following  piece if directly form passport-google-oauth20 documentation
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'//this is to deal with google+ deprication as passport-google-oauth20 has it as a dependency
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
  res.render("home");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })); //takes user to google server to authenticate

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }), //authenticates locally and save login session
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req, res){
  User.find({"secret": {$ne: null}}, function(err, result){
    if(err)
      console.log(err);
    else {
      if(result){
        res.render("secrets", {usersWithSecrets: result});
      }
    }
  });
});

app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("submit");
  }
  else{
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register",function(req,res){
  //register() is a function provided by passport to be invoked on a model
  User.register({/*should be email?*/username: req.body.username}, req.body.password, function(err, regResult){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      //authenticating user with passport and setting up a logged in session by sending a cookie with "local type"
      passport.authenticate("local")(req, res, function(){//call back is called only if authentication is successful
        res.redirect("/secrets"); //note: we did not use this previously we directly rendered secrets page in register and login routes
        //by this user can directly visit secrets page if he is in logged in state
      })
    }
  });

});

app.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  //login is a passport function to be invoked on req
  req.login(user, function(err){
    if(err)
      console.log(err);
    else
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
  });
});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, function(err, result){ //current user is stored in session by passport and can be accesed by req.user
    if(err)
      console.log(err);
    else {
      result.secret = submittedSecret;
      result.save(function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, function(){
  console.log("server up on 3000");
});
