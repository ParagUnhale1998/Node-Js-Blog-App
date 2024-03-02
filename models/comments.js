const { Schema, model } = require('mongoose') //destructring 


const commentsSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: String,
       ref:"blog"
    },
    createdBy: {
        type:Schema.Types.ObjectId,
       ref:"user"
    }
}, { timestamps: true })


const COMMENT = model('comment', commentsSchema)

module.exports = COMMENT



