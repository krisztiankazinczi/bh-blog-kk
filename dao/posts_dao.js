const DB = require('./db-wrapper');

const db = new DB();

module.exports = class PostsDAO {
    async getAllPosts() {
        const sqlGetAllPosts = 'SELECT id, title, author, created_at, content FROM posts'
        try {
            const allPosts = await db.all(sqlGetAllPosts);
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async getPost(id) {
        const sqlGetPost = 'SELECT id, title, author, created_at, content FROM posts WHERE id = ?'
        try {
            const post = await db.all(sqlGetPost, [id]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(newPost) {
        const sqlcreateNewPost = 'INSERT INTO posts(title, author, created_at, content) VALUES (?,?,?,?)';
        try {
            await db.run(sqlcreateNewPost, [newPost.title, newPost.author, newPost.created_at, newPost.content])
        } catch (error) {
            console.error(error);
        }
    }
}