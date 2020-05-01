const NewPost = require('../utils/NewPost')
const setSizeOfTags = require('../utils/set-size-of-tags')

module.exports = class PostRepository {
  constructor(db) {
    this.db = db;
  }
  async findAllPosts() {
    const sqlGetAllPosts = `SELECT 
                              posts.id, 
                              posts.title, 
                              slugs.slug, 
                              posts.author, 
                              posts.last_modified_at, 
                              posts.published_at, 
                              posts.content, 
                              posts.draft 
                            FROM 
                              posts 
                            INNER JOIN
                              slugs
                            ON
                              posts.id = slugs.post_id
                            WHERE
                              slugs.isActive = 1
                            ORDER BY 
                              published_at DESC`
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
    const sqlGetAllFilteredPosts = `SELECT 
                              posts.id, 
                              posts.title, 
                              slugs.slug, 
                              posts.author, 
                              posts.last_modified_at, 
                              posts.published_at, 
                              posts.content, 
                              posts.draft 
                            FROM 
                              posts 
                            INNER JOIN
                              slugs
                            ON
                              posts.id = slugs.post_id
                            WHERE
                              slugs.isActive = 1
                            AND
                              posts.draft = 0
                            AND
                              (
                                content LIKE ? 
                              OR 
                                title LIKE ? 
                              OR 
                                author LIKE ?
                              )`

    // const sqlGetAllFilteredPosts = `SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE content LIKE ? OR title LIKE ?`
    try {
      let allPosts = await this.db.all(sqlGetAllFilteredPosts, [searchFor, searchFor, searchFor]);
      allPosts = allPosts.map(post => new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft))
      return allPosts;
    } catch (error) {
      console.error(error);
    }
  }

  async findPostById(id) {
    const sqlGetPostById = `SELECT
                              posts.id,
                              posts.title,
                              slugs.slug,
                              posts.author,
                              posts.content,
                              posts.draft,
                              group_concat(tags_in_post.tag_id) as tags
                            FROM
                              tags_in_post
                            LEFT JOIN
                              posts 
                            ON 
                              posts.id = tags_in_post.post_id
                            INNER JOIN
                              slugs 
                            ON
                              posts.id = slugs.post_id
                            WHERE
                              posts.id = ?
                            AND
                              slugs.isActive = 1`

    try {
      let post = await this.db.get(sqlGetPostById, [id]);
      post = new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, post.published_at, post.content, post.draft, post.tags ? post.tags.split(',') : post.tags)
      return post;
    } catch (error) {
      console.error(error);
    }
  }

  async findAuthorOfPostById(id) {
    const sqlFindAuthor = `SELECT
                            author
                          FROM
                            posts
                          WHERE
                            id = ?`

    try {
      const author = await this.db.get(sqlFindAuthor, [id])
      return author.author
    } catch (error) {
      return error
    }
  }

  async findPostBySlug(slug, isActive) {
    // const sqlGetPostBySlug = 'SELECT id, title, slug, author, last_modified_at, published_at, content, draft FROM posts WHERE slug = ?'
    const sqlGetPostBySlug = `SELECT
                                posts.id,
                                posts.title,
                                slugs.slug,
                                posts.author,
                                posts.last_modified_at,
                                posts.content,
                                posts.draft
                              FROM
                                posts
                              LEFT JOIN
                                slugs 
                              ON
                                posts.id = slugs.post_id
                              WHERE
                                slugs.slug = ?
                              AND
                                slugs.isActive = ?`
    try {
      let post = await this.db.get(sqlGetPostBySlug, [slug, isActive]);

      if (post) post = new NewPost(post.id, post.title, post.slug, post.author, post.last_modified_at, undefined, post.content, post.draft)
      return post;
    } catch (error) {
      console.error(error);
    }
  }


  async createPost(newPost) {
    const sqlcreateNewPost = 'INSERT INTO posts(title, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?)';
    const sqlAddActiveSlug = 'INSERT INTO slugs(post_id, slug, isActive) VALUES (?,?,?)'
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    try {
      const lastID = await this.db.run(sqlcreateNewPost, [newPost.title, newPost.author, newPost.last_modified_at, newPost.published_at, newPost.content, newPost.draft])
      
      await this.db.run(sqlAddActiveSlug, [lastID, newPost.slug, 1])

      if (newPost.tags) await Promise.all(newPost.tags.map(tag => this.db.run(sqladdTags, [lastID, tag])))

    } catch (error) {
      console.error(error);
    }
  }

  async createDraft(newPost) {
    const sqlcreateNewDraft = 'INSERT INTO posts(title, slug, author, last_modified_at, published_at, content, draft) VALUES (?,?,?,?,?,?,?)';
    const sqlAddActiveSlug = 'INSERT INTO slugs(post_id, slug, isActive) VALUES (?,?,?)'
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    try {
      const lastID = await this.db.run(sqlcreateNewDraft, [newPost.title, newPost.slug, newPost.author, newPost.last_modified_at, newPost.published_at, newPost.content, newPost.draft])

      if (newPost.slug) await this.db.run(sqlAddActiveSlug, [lastID, newPost.slug, 1])

      if (newPost.tags) await Promise.all(newPost.tags.map(tag => this.db.run(sqladdTags, [lastID, tag])))
    } catch (error) {
      console.error(error);
    }
  }

  async updatePost(updatedPost, id) {
    const sqlUpdatePost = 'UPDATE posts SET title = ?, author =?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
    const deleteExistingTags = 'DELETE FROM tags_in_post WHERE post_id = ?'
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    const sqlChangeStatusOfPrevActiveSlug = 'UPDATE slugs SET isActive = ? WHERE post_id = ? AND isActive = ?'
    const sqlSetNewActiveSlug = 'INSERT INTO slugs(post_id, slug, isActive) VALUES (?,?,?)'

    try {
      await this.db.run(sqlUpdatePost, [updatedPost.title, updatedPost.author, updatedPost.last_modified_at, updatedPost.published_at, updatedPost.content, "0", id])
      await this.db.run(deleteExistingTags, [id])
      if (updatedPost.tags) await Promise.all(updatedPost.tags.map(tag => this.db.run(sqladdTags, [id, tag])))
      if (updatedPost.newActiveSlugNeeded === 1) {
        await this.db.run(sqlChangeStatusOfPrevActiveSlug, [0, id, 1])
        await this.db.run(sqlSetNewActiveSlug, [id, updatedPost.slug, 1])
      }
    } catch (error) {
      console.error(error);
      return error
    }
  }

  async updatePostAsDraft(updatedPost, id) {
    const sqlSavePostAsDraft = 'UPDATE posts SET title = ?, author =?, last_modified_at = ?, published_at = ?, content = ?, draft = ? WHERE id = ?'
    const deleteExistingTags = 'DELETE FROM tags_in_post WHERE post_id = ?'
    const sqladdTags = 'INSERT INTO tags_in_post(post_id, tag_id) VALUES (?,?)'
    const sqlChangeStatusOfPrevActiveSlug = 'UPDATE slugs SET isActive = ? WHERE post_id = ? AND isActive = ?'
    const sqlSetNewActiveSlug = 'INSERT INTO slugs(post_id, slug, isActive) VALUES (?,?,?)'
    
    try {
      await this.db.run(sqlSavePostAsDraft, [updatedPost.title, updatedPost.author, updatedPost.last_modified_at, updatedPost.published_at, updatedPost.content, updatedPost.draft, id])
      await this.db.run(deleteExistingTags, [id])
      if (updatedPost.tags) await Promise.all(updatedPost.tags.map(tag => this.db.run(sqladdTags, [id, tag])))
      if (updatedPost.newActiveSlugNeeded === 1) {
        await this.db.run(sqlChangeStatusOfPrevActiveSlug, [0, id, 1])
        await this.db.run(sqlSetNewActiveSlug, [id, updatedPost.slug, 1])
      }
    
    } catch (error) {
      console.error(error);
      return error
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
    const sqlFindByTag = `SELECT 
                            posts.id, 
                            posts.title, 
                            posts.author, 
                            posts.last_modified_at, 
                            slugs.slug, 
                            posts.draft 
                          FROM 
                            tags_in_post 
                          LEFT JOIN 
                            posts 
                          ON 
                            posts.id = tags_in_post.post_id
                          INNER JOIN
                            slugs 
                          ON
                            posts.id = slugs.post_id 
                          WHERE 
                            tags_in_post.tag_id = ? 
                          AND 
                            posts.draft != 1
                          AND
                            slugs.isActive = 1`
    try {
      const results = await this.db.all(sqlFindByTag, [id])
      return results
    } catch (error) {
      console.log(error)
    }
  }

  async findActiveSlug(id) {
    const sqlFindSlug = `SELECT
                          slug
                        FROM
                          slugs
                        WHERE
                          post_id = ?
                        AND
                          isActive = 1`
    try {
      const slug = await this.db.get(sqlFindSlug, [id])
      return slug.slug
    } catch (error) {
      return error
    }
  }

  async checkPublishedStatus(id) {
    const findPublishedAtOfPost = `SELECT
                                    published_at
                                  FROM
                                    posts
                                  WHERE
                                    id = ?`
    try {
      const publishedAt = await this.db.get(findPublishedAtOfPost, [id])
      return publishedAt.published_at
    } catch (error) {
      return error
    }
  }
}
