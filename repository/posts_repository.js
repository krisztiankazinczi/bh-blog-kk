const DB = require('./db-wrapper');

const db = new DB();

module.exports = class PostRepository {
    async findAllPosts() {
        const sqlGetAllPosts = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts ORDER BY published_at DESC'
        try {
            const allPosts = await db.all(sqlGetAllPosts);
            //newPost creations
            return allPosts;
        } catch (error) {
            console.error(error);
        }
    }

    async findPostById(id) {
        const sqlGetPostById = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE id = ?'
        try {
            const post = await db.get(sqlGetPostById, [id]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async findPostBySlug(slug) {
        const sqlGetPostBySlug = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE slug = ?'
        try {
            const post = await db.get(sqlGetPostBySlug, [slug]);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async createPost(newPost) {
        const sqlcreateNewPost = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
        try {
            await db.run(sqlcreateNewPost, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, newPost.published_at, newPost.content, null])
        } catch (error) {
            console.error(error);
        }
    }

    async createDraft(newPost) {
        const sqlcreateNewDraft = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
        try {
            await db.run(sqlcreateNewDraft, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, null, newPost.content, 1])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePost(updatedPost, id) {
        const sqlUpdatePost = 'UPDATE posts SET title = ?, slug = ?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
        try {
            await db.run(sqlUpdatePost, [updatedPost.title, updatedPost.slug, updatedPost.last_modified_at, updatedPost.published_at, updatedPost.content, null, id])
        } catch (error) {
            console.error(error);
        }
    }

    async updatePostAsDraft(updatedPost, id) {
        const sqlSavePostAsDraft = 'UPDATE posts SET title = ?, slug = ?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
        try {
            await db.run(sqlSavePostAsDraft, [updatedPost.title, updatedPost.slug, updatedPost.last_modified_at, null, updatedPost.content, "1", id])
        } catch (error) {
            console.error(error);
        }
    }
}