const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const key=process.env.JWT_KEY

// checking whether its a user or not
// so that it can update itself,change orders and all
function userAuthMiddleware(req, resp, next) {
    try {
        let B_token = req.headers.authorization//actual jwt token nikala gaya B_token
        let token = null // ek variable
        token = B_token.split(" ")[1]// token me pehle space ke baad jwt retrieve
        const payload = jwt.verify(token, key)
        req.session = {
            userData: payload   //session ke andar user key ke saath request me payload gaya
        };
        next();
    } catch (error) {
        resp.status(401)  //unauthorized error
        return resp.json({ "error": "invalid...please login" })

    }
}

// checking whether a admin or not
// so that it can update everything

function adminAuthMiddleware(req, resp, next) {
    try {
        let B_token = req.headers.authorization//actual jwt token nikala gaya B_token
        let token = null // ek variable
        token = B_token.split(" ")[1]// token me pehle space ke baad jwt retrieve
        const payload = jwt.verify(token, key)
        // console.log(payload)
        console.log(payload.isAdmin)
        req.session = {
            userData: payload  //session ke andar user key ke saath request me payload gaya
        };
        if (payload.isAdmin) { //checking if admin or not
            return next();
        }
        resp.status(401)  //unauthorized error
        return resp.json({ "error": "not admin...you are not authorized" })

    } catch (error) {
        resp.status(401)  //unauthorized error
        return resp.json({ "error": "invalid token" })

    }
}


module.exports = { userAuthMiddleware, adminAuthMiddleware }