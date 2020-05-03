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
                  this.timeFormatService.setTimeFormatOfPost(post.last_modified_at), 
                  this.timeFormatService.setTimeFormatOfPost(post.published_at),
                  post.content, 
                  post.draft
                )
        }) 
        return posts
       } catch (error) {
         return error
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
                  this.timeFormatService.setTimeFormatOfPost(post.last_modified_at), 
                  this.timeFormatService.setTimeFormatOfPost(post.published_at),
                  post.content, 
                  post.draft
                )
        }) 
        return posts
      } catch (error) {
        return error
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
                  this.timeFormatService.setTimeFormatOfPost(post.last_modified_at), 
                  this.timeFormatService.setTimeFormatOfPost(post.published_at),
                  post.content, 
                  post.draft,
                  post.tags 
                    ? 
                      post.tags.split(',') 
                    : 
                      post.tags
                )
      } catch (error) {
        return error
      }
        
    }

    async findAuthorOfPostById(id) {
      try {
        let post = await this.postRepository.findAuthorOfPostById(id)
        if (post) {
          post = new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormatOfPost(post.last_modified_at), 
                  this.timeFormatService.setTimeFormatOfPost(post.published_at),
                  post.content, 
                  post.draft,
                )
        }
        return post
      } catch (error) {
        return error
      }
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
                  this.timeFormatService.setTimeFormatOfPost(post.last_modified_at), 
                  this.timeFormatService.setTimeFormatOfPost(post.published_at),
                  post.content, 
                  post.draft,
                )
        }
        return post
      } catch (error) {
        return error
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
        return error
      }

    }

    async findPostsByTag(id) {
      try {
        let posts = await this.postRepository.findPostsByTag(id)
        posts = posts.map(post => {
          return new NewPost
                (
                  post.id, 
                  post.title, 
                  post.slug, 
                  post.author, 
                  this.timeFormatService.setTimeFormatOfPost(post.last_modified_at), 
                  this.timeFormatService.setTimeFormatOfPost(post.published_at),
                  post.content, 
                  post.draft
                )
        }) 
        return posts
      } catch (error) {
        return error
      }
    }

    findActiveSlug(id) {
      return this.postRepository.findActiveSlug(id)
    }

    checkPublishedStatus(id) {
      return this.postRepository.checkPublishedStatus(id)
    }
   
}

module.exports = BlogPostService;



const SMALL_TAG = 3;
const MEDIUM_TAG = 6;

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
    if (tag.timesUsed <= SMALL_TAG) tag.size = smallFontSizeClassName
    if (tag.timesUsed <= MEDIUM_TAG) tag.size = mediumFontSizeClassName
    if (tag.timesUsed > MEDIUM_TAG) tag.size = bigFontSizeClassName
  })

  return tags;
}
