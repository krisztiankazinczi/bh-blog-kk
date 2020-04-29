const express = require('express');
const exphbs = require('express-handlebars');

const BlogPostService = require('./service/blog-post-service')
const BlogController = require('./controller/blog-controller')

const LoginController = require('./controller/login-controller')
const AdminController = require('./controller/admin-controller')

const UserService = require('./service/user-service')

const ThemeService = require('./service/theme-service')

const ResetPwTokenService = require('./service/reset-pw-token-service')

const EmailService = require('./service/email-service')

const authMiddleware = require('./middlewares/authMiddleware')
const isAdminMiddleware = require('./middlewares/is-admin-middleware')

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

let adminController, blogController, loginController;

if (selectedDb === 'mongodb') {
    const mongoDB = require('./repository/mongo-wrapper')
    const PostRepositoryMongo = require('./repository/posts-repository-mongo')
    adminController = new AdminController(new BlogPostService(new PostRepositoryMongo(new mongoDB())), new ThemeService() );
    blogController = new BlogController(new BlogPostService(new PostRepositoryMongo(new mongoDB())), new ThemeService());
} else if (selectedDb === 'sqlite3') {
    const DB = require('./repository/db-wrapper');
    const PostRepository = require('./repository/posts_repository')
    const UserRepository = require('./repository/user-repository')
    const Authenticator = require('./service/authenticator');

    loginController = new LoginController( new ThemeService(), new Authenticator( new UserRepository( new DB() ) ), new ResetPwTokenService(), new UserService( new UserRepository( new DB() ) ), new EmailService() );
    blogController = new BlogController( new BlogPostService( new PostRepository( new DB() ) ), new ThemeService() );
    adminController = new AdminController( new BlogPostService( new PostRepository( new DB() ) ), new ThemeService(), new UserService( new UserRepository( new DB() ) ) );
} else {
    console.log('there must be a mistake in the config file, because we have no db like this')
}



    

    app.get('/postList', blogController.get.bind(blogController));
    app.get('/post/:idOrSlug', blogController.getPost.bind(blogController));
    app.get('/newPost', authMiddleware, blogController.getAddPost.bind(blogController));
    app.post('/newPost', authMiddleware, blogController.post.bind(blogController));
    app.post('/draft', authMiddleware, blogController.draft.bind(blogController));
    app.get('/tag/:id', blogController.getPostsByTag.bind(blogController))

    app.get('/login', loginController.get.bind(loginController));
    app.post('/login', loginController.post.bind(loginController));
    app.get('/forgot', loginController.forgotPw.bind(loginController))
    app.post('/forgot', loginController.resetPwEmail.bind(loginController))
    app.get('/forgot/change', loginController.changePwPage.bind(loginController))
    app.post('/forgot/change', loginController.changePassword.bind(loginController))

    app.get('/admin', authMiddleware, adminController.getDashboard.bind(adminController));
    app.get('/adminPostList', authMiddleware, adminController.getPosts.bind(adminController));
    app.get('/editPost/:id', authMiddleware, adminController.getPost.bind(adminController));
    app.post('/updatePost/:id', authMiddleware, adminController.updatePost.bind(adminController));
    app.get('/setDatabase', authMiddleware, isAdminMiddleware, adminController.getDBSettings.bind(adminController))
    app.post('/selectDatabase', authMiddleware, isAdminMiddleware, adminController.setDB)
    app.post('/configureMongoDB', authMiddleware, isAdminMiddleware, adminController.configureMongoDB)
    app.get('/selectTheme', authMiddleware, isAdminMiddleware, adminController.findThemes.bind(adminController))
    app.post('/selectTheme', authMiddleware, isAdminMiddleware, adminController.setTheme.bind(adminController))
    app.post('/installTheme', authMiddleware, isAdminMiddleware, adminController.installTheme.bind(adminController))
    app.get('/accounts', authMiddleware, isAdminMiddleware, adminController.findAccounts.bind(adminController))
    app.get('/account', authMiddleware, isAdminMiddleware, adminController.account.bind(adminController))
    app.get('/account/:id', authMiddleware, isAdminMiddleware, adminController.account.bind(adminController))
    app.post('/registerNewUser', authMiddleware, isAdminMiddleware, adminController.createNewAccount.bind(adminController))
    app.post('/editUser/:id', authMiddleware, isAdminMiddleware, adminController.editAccount.bind(adminController))

    app.get('/logout', authMiddleware, loginController.logout)




    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
