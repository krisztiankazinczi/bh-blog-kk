module.exports = class NewPost {
    constructor(title, author, content) {
        this.title = title;
        this.author = author;
        this.created_at = new Date().toLocaleString().split(',')[0];
        this.content = content;
    }
}