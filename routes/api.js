var express = require('express');
const { restart } = require('nodemon');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var UserModel = require('../models/Users')
var verifyToken = require('./verifyjwt')

/* GET home page. */
router.all('/', function(req, res, next) {
  res.json({
    api:{
      version:'1.0.0'
    }
  });
});

router.get('/token', async function(req, res, next) {
  var token = jwt.sign({
    _id: "837245nsdnlk" }
    , process.env.SECRET)
  try {
    res.send(token)  
  } catch (err) {
    res.send(err)
  }
});

router.get('/user/:id', async function(req, res, next) {
  var userid = req.params.id;
  var user = await UserModel.findById(userid);
  try {
    res.send(user)
  } catch (err) {
    res.send(err)
  }
});

router.get('/user/email/:email', async function(req, res, next) {
  var userEmail = req.params.email;
  console.log("Searching by email="+userEmail)
  var users = await UserModel.find({email:userEmail})
  try {
    res.send(users)
  } catch (err) {
    res.send(err)
  }
});

router.delete('/user/:id', async function(req, res, next) {
  var userid = req.params.id;
  var deletedUser = await UserModel.remove({
    _id:userid
  })
  try {
    res.send(deletedUser)
  } catch (err) {
    res.send(err)
  }
});

router.get('/all', verifyToken, async function(req, res, next) {
  var users = await UserModel.find();
  try {
    res.send(users)
  } catch (err) {
    res.send(err)
  }
});

router.patch('/user/:id', async function(req, res, next) {
  var userid = req.params.id;
  var updatedUser = await UserModel.update(
    {_id:userid},
    {$set: req.body}
  )
  try {
    res.send(updatedUser)
  } catch (err) {
    res.send(err)
  }
});

router.post('/add', async function(req, res, next) {
  var salt = await bcrypt.genSalt(10)
  var hashPassword = await bcrypt.hash(req.body.password,salt)
  var newUser = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  saveResult = await newUser.save()
  try{
    res.send(saveResult)
  } catch (err) {
    res.send(err.json)
  }
});

module.exports = router;
