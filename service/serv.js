// class Factory {

//     getUserRepository() {
//         const db = new DB();
//         const repo = new UserRepository(db);

//         return repo;
//     }

//     getAuthenticator() {
//         const repo = this.getUserRepository();
//         const authenticator = new Authenticator(repo);

//         return authenticator;
//     }
// } 

// // single osztaly
// module.exports = new Factory();


// // masik file
// const service = require('./serv.js')

// service.getAuthenticator()

