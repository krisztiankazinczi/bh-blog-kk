const DB = require('./db-wrapper');

const db = new DB();

module.exports = class PostsDAO {
    async getAllPosts() {
        const sqlGetAllPosts = 'SELECT id, title, slug, author, created_at, content, draft FROM posts'
        try {
            const allPosts = await db.all(sqlGetAllPosts);
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostById(id) {
        const sqlGetPostById = 'SELECT id, title, slug, author, created_at, content, draft FROM posts WHERE id = ?'
        try {
            const post = await db.get(sqlGetPostById, [id]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostBySlug(slug) {
        const sqlGetPostBySlug = 'SELECT id, title, slug, author, created_at, content, draft FROM posts WHERE slug = ?'
        try {
            const post = await db.get(sqlGetPostBySlug, [slug]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(newPost) {
        const sqlcreateNewPost = 'INSERT INTO posts(title, slug, author, created_at, content, draft) VALUES (?,?,?,?,?,?)';
        try {
            await db.run(sqlcreateNewPost, [newPost.title, newPost.slug, newPost.author, newPost.created_at, newPost.content, null])
        } catch (error) {
            console.error(error);
        }
    }

    async createDraft(newPost) {
        const sqlcreateNewDraft = 'INSERT INTO posts(title, slug, author, created_at, content, draft) VALUES (?,?,?,?,?,?)';
        try {
            await db.run(sqlcreateNewDraft, [newPost.title, newPost.slug, newPost.author, newPost.created_at, newPost.content, 1])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePost(title, slug, created_at, content, id) {
        const sqlUpdatePost = 'UPDATE posts SET title = ?, slug = ?, created_at = ?, content = ?, draft = ? WHERE id = ?'
        try {
            await db.run(sqlUpdatePost, [title, slug, created_at, content, null, id])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePostAsDraft(title, slug, created_at, content, id) {
        const sqlSavePostAsDraft = 'UPDATE posts SET title = ?, slug = ?, created_at = ?, content = ?, draft = ? WHERE id = ?'
        try {
            await db.run(sqlSavePostAsDraft, [title, slug, created_at, content, 1, id])
        } catch (error) {
            console.error(error);
        }
    }
}