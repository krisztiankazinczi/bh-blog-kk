const NewPost = require('../utils/NewPost')

class BlogPostService {
    constructor(postRepository, timeFormatService) {
        this.postRepository = postRepository;
        this.timeFormatService = timeFormatService
    }

     async findAllPosts() {
       try {
        let posts = await this.postRepository.findAllPosts();
        posts = posts.map(post => {
          return new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormat(post.last_modified_at), 
                  this.timeFormatService.setTimeFormat(post.published_at),
                  post.content, 
                  post.draft
                )
        }) 
        return posts
       } catch (error) {
        throw new Error(`findAllPosts() in blog-post-service. Err: ${error} `)
       }
        
    }

    async findSearchedFor(searchFor) {
      try {
        let posts = await this.postRepository.findSearchedFor(searchFor);
        posts = posts.map(post => {
          return new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormat(post.last_modified_at), 
                  this.timeFormatService.setTimeFormat(post.published_at),
                  post.content, 
                  post.draft
                )
        }) 
        return posts
      } catch (error) {
        throw new Error(`findSearchedFor() in blog-post-service: return data: arguments searchFor: ${searchFor}. Err: ${error} `)
      }
        
    }

    async findPostById(id) {
      try {
        let post = await this.postRepository.findPostById(id);
        return post = new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormat(post.last_modified_at), 
                  this.timeFormatService.setTimeFormat(post.published_at),
                  post.content, 
                  post.draft,
                  post.tags ? post.tags.split(',') : post.tags
                )
      } catch (error) {
        throw new Error(`findPostById() in blog-post-service: return data: post: ${post}, arguments id: ${id}. Err: ${error} `)
      }
        
    }

    findAuthorOfPostById(id) {
      return this.postRepository.findAuthorOfPostById(id)
    }

    async findPostBySlug(slug, isActive) {
      try {
        let post = await this.postRepository.findPostBySlug(slug, isActive);
        if (post) {
          post = new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormat(post.last_modified_at), 
                  this.timeFormatService.setTimeFormat(post.published_at),
                  post.content, 
                  post.draft,
                )
        }
        return post
      } catch (error) {
        throw new Error(`findPostBySlug() in blog-post-service: return data: post: ${post}, arguments slug: ${slug}, isActive: ${isActive}. Err: ${error} `)
      }
    }

    createPost(newPost) {
        return this.postRepository.createPost(newPost);
    }

    createDraft(newPost) {
        return this.postRepository.createDraft(newPost);
    }

    updatePost(updatedPost, id) {
        return this.postRepository.updatePost(updatedPost, id);
    }

    updatePostAsDraft(updatedPost, id) {
        return this.postRepository.updatePostAsDraft(updatedPost, id);
    }

    async findTags() {
      try {
        let [tagsInPost, tags] = await this.postRepository.findTags()       
        tags = setSizeOfTags(tagsInPost, tags)
        return tags
      } catch (error) {
        throw new Error(`findTags() in blog-post-service: return data: tagsInPost: ${tagsInPost}, tags: ${tags}. Err: ${error} `)
      }

    }

    async findPostsByTag(id) {
      try {
        let posts = await this.postRepository.findPostsByTag(id)
        posts = posts.map(post => {
          console.log(post.published_at)
          return new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormat(post.last_modified_at), 
                  this.timeFormatService.setTimeFormat(post.published_at),
                  post.content, 
                  post.draft
                )
        }) 
        console.log(posts)
        return posts
      } catch (error) {
        throw new Error(`findPostsByTag() in blog-post-service: return data: posts: ${posts}, argument id: ${id}. Err: ${error} `)
      }
    }

    findActiveSlug(id) {
      return this.postRepository.findActiveSlug(id)
    }

    checkPublishedStatus(id) {
      return this.postRepository.checkPublishedStatus(id)
    }

    checkIfSlugExist(slug) {
      return this.postRepository.checkIfSlugExist(slug)
    }

   
}

module.exports = BlogPostService;




const SMALL_TAG_LIMIT = 3;
const MEDIUM_TAG_LIMIT = 6;

const smallFontSizeClassName = "small-font-size"
const mediumFontSizeClassName = "medium-font-size"
const bigFontSizeClassName = "big-font-size"


function setSizeOfTags(tagsInPost, tags) {
  
  tagsInPost.forEach(postTag => tags.map(tag => {
    if (postTag.tag_id === tag.id) {
      (!tag['timesUsed']) ? tag['timesUsed'] = 1 : tag['timesUsed'] += 1;
    } 
  }))

  tags.forEach(tag => {
    if (tag.timesUsed <= SMALL_TAG_LIMIT) tag.size = smallFontSizeClassName
    else if (tag.timesUsed <= MEDIUM_TAG_LIMIT) tag.size = mediumFontSizeClassName
    else if (tag.timesUsed > MEDIUM_TAG_LIMIT) tag.size = bigFontSizeClassName
  })

  return tags;
}
