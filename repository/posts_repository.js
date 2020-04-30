const NewPost = require('../utils/NewPost')
const setSizeOfTags = require('../utils/set-size-of-tags')

module.exports = class PostRepository {
  constructor(db) {
    this.db = db;
  }
  async findAllPosts() {
    const sqlGetAllPosts = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts ORDER BY published_at DESC'
    try {
      let allPosts = await this.db.all(sqlGetAllPosts);
      allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
      return allPosts;
    } catch (error) {
      console.error(error);
    }
  }

  async findSearchedFor(searchFor) {
    searchFor = `%${searchFor}%`;
    const sqlGetAllFilteredPosts = `SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE content LIKE ? OR title LIKE ?`
    try {
      let allPosts = await this.db.all(sqlGetAllFilteredPosts, [searchFor, searchFor]);
      allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
      return allPosts;
    } catch (error) {
      console.error(error);
    }
  }

  async findPostById(id) {
    // const sqlGetPostById = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE id = ?'
    const sqlGetPostById = `SELECT
        posts.id,
        posts.title,
        posts.slug,
        posts.author,
        posts.content,
        posts.draft,
        group_concat(tags_in_post.tag_id) as tags
      FROM
        tags_in_post
      LEFT JOIN
        posts ON posts.id = tags_in_post.post_id
      WHERE
        posts.id = ?`

    try {
      let post = await this.db.get(sqlGetPostById, [id]);
      post = new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft, post.tags ? post.tags.split(',') : post.tags)
      return post;
    } catch (error) {
      console.error(error);
    }
  }

  async findPostBySlug(slug) {
    const sqlGetPostBySlug = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE slug = ?'
    try {
      let post = await this.db.get(sqlGetPostBySlug, [slug]);
      post = new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft)
      return post;
    } catch (error) {
      console.error(error);
    }
  }

  async createPost(newPost) {
    const sqlcreateNewPost = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    try {
      const lastID = await this.db.run(sqlcreateNewPost, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, newPost.published_at, newPost.content, "0"])
  
      if (!newPost.tags) { }
      else if (typeof newPost.tags === 'string') await this.db.run(sqladdTags, [lastID, newPost.tags])
      else if (Array.isArray(newPost.tags)) await Promise.all(newPost.tags.map(tag => this.db.run(sqladdTags, [lastID, tag])))
    } catch (error) {
      console.error(error);
    }
  }

  async createDraft(newPost) {
    const sqlcreateNewDraft = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    try {
      const lastID = await this.db.run(sqlcreateNewDraft, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, null, newPost.content, 1])

      if (!newPost.tags) { }
      else if (typeof newPost.tags === 'string') await this.db.run(sqladdTags, [lastID, newPost.tags])
      else if (Array.isArray(newPost.tags)) await Promise.all(newPost.tags.map(tag => this.db.run(sqladdTags, [lastID, tag])))
    } catch (error) {
      console.error(error);
    }
  }

  async updatePost(updatedPost, id) {
    const sqlUpdatePost = 'UPDATE posts SET title = ?, author =?, slug = ?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
    const deleteExistingTags = 'DELETE FROM tags_in_post WHERE post_id = ?'
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'

    try {
      await this.db.run(sqlUpdatePost, [updatedPost.title, updatedPost.author, updatedPost.slug, updatedPost.last_modified_at, updatedPost.published_at, updatedPost.content, "0", id])
      await this.db.run(deleteExistingTags, [id])
      if (!updatedPost.tags) { }
      else if (typeof updatedPost.tags === 'string') await this.db.run(sqladdTags, [id, updatedPost.tags])
      else if (Array.isArray(updatedPost.tags)) await Promise.all(updatedPost.tags.map(tag => this.db.run(sqladdTags, [id, tag])))
    } catch (error) {
      console.error(error);
    }
  }

  async updatePostAsDraft(updatedPost, id) {
    const sqlSavePostAsDraft = 'UPDATE posts SET title = ?, author =?, slug = ?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
    const deleteExistingTags = 'DELETE FROM tags_in_post WHERE post_id = ?'
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    
    try {
      await this.db.run(sqlSavePostAsDraft, [updatedPost.title, updatedPost.author, updatedPost.slug, updatedPost.last_modified_at, null, updatedPost.content, "1", id])
      await this.db.run(deleteExistingTags, [id])
      if (updatedPost.tags) {
        await Promise.all(updatedPost.tags.map(tag => this.db.run(sqladdTags, [id, tag])))
      }
      //else if (typeof updatedPost.tags === 'string') await this.db.run(sqladdTags, [id, updatedPost.tags])
    
    } catch (error) {
      console.error(error);
    }
  }


  async findTags() {
    const sqlFindAllTags = 'SELECT id, name FROM tags ORDER BY name DESC'
    const sqlFindTagsInPOst = 'SELECT post_id, tag_id FROM tags_in_post'
    try {
      let tags = await this.db.all(sqlFindAllTags);
      const tagsInPost = await this.db.all(sqlFindTagsInPOst)
      tags = setSizeOfTags(tagsInPost, tags)
      return tags;
    } catch (error) {
      console.error(error);
    }
  }

  async findPostsByTag(id) {
    const sqlFindByTag = 'SELECT posts.id, posts.title, posts.author, posts.last_modified_at, posts.slug, posts.draft FROM tags_in_post INNER JOIN posts ON posts.id = tags_in_post.post_id WHERE tags_in_post.tag_id = ? AND posts.draft != 1'
    try {
      const results = await this.db.all(sqlFindByTag, [id])
      return results
    } catch (error) {
      console.log(error)
    }
  }
}
