const { Router } = require('express')
const User = require('../models/user')
const multer = require('multer')
const path = require('path');
const { validateToken, createTokenforUser } = require('../services/auth');
const Blog=require('../models/blog')
const Comment=require('../models/comment')
const router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/images'))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})


const upload = multer({ storage: storage })
router.get('/signin', (req, res) => {
    return res.render('signin')
})
router.get('/signup', (req, res) => {
    return res.render('signup')
})
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
        profileImageURL: "/images/default.png" 
    });
    return res.redirect('/user/signin');
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
   
    try {
        //virtual function
        const token = await User.matchPasswordandGeneratetoken(email, password);

        // console.log('User', token);
        return res.cookie('token', token).redirect('/');
    }
    catch {
        return res.render('signin', {
            error: "Incorrect Email or Password",
        })
    }

})


router.get('/profile', (req, res)=>{
    // console.log(req.user);
    return res.render("profile",{
        user: req.user,
        editable: true
    });
})

router.post('/profile', upload.single('profileImage'), async (req, res) => {
    // const tokenCookieval=req.cookies?.token;
    //     const user=validateToken(tokenCookieval);
     const user=req.user;
    //  console.log(user);
    
    if (!req.file) {
        return res.render("profile", {
            user: user,
            editable:true,
            error: "No file uploaded",
        });
    }

    const profileImageURL=`/images/${req.file.filename}`
    await User.findByIdAndUpdate(user._id, {profileImageURL})
   const updateduser= await User.findById(user._id);
   const token = await createTokenforUser(updateduser)

   // Set the new token in the cookie
   res.cookie('token', token);
    req.user=updateduser
    // console.log(req.user);
    return res.render("profile", {
        user: req.user,
        editable:true,
    });
  });
router.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/')
})


router.get('/blogs/:id', async(req, res)=>{
    const blogs= await Blog.find({createdBy:req.params.id});
    if(blogs.length<1){ 
        req.flash('error_msg', 'No blogs to show');
        return res.redirect('/blog/add-new')
         
    }
   else return res.render("home",{
        blogs:blogs,
        user:req.user,
    })
})

router.get('/profile/:Id', async(req, res)=>{
    // console.log(req.params.Id);
    const user= await User.findById( req.params.Id)
    // console.log(comments);
    if(!user){
        return res.status(404).send("User not found");
    }
    if(req.user && req.user._id.toString()===req.params.Id){
        return res.render('profile', {
            user:user,
            editable:true,
        })

    }
    else{
        return res.render('profile', {
            user:user,
            editable:false,
        })
    }

    // // console.log(person);
    // const person=comments.createdBy;
    // console.log("person",person);
    // return res.render('profileSecondary', {
    //     user:person
    // })
})  

module.exports = router