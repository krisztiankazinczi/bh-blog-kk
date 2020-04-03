const DB = require('./db-wrapper');

const NewPost = require('../utils/NewPost')

module.exports = class PostRepository {
    constructor(db) {
        this.db = db;
    }
    async findAllPosts() {
        const sqlGetAllPosts = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts ORDER BY published_at DESC'
        try {
            let allPosts = await this.db.all(sqlGetAllPosts);
            allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async findSearchedFor(searchFor) {
        searchFor = `%${searchFor}%`;
        const sqlGetAllFilteredPosts = `SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE content LIKE ? OR title LIKE ?`
        try {
            let allPosts = await this.db.all(sqlGetAllFilteredPosts, [searchFor, searchFor]);
            allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async findPostById(id) {
        const sqlGetPostById = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE id = ?'
        try {
            let post = await this.db.get(sqlGetPostById, [id]);
            post = new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft)
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async findPostBySlug(slug) {
        const sqlGetPostBySlug = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE slug = ?'
        try {
            let post = await this.db.get(sqlGetPostBySlug, [slug]); 
            post = new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft)
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(newPost) {
        const sqlcreateNewPost = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
        try {
            await this.db.run(sqlcreateNewPost, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, newPost.published_at, newPost.content, null])
        } catch (error) {
            console.error(error);
        }
    }

    async createDraft(newPost) {
        const sqlcreateNewDraft = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
        try {
            await this.db.run(sqlcreateNewDraft, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, null, newPost.content, 1])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePost(updatedPost, id) {
        const sqlUpdatePost = 'UPDATE posts SET title = ?, slug = ?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
        try {
            await this.db.run(sqlUpdatePost, [updatedPost.title, updatedPost.slug, updatedPost.last_modified_at, updatedPost.published_at, updatedPost.content, null, id])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePostAsDraft(updatedPost, id) {
        const sqlSavePostAsDraft = 'UPDATE posts SET title = ?, slug = ?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
        try {
            await this.db.run(sqlSavePostAsDraft, [updatedPost.title, updatedPost.slug, updatedPost.last_modified_at, null, updatedPost.content, "1", id])
        } catch (error) {
            console.error(error);
        }
    }
}