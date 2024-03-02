const JWT =  require('jsonwebtoken')

const screteKey = '@parag!@#'

function createTokenForUser(user){
    const payload = {
        _id :user._id,
        email:user.email,
        profileImageURL :user.profileImageURL,
        role:user.role
    }

    const token = JWT.sign(payload,screteKey)
    return token

}

function validateTokenn(token){
    const payload = JWT.verify(token,screteKey)
    return payload
}

module.exports ={
    createTokenForUser,
    validateTokenn
}