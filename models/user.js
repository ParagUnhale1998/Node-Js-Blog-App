const { createHmac, randomBytes } = require('node:crypto')
const { Schema, model } = require('mongoose') //destructring 
// const mongoose = require('mongoose');//without destructring
const jwtAuth = require('../services/authentication')

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/avatar.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true })


userSchema.pre('save',  function (next) { // Add the next parameter here
    const user = this

    if (!user.isModified('password')) {
        return next(); // Return here to ensure the function exits if password is not modified
    }

    const salt = randomBytes(16).toString(); // this is secrete key
    // const salt ='someRandomSalt'; // random sort manual
    const hashedPassword = createHmac("sha256", salt).update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next(); // Call next to proceed to the next middleware function
});


userSchema.static('matchPasswordAndGenerateToken',async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) { throw  new Error('user not found')}

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac("sha256", salt).update(password)
        .digest("hex");
   
   if(hashedPassword !== userProvidedHash) {throw  new Error('Incorrect Password')}
    // return  hashedPassword === userProvidedHash
    // return { ...user, password: undefined, salt: undefined }
    // return user
    
    const token = jwtAuth.createTokenForUser(user)
    return token;
})


const USER = model('user', userSchema)

module.exports = USER