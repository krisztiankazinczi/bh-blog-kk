const BlogPostService = require('../service/blog-post-service')
const authenticator = require('../service/authenticator');
const NewPost = require('../utils/NewPost');

module.exports = class AdminController {
    constructor(blogPostService) {
        this.blogPostService = blogPostService
    }
    
    getDashboard(req,res) {
        res.render('admin', {layout: 'main'})
    }

    async getPosts(req, res) {
        res.render('admin-post-list', {
            layout: 'blog',
            title: 'Blog Title',
            posts: await this.blogPostService.findAllPosts(),
            archive: await this.blogPostService.createArchive()
        });
    }

    async getPost(req, res) {
        const id = req.params.id;
        const post = await this.blogPostService.findPostById(id);
        res.render('admin-edit-post', {
            layout: 'blog',
            title: post.title,
            post,
            archive: await this.blogPostService.createArchive()
        })
    }

    async updatePost(req, res) {
        const id = req.params.id;
        const { title, slug, content, draft } = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;

        const updatedPost = new NewPost(title, slug, author, content);
        
        (draft) ? await this.blogPostService.updatePostAsDraft(updatedPost, id) : await this.blogPostService.updatePost(updatedPost, id);
        res.redirect('/adminPostList')   
    }
}

