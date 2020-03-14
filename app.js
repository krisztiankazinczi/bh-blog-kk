const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded( { extended: true} ) );

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

const blogs = require('./model/posts.js')




app.get('/', (req, res) => {
    res.render('post-list', {
        title: 'Blog Title',
        blogs: blogs
    })
})





app.listen(port, () => console.log(`Example app listening on port ${port}!`));
