require("dotenv").config();
const express= require('express')

const port=process.env.PORT||3001;

const path= require('path')

const session = require('express-session'); 
const flash = require('connect-flash');

const mongoose= require('mongoose');
const {checkForAuthentication}= require('./middlewares/authentication')
const cookieParser = require('cookie-parser')
const Blog= require('./models/blog')
const userRoute= require('./routes/user')
const blogRoute= require('./routes/blog')
const app=express();

mongoose.connect(process.env.MONGO_URL).then(e=>{
    console.log('monodb connected');
})
app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))


app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication("token"))
app.use(express.static('public'));
app.use(session({
    secret: 'penpen@',
    resave: false,
    saveUninitialized: true
}));
app.use(flash()); 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.get('/', async(req ,res)=>{
    const allblogs= await Blog.find({});//sortr it
    // console.log(req.user);
    res.render('home',{
        user: req.user,
        blogs:allblogs,
    })
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.listen(port, ()=>console.log("srver started"))