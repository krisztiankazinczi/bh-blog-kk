const archiveService = require('../archive-service')
const DB = require('../../repository/db-wrapper');
const PostRepository = require('../../repository/posts_repository')
const BlogPostService = require('../blog-post-service')

const Authenticator = require('../authenticator')

const themeService = require('../theme-service')

const timeFormatService = require('../time-format-service')

const UserRepository = require('../../repository/user-repository')
const UserService = require('../user-service')

const AdminController = require('../../controller/admin-controller')

class AdminFactory {

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

  getUserRepository() {
    const db = this.getDb()
    const repo = new UserRepository(db);

    return repo;
  }

  getUserService() {
    const repo = this.getUserRepository()
    const service = new UserService(repo)
    return service
  }


  getAdminController() {
    const timeFormatService = this.getTimeFormatService()
    const archiveService = this.getArchiveService()
    const userService = this.getUserService()
    const themeService = this.getThemeService()
    const postService = this.getPostService()


    const controller = new AdminController(postService, themeService, userService, archiveService, timeFormatService)
    return controller
  }



}

// single class
module.exports = new AdminFactory();


