const PostDAO = require('../dao/posts_dao');
const NewPost = require('../utils/NewPost');
const authenticator = require('../service/authenticator');
const {validateNewPost} = require('./validation/new-post-validation');

const postDAO = new PostDAO();


module.exports = class BlogController {
    async get(req, res) {
        res.render('post-list', {
            layout: 'blog',
            title: 'Blog Title',
            blogs: await postDAO.getAllPosts()
        });
    }

    async getPost(req, res) {
        const { idOrSlug } = req.params;
        const post = (isNaN(+idOrSlug)) ? await postDAO.getPostBySlug(idOrSlug) : await postDAO.getPostById(idOrSlug);

        res.render('read-post-view', {
            layout: 'blog',
            title: post.title,
            post
        })
    }

    getAddPost(req, res) {
        const error = createErrorObjectForAddPost(req.query);

        res.render('add-new-post', {
            layout: 'main',
            error
        });
    }


    async post(req, res) {
        const {title, content, slug} = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;

        const validateForm = validateNewPost(title, slug, content)
        
        if (validateForm) res.redirect(`/newPost?error=${validateForm[0]}&titleVal=${validateForm[1]}&slugVal=${validateForm[2]}&contentVal=${validateForm[3]}`);
        else {
            const newPost = new NewPost(title, slug, author, content);
            await postDAO.createPost(newPost);
            res.redirect('/postList')  
        }
    }

    async draft(req, res) {
        const {title, slug, content} = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;
        const newPost = new NewPost(title, slug, author, content);
        await postDAO.createDraft(newPost);
        res.redirect('/postList'); 
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