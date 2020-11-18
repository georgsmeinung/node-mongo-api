var jwt = require('jsonwebtoken')
var verifyToken = (req, res, next) => {
    var token = req.headers['access-token']
    if (!token) {
        res.status(401).send("Access denied")
        return
    }

    try{
        var verify = jwt.verify(token, process.env.SECRET)
        req.user = verify
        next();
    }
    catch(err){
        res.status(401).send("Invalid Access Token")
    }
}

module.exports = verifyToken