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

  async checkIfUsernameOrEmailExist(username, email) {
    try {
      const existsOrNot = await this.userRepository.checkIfUsernameOrEmailExist(username, email)
      return existsOrNot;
    } catch (error) {
      return error
    }
  }

  async findUserById(id) {
    try {
      const userDetails = await this.userRepository.findUserById(id)
      return userDetails
    } catch (error) {
      return error
    }
  }

  async editUserData(userData) {
    try {
      const editedUser = new NewUser(userData.id, userData.name, userData.username, userData.pw, userData.email, userData.authority === 'admin' ? 1 : 0, userData.authority === 'superAdmin' ? 1 : 0)
      await this.userRepository.editUserData(editedUser)
    } catch (error) {
      return error
    }
  }

  async isNewUsernameOrEmailExists(username, email, id) {
    try {
      const existsOrNot = await this.userRepository.isNewUsernameOrEmailExists(username, email, id)
      return existsOrNot;
    } catch (error) {
      return error
    }
  }

  async changePassword(password, email) {
    try {
      await this.userRepository.changePassword(password, email)
    } catch (error) {
      return error
    }
  }

}
