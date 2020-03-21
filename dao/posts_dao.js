const DB = require('../service/db-service');

const db = new DB();

module.exports = class PostsDAO {
    async getAllPosts() {
        const sqlGetAllPosts = 'SELECT title, author, created_at, content FROM posts'
        try {
            const allPosts = await db.all(sqlGetAllPosts);
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(values) {
        const sqlcreateNewPost = 'INSERT INTO posts(title, author, created_at, content) VALUES (?,?,?,?)';
        try {
            await db.run(sqlcreateNewPost, values)
        } catch (error) {
            console.error(error);
        }
    }
}