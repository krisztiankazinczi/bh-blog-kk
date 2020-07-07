const express = require('express');
const exphbs = require('express-handlebars');

const BlogPostService = require('./service/blog-post-service')
const BlogController = require('./controller/blog-controller')

const LoginController = require('./controller/login-controller')
const AdminController = require('./controller/admin-controller')

const authMiddleware = require('./middlewares/authMiddleware')
const isAdminMiddleware = require('./middlewares/is-admin-middleware')
const isSuperAdminMiddleware = require('./middlewares/is-super-admin-middleware')

const loginFactory = require('./service/factories/login-factory')
const postFactory = require('./service/factories/post-factory')
const adminFactory = require('./service/factories/admin-factory')

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
    loginController = loginFactory.getLoginController()
    blogController = postFactory.getBlogController()
    adminController = adminFactory.getAdminController()
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
    app.get('/setDatabase', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.getDBSettings.bind(adminController))
    app.post('/selectDatabase', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.setDB)
    app.post('/configureMongoDB', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.configureMongoDB)
    app.get('/selectTheme', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.findThemes.bind(adminController))
    app.post('/selectTheme', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.setTheme.bind(adminController))
    app.post('/installTheme', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.installTheme.bind(adminController))
    app.get('/accounts', authMiddleware, isAdminMiddleware, adminController.findAccounts.bind(adminController))
    app.get('/account', authMiddleware, isAdminMiddleware, adminController.account.bind(adminController))
    app.get('/account/:id', authMiddleware, isAdminMiddleware, adminController.account.bind(adminController))
    app.post('/registerNewUser', authMiddleware, isAdminMiddleware, adminController.createNewAccount.bind(adminController))
    app.post('/editUser/:id', authMiddleware, isAdminMiddleware, adminController.editAccount.bind(adminController))
    app.get('/config', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.getConfigView.bind(adminController))
    app.post('/pageConfig', authMiddleware, isAdminMiddleware, isSuperAdminMiddleware, adminController.setConfig.bind(adminController))

    app.get('/logout', authMiddleware, loginController.logout)

    app.get('/serverError', blogController.serverErrorPage)
    app.get('*', blogController.render404Page)




    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
