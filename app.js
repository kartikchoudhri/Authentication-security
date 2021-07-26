//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/secreatDB', {useNewUrlParser: true, useUnifiedTopology: true });
app.use(session({
  secret: 'this is my little secret',
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
const secreatSchema=new mongoose.Schema({
  email:String,
  password:String
});
secreatSchema.plugin(passportLocalMongoose);
const User=new mongoose.model('user',secreatSchema);
mongoose.set('useCreateIndex', true);
passport.use(User.createStrategy());
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login")
});
app.get("/register",function(req,res){
  res.render("register")
});
// app.get("/submit",function(req,res){
//   res.render("submit");
// });
app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
})
app.post("/register",function(req,res){
User.register({username:req.body.username},req.body.password, function(err, user) {
  if(err){
    console.log(err);
    res.redirect("/register");
  }
  else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets");
    });
  }
})

});
app.post("/login",function(req,res){
const user =new User({
  username:req.body.username,
  password:req.body.password
})
req.login(user ,function(err){
  if(err){
    console.log(err);
  }
  else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets");
    });
  }
})
});




app.listen(3000,function(req,res){
  console.log("server is running")
});
