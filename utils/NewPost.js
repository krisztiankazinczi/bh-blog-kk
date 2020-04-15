module.exports = class NewPost {
    constructor(id, title, slug, author, last_modified_at, published_at, content, draft, tags) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.author = author;
        this.last_modified_at = last_modified_at;
        this.published_at = published_at;
        this.content = content;
        this.draft = draft;
        this.tags = tags;
    }
}