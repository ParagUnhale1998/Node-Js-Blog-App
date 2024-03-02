const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const Blog = require('./models/blog')

const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')

const app = express()
const PORT = 8000

const { checkForAuthenticationForCookie } = require('./middlewares/authentication')

//mongoDB connections
mongoose.connect('mongodb://localhost:27017/Blogify').then(() => {
    console.log('mongo db connected')
}).catch(err => console.log(err.message +'mongoDB_ERROR'))

//for server side html
app.set('view engine','ejs')
app.set('views',path.resolve("./views"))


//middlewares
app.use(express.json()) 
app.use(express.urlencoded({extended:false})) 
app.use(cookieParser())
app.use(checkForAuthenticationForCookie("token"))
app.use(express.static(path.resolve('./public')))

//routes
app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({})

    res.render('home',{
        user:req.user ,
        blogs:allBlogs
    })
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)


//server started
app.listen(PORT,() => {
    console.log('server started at PORT:' + PORT)
})