const dotenv = require('dotenv')
console.log(process.env)
dotenv.config({ path: '../config.env' })

const posts = require('../data/posts')
console.log(process.env.DATABASE)

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false); // ez kell a findOneAndUpdate methodhoz

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
//Mongoose connection is a Promise!!
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
    .then(con => console.log('db connection successfull'))


// const postSchema = new mongoose.Schema({
//     title: { type: String, unique: true },
//     slug: { type: String, unique: true },
//     author: String,
//     last_modified_at: { type: String, required: [true, 'The post should be a last_modified_at value!'] },
//     published_at: Number,
//     content: String,
//     draft: Boolean
// })

// const Post = mongoose.model('Post', postSchema)

// posts.forEach( post => {
//     const createPost = new Post({
//         title: post.title,
//         slug: post.slug,
//         author: post.author,
//         last_modified_at: post.last_modified_at,
//         published_at: post.published_at,
//         content: post.content,
//         draft: false
//     })
//     createPost.save().then(doc => {
//         console.log(doc)
//     }).catch( err => console.log(err))

// })

// async function findAllPosts() {
//     const posts = await Post.find();
//     console.log(posts)
// }

// findAllPosts()

// async function findPost() {
//     const post = await Post.find({ 'author': 'Monika' })
//     console.log(post)
// }

// findPost();

// const filter = {author: 'Moni'}
// const updated = {author: 'Monika'}




// const filter = { author: 'Monika' }
// const newData = {
//     author: posts[3].author,
//     last_modified_at: posts[3].last_modified_at,
//     published_at: posts[3].published_at,
//     content: posts[3].content,
//     draft: true
// }

// async function update() {
//     const post = await Post.findOneAndUpdate(
//         filter,
//         newData,
//         {
//             new: true,
//             runValidators: true // ez csekkolja, hogy a schemaval osszhangban akarunk e valtoztatni
//         }
//     )
// }

// update()


// async function filter() {
//     const posts = await Post.find({draft: false});
//     console.log(posts)
// }
// filter()