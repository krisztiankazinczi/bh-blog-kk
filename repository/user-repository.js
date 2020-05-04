const NewUser = require('../utils/NewUser')


module.exports = class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async findUserByUsername(username) {
    const findUserByUsername = `SELECT
                                  id,
                                  name,
                                  username, 
                                  password, 
                                  email, 
                                  isAdmin, 
                                  isSuperAdmin 
                                FROM 
                                  users 
                                WHERE 
                                  username = ?`;

    try {
      let user = await this.db.get(findUserByUsername, [username]);
      if (user) user = new NewUser(user.id, user.name, user.username, user.password, user.email, user.isAdmin, user.isSuperAdmin)
      return user;
    } catch (error) {
      throw new Error(`findUserByUsername() in user-repository. function arguments: username: ${username}. Err: ${error} `)
    }
  }

  async findUsers() {
    const findUsers = `SELECT
                        id,
                        name,
                        username, 
                        password, 
                        email, 
                        isAdmin, 
                        isSuperAdmin 
                      FROM 
                        users`;

    try {
      let users = await this.db.all(findUsers);
      users = users.map(user => new NewUser(user.id, user.name, user.username, user.password, user.email, user.isAdmin, user.isSuperAdmin)) 
      return users;
    } catch (error) {
      throw new Error(`findUsers() in user-repository. Err: ${error} `)    }
  }

  async registerUser(newUser) {
    const insertNewUser = `INSERT INTO 
                             users
                            (
                              name,
                              username, 
                              password, 
                              email, 
                              isAdmin, 
                              isSuperAdmin
                            ) 
                            VALUES 
                              (?, ?, ?, ?, ?, ?)`

    try {
      const lastID = await this.db.run(insertNewUser, [newUser.name, newUser.username, newUser.password, newUser.email, newUser.isAdmin, newUser.isSuperAdmin]);
      return lastID;
    } catch (error) {
      throw new Error(`registerUser() in user-repository. function arguments: newUser: ${newUser}. Err: ${error} `)
    } 
  }


  async checkIfUsernameOrEmailExist(username, email) {
    const IsEmailOrUsernameExists = `SELECT
                                       username,
                                       email
                                     FROM
                                       users
                                     WHERE
                                       username = ?
                                     OR
                                       email = ?`

      try {
        const isItExists = this.db.get(IsEmailOrUsernameExists, [username, email])
        return isItExists
      } catch (error) {
        throw new Error(`checkIfUsernameOrEmailExist() in user-repository. function arguments: username: ${username}, email: ${email}. Err: ${error} `)
      }
  }


  async findUserById(id) {
    const findUserById = `SELECT
                            id,
                            name,
                            username, 
                            password, 
                            email, 
                            isAdmin, 
                            isSuperAdmin 
                          FROM 
                            users 
                          WHERE 
                            ID = ?`;

    try {
      let userDetails = await this.db.get(findUserById, [id]);
      if (userDetails) userDetails = new NewUser(userDetails.id, userDetails.name, userDetails.username, userDetails.password, userDetails.email, userDetails.isAdmin, userDetails.isSuperAdmin)
      return userDetails;
    } catch (error) {
      throw new Error(`findUserById() in user-repository. function arguments: id: ${id}. Err: ${error} `)
    }
  }

  async editUserData(editedUser) {
    const updateUserData = `UPDATE 
                             users
                            SET
                              name = ?,
                              username = ?, 
                              password = ?, 
                              email = ?, 
                              isAdmin = ?, 
                              isSuperAdmin = ?
                            WHERE
                              id = ?`

    try {
      await this.db.run(updateUserData, [editedUser.name, editedUser.username, editedUser.password, editedUser.email, editedUser.isAdmin, editedUser.isSuperAdmin, editedUser.id]);
      return
    } catch (error) {
      throw new Error(`editUserData() in user-repository. function arguments: editedUser: ${editedUser}. Err: ${error} `)
    } 
  }

  async isNewUsernameOrEmailExists(username, email, id) {
    const IsEmailOrUsernameExists = `SELECT
                                       username,
                                       email
                                     FROM
                                       users
                                     WHERE
                                       (
                                          username = ?
                                        OR
                                          email = ?
                                       )
                                     AND
                                       id != ?`

      try {
        const isItExists = this.db.get(IsEmailOrUsernameExists, [username, email, id])
        return isItExists
      } catch (error) {
        throw new Error(`isNewUsernameOrEmailExists() in user-repository. function arguments: username: ${username}, id: ${id}, email: ${email}. Err: ${error} `)
      }
  }


  async changePassword(password, email) {
    const changePassword = `UPDATE
                              users
                            SET
                              password = ?
                            WHERE
                              email = ?`

      try {
        await this.db.run(changePassword, [password, email])
      } catch (error) {
        throw new Error(`changePassword() in user-repository. function arguments: password: ${password}, email: ${email}. Err: ${error} `)
      }
  }



}