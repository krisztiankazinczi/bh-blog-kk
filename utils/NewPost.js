module.exports = class NewPost {
    constructor(title, slug, author, content) {
        this.title = title;
        this.slug = slug;
        this.author = author;
        this.created_at = new Date().toLocaleString().split(',')[0];
        this.content = content;
    }
}