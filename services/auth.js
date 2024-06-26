const JWT = require("jsonwebtoken");

const secret= "d@029292929990285"

function createTokenforUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email: user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    }
    const token= JWT.sign(payload, secret)
   
    return token
}

function validateToken(token){
    const payload=JWT.verify(token, secret);
    return payload
}
module.exports={
    createTokenforUser,
    validateToken,
}