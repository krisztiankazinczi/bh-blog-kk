const NewUser = require('../utils/NewUser')


module.exports = class LoginService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async findUsers() {
    try {
      let users = await this.userRepository.findUsers()
      users = users.map(user => {
        return new NewUser  
                    (
                      user.id,
                      user.name,
                      user.username,
                      user.password,
                      user.email,
                      user.isAdmin,
                      user.isSuperAdmin
                    )
      })
      return users;
    } catch (error) {
      throw new Error(`findUsers() in user-service. Err: ${error} `)
    }
  }

  insertNewUser(newUser) {
    return this.userRepository.insertNewUser(newUser)
  }

  async registerUser(userData) {
      const newUser = new NewUser
                          (
                            undefined, 
                            userData.name, 
                            userData.username, 
                            userData.pw, 
                            userData.email, 
                            userData.authority === 'admin' ? 1 : 0, 
                            userData.authority === 'superAdmin' ? 1 : 0
                          )
      return this.userRepository.registerUser(newUser)
  }

  checkIfUsernameOrEmailExist(username, email) {
    return this.userRepository.checkIfUsernameOrEmailExist(username, email)
  }

  async findUserById(id) {
    try {
      let user = await this.userRepository.findUserById(id)
      user = new NewUser  
                    (
                      user.id,
                      user.name,
                      user.username,
                      user.password,
                      user.email,
                      user.isAdmin,
                      user.isSuperAdmin
                    )
      return user;
    } catch (error) {
      throw new Error(`findUserById() in user-service. Function argument: id: ${id} Err: ${error} `)
    }
  }

  async editUserData(userData) {
    try {
      const editedUser = new NewUser
                          (
                            userData.id, 
                            userData.name, 
                            userData.username, 
                            userData.pw, 
                            userData.email, 
                            userData.authority === 'superAdmin' ? 1 
                              : userData.authority === 'admin' ? 1 : 0, 
                            userData.authority === 'superAdmin' ? 1 : 0)
      await this.userRepository.editUserData(editedUser)
    } catch (error) {
      throw new Error(`editUserData() in user-service. function arguments: editedUser: ${userdata}. Err: ${error} `)
    }
  }

  isNewUsernameOrEmailExists(username, email, id) {
    return this.userRepository.isNewUsernameOrEmailExists(username, email, id)
  }

  changePassword(password, email) {
      return this.userRepository.changePassword(password, email)
  }

}
