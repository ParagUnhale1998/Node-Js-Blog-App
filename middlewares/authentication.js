const { validateTokenn } = require("../services/authentication")



 function checkForAuthenticationForCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]

        if (!tokenCookieValue) {
            return  next()
        }

        try {
            const userPayload = validateTokenn(tokenCookieValue)
            req.user = userPayload
        } catch (error) {
            return  next()
        }
       return next()
    }
}

module.exports = {
    checkForAuthenticationForCookie
}