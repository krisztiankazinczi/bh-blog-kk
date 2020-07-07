const archiveService = require('../archive-service')
const DB = require('../../repository/db-wrapper');
const PostRepository = require('../../repository/posts_repository')
const BlogPostService = require('../blog-post-service')

const Authenticator = require('../authenticator')

const themeService = require('../theme-service')

const timeFormatService = require('../time-format-service')

const BlogController = require('../../controller/blog-controller')

class PostFactory {

    getArchiveService() {
      return archiveService
    }

    getDb() {
      const db = new DB()
      return db
    }

    getPostRepository() {
        const db = this.getDb()
        const repo = new PostRepository(db);

        return repo;
    }

    getTimeFormatService() {
      return timeFormatService
    }

    getPostService() {
      const repo = this.getPostRepository()
      const timeFormatService = this.getTimeFormatService()
      const service = new BlogPostService(repo, timeFormatService)
      return service
    }

    getAuthenticator() {
        const authenticator = new Authenticator();
        return authenticator;
    }

    getThemeService() {
      return themeService
    }


    getBlogController() {
      const archiveService = this.getArchiveService()
      const authenticator = this.getAuthenticator()
      const themeService = this.getThemeService()
      const postService = this.getPostService()

      const controller = new BlogController(postService, themeService, authenticator, archiveService)
      return controller
    }



} 

// single class
module.exports = new PostFactory();


