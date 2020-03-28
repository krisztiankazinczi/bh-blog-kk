const express = require('express');
const exphbs  = require('express-handlebars');

const LoginController = require('./controller/login-controller')
const AdminController = require('./controller/admin-controller')
const BlogController = require('./controller/blog-controller')
const authMiddleware = require('./middlewares/authMiddleware')

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded( { extended: true} ) );
app.use(require('cookie-parser')())

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))




const loginController = new LoginController();
const adminController = new AdminController();
const blogController = new BlogController();


app.get('/postList', blogController.get);
app.get('/post/:idOrSlug', blogController.getPost);
app.get('/newPost', authMiddleware, blogController.getAddPost);
app.post('/newPost', authMiddleware, blogController.post);
app.post('/draft', authMiddleware, blogController.draft);

app.get('/login', loginController.get);
app.post('/login', loginController.post).bind(loginController);

app.get('/admin', authMiddleware, adminController.getDashboard);
app.get('/adminPostList', authMiddleware, adminController.getPosts);
app.get('/editPost/:id', authMiddleware, adminController.getPost);
app.post('/updatePost/:id', authMiddleware, adminController.updatePost);

app.get('/logout', authMiddleware, loginController.logout)




app.listen(port, () => console.log(`Example app listening on port ${port}!`));
