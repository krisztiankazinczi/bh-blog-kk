const NewPost = require('../utils/NewPost');
// const authenticator = require('../service/authenticator');
const { validateNewPost } = require('./validation/new-post-validation');

const slugify = require('slugify')

module.exports = class BlogController {
    constructor(blogPostService, themeService, authenticator) {
        this.blogPostService = blogPostService;
        this.themeService = themeService
        this.authenticator = authenticator
    }

    async get(req, res) {
        const { searchFor } = req.query;
        const blogs = (searchFor) ? await this.blogPostService.findSearchedFor(searchFor) : await this.blogPostService.findAllPosts()
        res.render('post-list', {
            layout: 'blog',
            title: 'Blog Title',
            blogs: blogs,
            archive: await this.blogPostService.createArchive(),
            tags: await this.blogPostService.findTags(),
            css: this.themeService.createThemePath()
        });
    }

    async getPost(req, res) {
        const { idOrSlug } = req.params;
        let post = (idOrSlug.includes('-')) ? await this.blogPostService.findPostBySlug(idOrSlug, 1) : await this.blogPostService.findPostById(idOrSlug);
        // if slug have been changed since it was bookmarked, I will try to find the new slug and load that page
        if (!post) post = await this.blogPostService.findPostBySlug(idOrSlug, 0)
        if (post) await this.blogPostService.findPostById(post.id)
        let error = false;
        if (!post) error = true 
        res.render('read-post-view', {
            layout: 'blog',
            // title: post.title,
            post,
            archive: await this.blogPostService.createArchive(),
            tags: await this.blogPostService.findTags(),
            css: this.themeService.createThemePath(),
            error
        })
    }

    async getAddPost(req, res) {
        const error = createErrorObjectForAddPost(req.query);

        res.render('add-new-post', {
            layout: 'summernote',
            error,
            tags: await this.blogPostService.findTags(),
            css: this.themeService.createThemePath()
        });
    }


    async post(req, res) {
      //if there is no tag selected, the findBYId function wont work, since it's an inner join with tags_in_post table
        const { title, content } = req.body;

        let  { slug, tags} = req.body;

        if (typeof tags === 'string') tags = [tags]

        const author = this.authenticator.findUserBySession(req.cookies.ssid).username;

        const validateForm = validateNewPost(title, slug, content)

        if (validateForm) res.redirect(`/newPost?error=${validateForm[0]}&titleVal=${validateForm[1]}&slugVal=${validateForm[2]}&contentVal=${validateForm[3]}`);
        else {
            const correctSlug = checkSlugCorrectness(slug)
            if (!correctSlug) slug = slugify(title)
            if (!slug.includes('-') && slug.length > 0) slug += '-' // I need this dash, because of getPost(idOrSlug) function needs a dash to identify if it's a slug or id
            const newPost = new NewPost(undefined, title, slug, author, new Date(), new Date(), content, 0, tags)
            await this.blogPostService.createPost(newPost);
            res.redirect('/postList')
        }
    }

    async draft(req, res) {
        const { title, slug, content } = req.body;
        let { tags } = req.body;

        if (typeof tags === 'string') tags = [tags]

        const author = this.authenticator.findUserBySession(req.cookies.ssid).username;
        const newPost = new NewPost(undefined, title, slug, author, new Date(), 0, content, 1, tags)
        await this.blogPostService.createDraft(newPost);
        res.redirect('/adminPostList');
    }


    async getPostsByTag(req, res) {
        const {id} = req.params
        const blogs = await this.blogPostService.findPostsByTag(id)
        res.render('post-list', {
            layout: 'blog',
            title: 'Post Title',
            blogs,
            archive: await this.blogPostService.createArchive(),
            tags: await this.blogPostService.findTags(),
            css: this.themeService.createThemePath()
        })
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