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
        const { id } = req.params;
        const post = await postDAO.getPost(id)
        res.render('read-post-view', {
            layout: 'blog',
            title: post[0].title,
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
        const {title, content} = req.body;
        const author = authenticator.findUserBySession(req.cookies.ssid).username;

        const validateForm = validateNewPost(title, content)
        
        if (validateForm) res.redirect(`/newPost?error=${validateForm[0]}&titleVal=${validateForm[1]}&contentVal=${validateForm[2]}`);
        else {
            const newPost = new NewPost(title, author, content);
            await postDAO.createPost(newPost);
            res.redirect('/postList')  
        }
    }
}


/**
 * 
 * @param {req.query} query 
 */
function createErrorObjectForAddPost(query) {
    const errorAndValue = {
        title_content: false,
        title: false,
        titleValue: false,
        content: false,
        contentValue: false
    }
    if (query.error) {
        if (query.error === 'title_content') errorAndValue.title_content = 'Error! Both Title and Content are mandatory and the minimum length of these are 5 characters!';
        else if (query.error === 'title') errorAndValue.title = 'Error! Title is mandatory and the minimum length is 5 character!';
        else if (query.error === 'content') errorAndValue.content = 'Error! Content is mandatory and the minimum length is 5 character!';
        errorAndValue.titleValue = query.titleVal;
        errorAndValue.contentValue = query.contentVal;
    }
    return errorAndValue;
}