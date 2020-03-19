const blogs = require('../model/posts');

let idGenerator = 4;

class Post {
    constructor(title, author, content) {
        this.id = idGenerator++;
        this.title = title;
        this.author = author;
        this.created_at = new Date().toLocaleString().split(',')[0];
        this.content = content;
    }
}

module.exports = class BlogController {
    get(req, res) {
        res.render('post-list', {
            title: 'Blog Title',
            blogs: blogs
        });
    }
    //add new post
    getAddPost(req, res) {
        res.render('add-new-post', {layout: 'main-login'});
    }

    // add new post
    post(req, res) {
        const {post_title, post_author, post_content} = req.body;
        if (post_title && post_content && post_title.length >= 5 && post_content >= 5 ) {
            const newPost = new Post(post_title, post_author, post_content);
            blogs.push(newPost); 
        } 
        res.redirect('/postList')
        
    }
}