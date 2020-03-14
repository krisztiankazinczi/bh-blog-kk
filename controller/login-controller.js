const users = require('../model/registered-users');

const isUserExists = (username, password) => {
    const user = users.find(u => u.username === username)
    if (user && user.password === password) return true
    else return false
}

module.exports = class LoginController {
    get(req, res) {
        let error;
        if (req.query.error === 'credentials') error = 'Error! Invalid Credentials'// res.render('invalid-login', {layout: 'main-login'});
        res.render('login', {layout: 'main-login', error});
        error = undefined;
    }

    post(req, res) {
        const {username, pw} = req.body;
        
        if (isUserExists(username, pw)) res.redirect('/admin')
        else res.redirect('/login?error=credentials')
    }
}

