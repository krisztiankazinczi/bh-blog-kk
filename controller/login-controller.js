const authenticator = require('../service/authenticator');

const AUTH_COOKIE = 'ssid';

module.exports = class LoginController {
    constructor(themeService) {
        this.themeService = themeService
    }

    get(req, res) {
        let error;
        let successLogout;
        if (req.query.error === 'credentials') error = 'Error! Invalid Credentials';
        if (req.query.error === 'loginNeeded') error = 'Please login!';
        if (req.query.logout === 'successful') successLogout = 'Logout Successful';
        res.render('login', {layout: 'main', error, successLogout, css: this.themeService.createThemePath()});
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
        const logout = authenticator.deleteSession(req.session.id)
        if (logout) res.redirect('/login?logout=successful')
        else res.redirect('/admin')
    }
}

