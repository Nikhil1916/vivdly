const jwt = require("jsonwebtoken");
const config = require("config");
const auth = async(req,res,next) => {
    try {
        console.log(req.cookies);
        const token = req.header('x-auth-token') || req.cookies.token;
        if(!token) {
            return res.status(401).send("Token not present");
        }
        console.log(token);
        const verify = await jwt.verify(token , config.get("JWT_SECRET"));
        req.user = verify;
        next()
    } catch(e) {
        return res.status(401).send("Invalid token.")
    }
}

module.exports = {auth};