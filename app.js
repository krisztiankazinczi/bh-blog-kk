const express = require('express');
const exphbs = require('express-handlebars');

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

const selectedDb = process.env.SELECTED_DB

let adminController, blogController;

if (+selectedDb === 1) {
    const mongoDB = require('./repository/mongo-wrapper')
    const PostRepositoryMongo = require('./repository/posts-repository-mongo')
    adminController = new AdminController(new BlogPostService(new PostRepositoryMongo(new mongoDB())));
    blogController = new BlogController(new BlogPostService(new PostRepositoryMongo(new mongoDB())));
} else if (+selectedDb === 0) {
    const DB = require('./repository/db-wrapper');
    const PostRepository = require('./repository/posts_repository')
    blogController = new BlogController( new BlogPostService( new PostRepository( new DB() ) ) );
    adminController = new AdminController( new BlogPostService( new PostRepository( new DB() ) ) );
} else {
    console.log('there must be a mistake in the config file, because we have no db like this')
}



const loginController = new LoginController();
    

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
    app.get('/setDatabase', authMiddleware, adminController.getDBSettings)
    app.post('/selectDatabase', authMiddleware, adminController.setDB)
    app.post('/configureMongoDB', authMiddleware, adminController.configureMongoDB)

    app.get('/logout', authMiddleware, loginController.logout)




    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
