const blogs = require('../model/posts');

module.exports = class BlogController {
    get(req, res) {
        res.render('post-list', {
            title: 'Blog Title',
            blogs: blogs
        });
    }
}