const NewPost = require('../utils/NewPost');
const authenticator = require('../service/authenticator');
const { validateNewPost } = require('./validation/new-post-validation');

const slugify = require('slugify')

module.exports = class BlogController {
    constructor(blogPostService, themeService) {
        this.blogPostService = blogPostService;
        this.themeService = themeService
    }

    async get(req, res) {
        const { searchFor } = req.query;
        const blogs = (searchFor) ? await this.blogPostService.findSearchedFor(searchFor) : await this.blogPostService.findAllPosts()
        res.render('post-list', {
            layout: 'blog',
            title: 'Blog Title',
            blogs: blogs,
            archive: await this.blogPostService.createArchive(),
            css: this.themeService.createThemePath()
        });
    }

    async getPost(req, res) {
        const { idOrSlug } = req.params;
        const post = (idOrSlug.includes('-')) ? await this.blogPostService.findPostBySlug(idOrSlug) : await this.blogPostService.findPostById(idOrSlug);
        res.render('read-post-view', {
            layout: 'blog',
            title: post.title,
            post,
            archive: await this.blogPostService.createArchive(),
            css: this.themeService.createThemePath()
        })
    }

    getAddPost(req, res) {
        const error = createErrorObjectForAddPost(req.query);

        res.render('add-new-post', {
            layout: 'main',
            error,
            css: this.themeService.createThemePath()
        });
    }


    async post(req, res) {
        const { title, content } = req.body;
        let  { slug } = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;

        const validateForm = validateNewPost(title, slug, content)

        if (validateForm) res.redirect(`/newPost?error=${validateForm[0]}&titleVal=${validateForm[1]}&slugVal=${validateForm[2]}&contentVal=${validateForm[3]}`);
        else {
            const correctSlug = checkSlugCorrectness(slug)
            if (!correctSlug) slug = slugify(title)
            const newPost = new NewPost(undefined, title, slug, author, new Date().toLocaleString().split(',')[0], new Date(), content, false)
            await this.blogPostService.createPost(newPost);
            res.redirect('/postList')
        }
    }

    async draft(req, res) {
        const { title, slug, content } = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;
        const newPost = new NewPost(undefined, title, slug, author, new Date().toLocaleString().split(',')[0], null, content, true)
        await this.blogPostService.createDraft(newPost);
        res.redirect('/adminPostList');
    }
}


/**
 * 
 * @param {req.query} query 
 */
function createErrorObjectForAddPost(query) {
    const errorAndValue = {
        title_slug_content: false,
        title_slug: false,
        slug_content: false,
        title_content: false,
        title: false,
        titleValue: false,
        slug: false,
        slugValue: false,
        content: false,
        contentValue: false
    }
    if (query.error) {
        if (query.error === 'title_slug_content') errorAndValue.title_content = 'Error! Title, Slug and Content are mandatory and the minimum length of these are 5 characters!';
        else if (query.error === 'title_slug') errorAndValue.title_content = 'Error! Both Title and Slug are mandatory and the minimum length of these are 5 character!';
        else if (query.error === 'title_content') errorAndValue.title_content = 'Error! Both Title and Content are mandatory and the minimum length of these are 5 character!';
        else if (query.error === 'slug_content') errorAndValue.title_content = 'Error! Both Content and Slug are mandatory and the minimum length of these are 5 character!';
        else if (query.error === 'title') errorAndValue.title = 'Error! Title is mandatory and the minimum length is 5 character!';
        else if (query.error === 'slug') errorAndValue.title = 'Error! Slug is mandatory and the minimum length is 5 character!';
        else if (query.error === 'content') errorAndValue.content = 'Error! Content is mandatory and the minimum length is 5 character!';
        errorAndValue.titleValue = query.titleVal;
        errorAndValue.slugValue = query.slugVal;
        errorAndValue.contentValue = query.contentVal;
    }
    return errorAndValue;
}

function checkSlugCorrectness(slug) {
    const regexp = /^[a-zA-Z0-9-]+$/;
    if (slug.search(regexp) === -1) return false
    else return true
}