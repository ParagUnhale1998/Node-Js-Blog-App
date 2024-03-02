const { Schema, model } = require('mongoose') //destructring 


const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,

    },
    createdBy: {
        type:Schema.Types.ObjectId,
       ref:"user"
    }
}, { timestamps: true })


const BLOG = model('blog', blogSchema)

module.exports = BLOG



