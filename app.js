//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
// var Schema = mongoose.Schema;
// const md5 =require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/secreatDB', {useNewUrlParser: true, useUnifiedTopology: true });
const secreatSchema=new mongoose.Schema({
  email:String,
  password:String
});
const secret=process.env.SECRET;
const User=new mongoose.model('user',secreatSchema);
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
// app.get("/secrets",function(req,res){
//   res.render("secrets");
// });
app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser=new User({
      email:req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
      res.render("secrets");
      }
    })
});
});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,foundOne){
    if(!err){
      bcrypt.compare(password, foundOne.password).then(function(result) {
    if(result == true){
      res.render("secrets");
    }
});
    }
    else{
      res.send("failed to login");
    }
  })
})




app.listen(3000,function(req,res){
  console.log("server is running")
});
