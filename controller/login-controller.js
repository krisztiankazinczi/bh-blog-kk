const authenticator = require('../service/authenticator');

const AUTH_COOKIE = 'authcookie';

module.exports = class LoginController {
    get(req, res) {
        let error;
        if (req.query.error === 'credentials') error = 'Error! Invalid Credentials';
        if (req.query.error === 'loginNeeded') error = 'Please login!';
        res.render('login', {layout: 'main-login', error});
    }

    post(req, res) {
        const {username, pw} = req.body;
        
        if (authenticator.authenticate(username, pw)) {
            const user = authenticator.authenticate(username, pw);
            const session = authenticator.registerSession(user)
            res.cookie(AUTH_COOKIE, session.id)
            res.redirect('/admin')
            
        } 
        else res.redirect('/login?error=credentials')
    }

    logout(req, res) {
        res.clearCookie(AUTH_COOKIE)
        console.log(req.session.id)
        authenticator.deleteSession(req.session.id)
        
        res.redirect('/login')
    }
}

