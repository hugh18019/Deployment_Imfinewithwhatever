// const jwt = require('koa-jwt');
const jwt = require("jsonwebtoken")
const { User } = require("../../database/models")
const destroyCookies = require("../../config/destroyCookies")

// Validate that the access_token cookie is sent with the request and ensure that
// it was signed by the API server. `debug: true` simply allows for more detailed error
// messages in internal logging.
module.exports = async (ctx, next) => {
    const requestOrigin = ctx.request.originalUrl.split("/").filter((endpoint) => endpoint !== "")[0]
    if (requestOrigin === "users") return await next()
    
    const email = ctx.cookies.get("email")
    const user = await User.findOne().where("email").equals(email)
    const token = user.access_token

    return jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if (err) return;
        const exp = decoded.exp < Date.now().valueOf() / 1000
        if (exp) {
            destroyCookies(ctx)
            return; 
        } else {
            await next()
        }
    })
    
//     jwt({
//     secret: process.env.JWT_KEY,
//     cookie: 'access_token',
//     key: 'jwtdata',
//     debug: true
// })
}
