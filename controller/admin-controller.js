const authenticator = require('../service/authenticator');
const NewPost = require('../utils/NewPost');

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const fs = require('fs')

module.exports = class AdminController {
    constructor(blogPostService) {
        this.blogPostService = blogPostService
    }

    getDashboard(req, res) {
        res.render('admin', { layout: 'main' })
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

        const updatedPost = (draft) ? new NewPost(id, title, slug, author, new Date().toLocaleString().split(',')[0], null, content, true) : new NewPost(id, title, slug, author, new Date().toLocaleString().split(',')[0], new Date(), content, false)
        // (draft) ? await this.blogPostService.updatePostAsDraft(updatedPost, id) : await this.blogPostService.updatePost(updatedPost, id);
        if (draft) await this.blogPostService.updatePostAsDraft(updatedPost, id)
        else await this.blogPostService.updatePost(updatedPost, id)
        res.redirect('/adminPostList')
    }

    getDBSettings(req, res) {
        let { success, error } = req.query
        let success1, success2, error1, error2;
        if (success == 1)  success1 = 'Please restart the server to start to use the selected database'
        if (error == 1)  error1 = 'We are sorry, but we can not change the database'
        if (success == 2)  success2 = 'The configuration of MongoDB Connection successfully has been changed'
        if (error == 2)  error2 = 'Weare sorry, but the provided details were not correct'
        res.render('select-database', { layout: 'main', success1, error1, success2, error2 })
    }

    setDB(req, res) {
        const { db } = req.body

        let configFile = fs.readFileSync('./config.env').toString()
        configFile = configFile.replace(`SELECTED_DB=${process.env.SELECTED_DB}`, `SELECTED_DB=${db}`)
        fs.writeFileSync('./config.env', configFile, err => {
            if (err) {
                console.error(err)
                res.redirect('/setDatabase?error=1')
                return
            }
            
        })
        res.redirect('/setDatabase?success=1')

    }

    configureMongoDB(req, res) {
        const { url, username, password } = req.body;
        console.log(username, password)
        let configFile = fs.readFileSync('./config.env').toString()
        configFile = configFile.replace(`DATABASE=${process.env.DATABASE}`, `DATABASE=${url}`)
        configFile = configFile.replace(`DATABASE_USERNAME=${process.env.DATABASE_USERNAME}`, `DATABASE=${username}`)
        configFile = configFile.replace(`DATABASE_PASSWORD=${process.env.DATABASE_PASSWORD}`, `DATABASE=${password}`)
        fs.writeFileSync('./config.env', configFile, err => {
            if (err) {
                console.error(err)
                res.redirect('/setDatabase?error=2')
                return
            }
            
        })
        res.redirect('/setDatabase?success=2')
    }


}


