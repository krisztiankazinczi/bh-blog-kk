const EmailService = require('../email-service')

const DB = require('../../repository/db-wrapper');
const UserRepository = require('../../repository/user-repository')
const Authenticator = require('../authenticator');
const UserService = require('../user-service')
const ResetPwTokenService = require('../reset-pw-token-service')

const themeService = require('../theme-service')

const LoginController = require('../../controller/login-controller')

class LoginFactory {

    getEmailService() {
      const emailService = new EmailService()
      return emailService
    }

    getDb() {
      const db = new DB()
      return db
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

    getResetTokenService() {
      const service = new ResetPwTokenService()
      return service
    }

    getAuthenticator() {
        const repo = this.getUserRepository();
        const authenticator = new Authenticator(repo);

        return authenticator;
    }

    getThemeService() {
      return themeService
    }

    getLoginController() {
      const themeService = this.getThemeService()
      const authenticator = this.getAuthenticator()
      const resetPwTokenService = this.getResetTokenService()
      const userService = this.getUserService()
      const emailService = this.getEmailService()

      const controller = new LoginController(themeService, authenticator, resetPwTokenService, userService, emailService)
      return controller
    }



} 

// single class
module.exports = new LoginFactory();


