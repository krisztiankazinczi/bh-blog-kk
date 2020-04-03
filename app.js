const express = require('express');
const exphbs = require('express-handlebars');

const DB = require('./repository/db-wrapper');
const mongoDB = require('./repository/mongo-wrapper')
const PostRepository = require('./repository/posts_repository')
const PostRepositoryMongo = require('./repository/posts-repository-mongo')
const BlogPostService = require('./service/blog-post-service')
const BlogController = require('./controller/blog-controller')

const LoginController = require('./controller/login-controller')
const AdminController = require('./controller/admin-controller')

const authMiddleware = require('./middlewares/authMiddleware')

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')())

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))


const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const fs = require('fs')
// let configFile = fs.readFileSync('./config.env').toString()
// if (configFile.includes('TEST=1')) configFile.replace('TEST=1', 'TEST=0')
// if (configFile.includes('TEST=0')) configFile.replace('TEST=0', 'TEST=1')
// console.log(configFile.includes('TEST=1'))
// console.log(configFile.replace('TEST=1', 'TEST=0'))
// console.log(typeof configFile)

async function setDB() {
    let configFile = fs.readFileSync('./config.env').toString()
    if (configFile.includes('TEST=1')) configFile = configFile.replace('TEST=1', 'TEST=0')
    else configFile = configFile.replace('TEST=0', 'TEST=1')
    console.log(configFile)
    fs.writeFileSync('./config.env', configFile, err => {
        if (err) {
            console.error(err)
            return
        }
    })
}

// setDB()

const loginController = new LoginController();
    const adminController = new AdminController( new BlogPostService( new PostRepository( new DB() ) ) );
    // const adminController = new AdminController(new BlogPostService(new PostRepositoryMongo(new mongoDB())));
    const blogController = new BlogController( new BlogPostService( new PostRepository( new DB() ) ) );
    // const blogController = new BlogController(new BlogPostService(new PostRepositoryMongo(new mongoDB())));

    app.get('/postList', blogController.get.bind(blogController));
    app.get('/post/:idOrSlug', blogController.getPost.bind(blogController));
    app.get('/newPost', authMiddleware, blogController.getAddPost.bind(blogController));
    app.post('/newPost', authMiddleware, blogController.post.bind(blogController));
    app.post('/draft', authMiddleware, blogController.draft.bind(blogController));

    app.get('/login', loginController.get);
    app.post('/login', loginController.post).bind(loginController);

    app.get('/admin', authMiddleware, adminController.getDashboard);
    app.get('/adminPostList', authMiddleware, adminController.getPosts.bind(adminController));
    app.get('/editPost/:id', authMiddleware, adminController.getPost.bind(adminController));
    app.post('/updatePost/:id', authMiddleware, adminController.updatePost.bind(adminController));

    app.get('/logout', authMiddleware, loginController.logout)




    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
