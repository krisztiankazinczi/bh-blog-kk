
/**
 * @module NewPost
 * @exports NewPost
 */
module.exports = class NewPost {
  /**
   * 
   * @param {number} id 
   * @param {string} title 
   * @param {string} slug 
   * @param {string} author 
   * @param {number} last_modified_at 
   * @param {number} published_at 
   * @param {string} content 
   * @param {number} draft 
   * @param {Array} tags 
   * @param {number} newActiveSlugNeeded 
   */
    constructor(id, title, slug, author, last_modified_at, published_at, content, draft, tags, newActiveSlugNeeded) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.author = author;
        this.last_modified_at = last_modified_at;
        this.published_at = published_at;
        this.content = content;
        this.draft = draft;
        this.tags = tags;
        this.newActiveSlugNeeded = newActiveSlugNeeded
    }
}