const NewPost = require('../utils/NewPost')

module.exports = class PostRepository {
    constructor(db) {
        this.db = db;
    }


    async findAllPosts() {
        try {
            let allPosts = await this.db.find();
            allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async findSearchedFor(searchFor) {
        const filter = { "content": { "$regex": searchFor, "$options": "i" } }
        try {
            let allPosts = await this.db.findBy(filter);
            allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async findPostBySlug(slug) {
        const filter = {slug}
        try {
            let post = await this.db.findBy(filter);
            post = new NewPost(post[0].id, post[0].title, post[0].slug, post[0].author, post[0].last_modified_at, post[0].published_at, post[0].content, post[0].draft)
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async findPostById(id) {
        const filter = { _id: id }
        try {
            let post = await this.db.findBy(filter);
            post = new NewPost(post[0].id, post[0].title, post[0].slug, post[0].author, post[0].last_modified_at, post[0].published_at, post[0].content, post[0].draft)
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(newPost) {
        try {
            await this.db.createDoc(newPost)
        } catch (error) {
            console.error(error);
        }
    }

    async createDraft(newPost) {
        try {
            await this.db.createDoc(newPost)
        } catch (error) {
            console.error(error);
        }
    }


    async updatePost(updatedPost, id) {
        const filter = {_id : id}
        try {
            await this.db.findOneAndUpdate(filter, updatedPost)
        } catch (error) {
            console.error(error);
        }
    }

    async updatePostAsDraft(updatedPost, id) {
        const filter = {_id : id}
        try {
            await this.db.findOneAndUpdate(filter, updatedPost)
        } catch (error) {
            console.error(error);
        }
    }







    // async wasPublished(published_at) {
    //     const filter = {published_at}
    //     try {
    //         let post = await this.db.findBy(filter);
    //         post = new NewPost(post[0].id, post[0].title, post[0].slug, post[0].author, post[0].last_modified_at, post[0].published_at, post[0].content, post[0].draft)
    //         return post;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}