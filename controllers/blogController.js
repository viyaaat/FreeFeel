//blog_index,blog_details,blog_create_get,blog_create_post,blog_delete
const Blog = require('../models/blog');


const blog_index = (req, res) => {
    Blog.find().sort({
        createdAt: -1
    })
        .then((result) => {
            res.render('../project/pages/index', {
                title: 'blogs',
                blogs: result
            });
        })
        .catch((err) => {
            console.log(err);
        })
}
const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.findById(id).then((result) => {
        res.render('../project/pages/details', { blog: result, title: 'Blog Details' });
    })
        .catch((err) => {
            res.status(404).render('../project/pages/404.ejs', { title: 'blog not found' });
        });
}

const blog_create_get = (req, res) => {
    res.render('../project/pages/create', { title: 'create' });
}
const blog_create_post = (req, res) => {
    if (req.body.snippet == null || req.body.snippet == "") req.body.snippet = "unknown";
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = { blog_index, blog_details, blog_create_get, blog_create_post };