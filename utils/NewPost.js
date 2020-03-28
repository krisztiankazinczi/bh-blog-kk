module.exports = class NewPost {
    constructor(title, slug, author, content) {
        this.title = title;
        this.slug = slug;
        this.author = author;
        this.last_modified_at = new Date().toLocaleString().split(',')[0];
        this.published_at = new Date();
        this.content = content;
    }
}