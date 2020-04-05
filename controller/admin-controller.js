const authenticator = require('../service/authenticator');
const NewPost = require('../utils/NewPost');
const Themes = require('../service/themes')
const themes = new Themes()

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const fs = require('fs')

module.exports = class AdminController {
    constructor(blogPostService) {
        this.blogPostService = blogPostService
        this.theme = themes.createThemePath()
    }

    getTheme() {
        return this.theme
    }

    getDashboard(req, res) {
        res.render('admin', { layout: 'main', css: this.getTheme() })
    }

    async getPosts(req, res) {

        res.render('admin-post-list', {
            layout: 'blog',
            title: 'Blog Title',
            posts: await this.blogPostService.findAllPosts(),
            archive: await this.blogPostService.createArchive(),
            css: this.theme
        });
    }

    async getPost(req, res) {
        const id = req.params.id;
        const post = await this.blogPostService.findPostById(id);
        res.render('admin-edit-post', {
            layout: 'blog',
            title: post.title,
            post,
            archive: await this.blogPostService.createArchive(),
            css: this.theme
        })
    }

    async updatePost(req, res) {
        const id = req.params.id;
        const { title, slug, content, draft } = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;

        const updatedPost = (draft) ? new NewPost(id, title, slug, author, new Date().toLocaleString().split(',')[0], null, content, true) : new NewPost(id, title, slug, author, new Date().toLocaleString().split(',')[0], new Date(), content, false)
        if (draft) await this.blogPostService.updatePostAsDraft(updatedPost, id)
        else await this.blogPostService.updatePost(updatedPost, id)
        res.redirect('/adminPostList')
    }

    getDBSettings(req, res) {
        let { success, error } = req.query
        let success1, success2, error1, error2;
        if (success == 1) success1 = 'Please restart the server to start to use the selected database'
        if (error == 1) error1 = 'We are sorry, but we can not change the database'
        if (success == 2) success2 = 'The configuration of MongoDB Connection successfully has been changed'
        if (error == 2) error2 = 'Weare sorry, but the provided details were not correct'
        res.render('select-database', { 
            layout: 'main', 
            success1, 
            error1, 
            success2, 
            error2, 
            css: this.theme 
        })
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

    async findThemes(req, res) {
        const { error } = req.query
        let themeList;
        try {
            themeList = await themes.findThemes()
        } catch (error) {
            console.log(error)
        }
        res.render('select-theme', { layout: 'main', themeList, error, css: this.theme })
    }

    setTheme(req, res) {
        const { selectedTheme } = req.body;
        try {
            themes.setTheme(selectedTheme)
            this.theme = themes.createThemePath(selectedTheme)
            res.redirect('/admin')
        } catch (error) {
            console.log(error)
            res.redirect('/admin?error=true')
        }
        // if (result === true) res.redirect('/selectTheme?success=true')
        // else res.redirect('/selectTheme?error=true')
    }

}


