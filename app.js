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


app.get('/postList', authMiddleware, blogController.get);
app.get('/post/:id', authMiddleware, blogController.getPost);
app.get('/newPost', authMiddleware, blogController.getAddPost);
app.post('/newPost', authMiddleware, blogController.post);

app.get('/login', loginController.get);
app.post('/login', loginController.post).bind(loginController);

app.get('/admin', authMiddleware, adminController.get);

app.get('/logout', authMiddleware, loginController.logout)




app.listen(port, () => console.log(`Example app listening on port ${port}!`));
