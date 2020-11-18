var express = require('express')
var router = express.Router()

var UserModel = require('../models/Users')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

router.post('/login', async (req,res)=> {
    var user = await UserModel.findOne({email:req.body.email});

    try {
        if (!user) return res.status(412).send('Invalid e-mail')
        var passVerif = await bcrypt.compare(req.body.password,user.password)
        if (!passVerif) return res.status(401).send("Invalid Password")
        var token = jwt.sign({_id: user._id}, process.env.SECRET)
        res.send(token)
    }
    catch (err) {
        res.send(err)
    }
})

module.exports = router