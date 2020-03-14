const express = require('express');
const exphbs  = require('express-handlebars');

const LoginController = require('./controller/login-controller')
const AdminController = require('./controller/admin-controller')
const BlogController = require('./controller/blog-controller')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded( { extended: true} ) );

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))




const loginController = new LoginController();
const adminController = new AdminController();
const blogController = new BlogController();


app.get('/', blogController.get);

app.get('/login', loginController.get);
app.post('/login', loginController.post);

app.get('/admin', adminController.get);





app.listen(port, () => console.log(`Example app listening on port ${port}!`));
