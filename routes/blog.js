const { Router } = require('express')
const multer = require('multer')
const router = Router()
const BLOG = require('../models/blog')
const COMMENT = require('../models/comments')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        console.log(file)
        const fileName = `${Date.now()}-${file.originalname}`

        cb(null, fileName)
    }

})

const upload = multer({ storage: storage })


router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })

})


router.get('/:id', async (req, res) => {
    const blog = await BLOG.findById(req.params.id).populate("createdBy")
    const comments = await COMMENT.find({blogId:req.params.id}).populate("createdBy")
    return res.render('blog', {
        user: req.user,
        blog: blog,
        comments:comments
    })

})

router.post('/comment/:blogId', async (req, res) => {

    const comment = await COMMENT.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`)

})



router.post('/', upload.single('coverImageURL'), async (req, res) => {
    const { title, body, coverImageURL } = req.body
    const blog = await BLOG.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })

    return res.redirect(`/blog/${blog._id}`)
})




module.exports = router
