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
      console.error(error);
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
      console.error(error);
    }
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
      return true
    } catch (error) {
      console.error(error);
    } 
  }



}