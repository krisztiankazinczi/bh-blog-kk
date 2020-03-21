const blogs = require('../App_Data/posts');
const PostDAO = require('../dao/posts_dao');

const postDAO = new PostDAO();

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
    async get(req, res) {
        res.render('post-list', {
            title: 'Blog Title',
            blogs: await postDAO.getAllPosts()
        });
    }
    //add new post
    getAddPost(req, res) {
        res.render('add-new-post', {layout: 'main-login'});
    }

    // add new post
    async post(req, res) {
        const {post_title, post_author, post_content} = req.body;

        if (!post_title || post_title.length < 5) {
            res.send('Title')
            return
        }
        if (!post_content || post_content.length < 5) {
            res.send('Content')
            return
        }
        if (!post_content && !post_title || !post_content && post_title.length < 5 || !post_title && post_content.length < 5) {
            res.send('Both')
            return
        }


        if (post_title && post_content && post_title.length >= 5 && post_content.length >= 5 ) {
            const newPost = new Post(post_title, post_author, post_content);
            await postDAO.createPost([newPost.title, newPost.author, newPost.created_at, newPost.content]);
            res.redirect('/postList')
        } 
        
        
    }
}