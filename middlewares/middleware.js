var { expressjwt: jwt } = require("express-jwt");

// MiddleWare
const requireSignin =  jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"] 
 })

 module.exports = requireSignin