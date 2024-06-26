const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { log } = require('console');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    return res.render('addblog', {
        user: req.user,
    });
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `${req.file.filename}`
    });

    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid Blog ID');
    }

    try {
        const blog = await Blog.findById(id).populate('createdBy');
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        


// console.log(blog);
        const comments = await Comment.find({ blogId: id }).populate('createdBy');
        // console.log(comments);
        return res.render('blog', {
            user: req.user,
            blog,
            comments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/comment/:blogId', async (req, res) => {
    const { blogId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).send('Invalid Blog ID');
    }

    try {
        await Comment.create({
            content: req.body.content,
            blogId: blogId,
            createdBy: req.user._id,
        });
        return res.redirect(`/blog/${blogId}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
