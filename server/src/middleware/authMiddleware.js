const jwt = require("jsonwebtoken");
const {secret} = require('../../config.js')

module.exports = function(req, res, next)
{
    if(req.method === "OPTIONS")
    {
        next();
    }

    try
    {   
        const token = req.cookies.token
        if(!token)
        {
            res.status(400).json({message: "User is not athorized"});
        }
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    }
    catch(e)
    {
        console.log(e);
        res.status(400).json({message: "User is not athorized"});
    }
}
