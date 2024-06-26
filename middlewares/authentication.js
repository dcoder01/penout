const { validateToken } = require("../services/auth");

function checkForAuthentication(cookieName){
    return (req, res, next)=>{
        const tokenCookieval=req.cookies[cookieName];
        if(!tokenCookieval){
            return next();
        }
        try {
            const userpayload=validateToken(tokenCookieval);
            req.user=userpayload;
        } catch (error) {}
       return  next();

    }
}

module.exports={
    checkForAuthentication,
}