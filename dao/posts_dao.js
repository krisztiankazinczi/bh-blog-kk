const DB = require('./db-wrapper');

const db = new DB();

module.exports = class PostsDAO {
    async getAllPosts() {
        const sqlGetAllPosts = 'SELECT id, title, slug, author, created_at, content FROM posts'
        try {
            const allPosts = await db.all(sqlGetAllPosts);
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostById(id) {
        const sqlGetPostById = 'SELECT id, title, slug, author, created_at, content FROM posts WHERE id = ?'
        try {
            const post = await db.get(sqlGetPostById, [id]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostBySlug(slug) {
        const sqlGetPostBySlug = 'SELECT id, title, slug, author, created_at, content FROM posts WHERE slug = ?'
        try {
            const post = await db.get(sqlGetPostBySlug, [slug]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(newPost) {
        const sqlcreateNewPost = 'INSERT INTO posts(title, slug, author, created_at, content) VALUES (?,?,?,?,?)';
        try {
            await db.run(sqlcreateNewPost, [newPost.title, newPost.slug, newPost.author, newPost.created_at, newPost.content])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePost(title, slug, content, id) {
        const sqlUpdatePost = 'UPDATE posts SET title = ?, slug = ?, content = ? WHERE id = ?'
        try {
            await db.run(sqlUpdatePost, [title, slug, content, id])
        } catch (error) {
            console.error(error);
        }
    }
}