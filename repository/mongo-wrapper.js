const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')

console.log(process.env.DATABASE)

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(con => console.log('db connection successfull'))


const postSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    slug: { type: String, unique: true },
    author: String,
    last_modified_at: { type: String, required: [true, 'The post should be a last_modified_at value!'] },
    published_at: Number,
    content: String,
    draft: Boolean
})

const Post = mongoose.model('Post', postSchema)

module.exports = class DB_Mongo {
    find() {
        return new Promise((resolve, reject) => {
            Post.find((err, doc) => {
                if (err) {
                    console.log(err)
                    reject(err);
                    return
                }
                resolve(doc)
            })
        })
    }

    findBy(filter) {
        return new Promise((resolve, reject) => {
            Post.find(filter, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(doc)
            })
        })
    }

    createDoc(newPost) {

        const createPost = new Post({
            title: newPost.title,
            slug: newPost.slug,
            author: newPost.author,
            last_modified_at: newPost.last_modified_at,
            published_at: newPost.published_at,
            content: newPost.content,
            draft: newPost.draft
        })
        return new Promise((resolve, reject) => {
            createPost.save((err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(doc)
            })
        })
    }

    // findOne(filter) {
    //     return new Promise((resolve, reject) => {
    //         Post.find(filter, (err, doc) => {
    //             if (err) {
    //                 reject(err);
    //                 return
    //             }
    //             console.log(doc)
    //             resolve(doc)
    //         })
    //     })
    // }

    async findOneAndUpdate(filter, update) {

        try {
            const result = await this.findBy(filter)
            // console.log(result.published_at)

            const updatePost = {
                _id: update.id,
                title: update.title,
                slug: update.slug,
                author: update.author,
                last_modified_at: update.last_modified_at,
                content: update.content,
                draft: update.draft
            }
            if (result.published_at) updatePost.published_at = result.published_at
            else if (!result.published_at && updatePost.draft === false) updatePost.published_at = new Date();
            else updatePost.published_at = result.published_at
            // console.log(updatePost.published_at)
            return new Promise((resolve, reject) => {
                Post.findOneAndUpdate(filter, updatePost, { new: true, runValidators: true }, (err, doc) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    // console.log(doc)
                    resolve(doc)
                })
            })
        } catch(error) {
        console.log(error)
    }

    }


}

