const PostDAO = require('../dao/posts_dao');
postDAO = new PostDAO();


module.exports = class AdminController {
    getDashboard(req,res) {
        res.render('admin', {layout: 'main'})
    }

    async getPosts(req, res) {
        res.render('admin-post-list', {
            layout: 'blog',
            title: 'Blog Title',
            posts: await postDAO.getAllPosts()
        });
    }

    async getPost(req, res) {
        const id = req.params.id;
        const post = await postDAO.getPostById(id);
        res.render('admin-edit-post', {
            layout: 'blog',
            title: post.title,
            post: post
        })
    }

    async updatePost(req, res) {
        const id = req.params.id;
        const { title, slug, content } = req.body;
        
        await postDAO.updatePost(title, slug, new Date().toLocaleString().split(',')[0], content, id)
        res.redirect('/postList')
        //(draft) ? res.redirect('/adminPostList') : res.redirect('/postList');
        
    }

    async saveAsDraft(req, res) {
        const id = req.params.id;
        const { title, slug, content} = req.body;
        console.log(title, slug, content, id)
        await postDAO.updatePostAsDraft(title, slug, new Date().toLocaleString().split(',')[0], content, id)
        res.redirect('/adminPostList');
    }
}

