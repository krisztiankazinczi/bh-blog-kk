module.exports = class NewUser {
  constructor(id, name, username, password, email, isAdmin, isSuperAdmin) {
      this.id = id;
      this.name = name;
      this.username = username;
      this.password = password;
      this.email = email;
      this.isAdmin = isAdmin;
      this.isSuperAdmin = isSuperAdmin;
  }
}