const NewUser = require('../utils/NewUser')


module.exports = class LoginService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async findUsers() {
    try {
      const users = await this.userRepository.findUsers()
      return users;
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async insertNewUser(newUser) {
    try {
      await this.userRepository.insertNewUser(newUser)
    } catch (error) {
      return error
    }
  }

  async registerUser(userData) {
    try {
      const newUser = new NewUser(undefined, userData.name, userData.username, userData.pw, userData.email, userData.authority === 'admin' ? 1 : 0, userData.authority === 'superAdmin' ? 1 : 0)
      await this.userRepository.registerUser(newUser)
    } catch (error) {
      return error
    }
  }

}
