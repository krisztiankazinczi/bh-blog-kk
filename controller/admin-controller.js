const BlogPostService = require('../service/blog-post-service')
const authenticator = require('../service/authenticator');
const NewPost = require('../utils/NewPost');
const blogPostService = new BlogPostService();


module.exports = class AdminController {
    getDashboard(req,res) {
        res.render('admin', {layout: 'main'})
    }

    async getPosts(req, res) {
        res.render('admin-post-list', {
            layout: 'blog',
            title: 'Blog Title',
            posts: await blogPostService.findAllPosts(),
            archive: await blogPostService.createArchive()
        });
    }

    async getPost(req, res) {
        const id = req.params.id;
        const post = await blogPostService.findPostById(id);
        res.render('admin-edit-post', {
            layout: 'blog',
            title: post.title,
            post,
            archive: await blogPostService.createArchive()
        })
    }

    async updatePost(req, res) {
        const id = req.params.id;
        const { title, slug, content, draft } = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;

        const updatedPost = new NewPost(title, slug, author, content);
        
        (draft) ? await blogPostService.updatePostAsDraft(updatedPost, id) : await blogPostService.updatePost(updatedPost, id);
        res.redirect('/adminPostList')   
    }
}

