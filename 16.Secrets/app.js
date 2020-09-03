//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");  //passport local isn't required by us it is a dependancy for passportLocalMongoose
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
  password: String
});

userSchema.plugin(passportLocalMongoose);   //used to hash and salt passwords and save users into database
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

//by using passportLocalMongoose instead of directly dealing with passportLocal only the below three lines of code is needed rest is taken care by passportLocalMongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/secrets",function(req, res){
  if(req.isAuthenticated()){
    res.render("secrets");
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



app.listen(3000, function(){
  console.log("server up on 3000");
});
