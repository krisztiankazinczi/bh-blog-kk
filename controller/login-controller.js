const Authenticator = require('../service/authenticator');

const AUTH_COOKIE = 'ssid';

module.exports = class LoginController {
    constructor(themeService, authenticator) {
        this.themeService = themeService
        this.authenticator = authenticator
    }

    get(req, res) {
        let error;
        let successLogout;
        if (req.query.error === 'credentials') error = 'Error! Invalid Credentials';
        if (req.query.error === 'loginNeeded') error = 'Please login!';
        if (req.query.logout === 'successful') successLogout = 'Logout Successful';
        res.render('login', {layout: 'main', error, successLogout, css: this.themeService.createThemePath()});
    }

    async post(req, res) {
        const {username, pw} = req.body;
        const user = await this.authenticator.authenticate(username, pw);
        if (user) {
            const session = this.authenticator.registerSession(user)
            res.cookie(AUTH_COOKIE, session.id)
            res.redirect('/admin')
            
        } 
        else res.redirect('/login?error=credentials')
    }

    logout(req, res) {
        res.clearCookie(AUTH_COOKIE)
        const logout = new Authenticator().deleteSession(req.session.id)
        if (logout) res.redirect('/login?logout=successful')
        else res.redirect('/admin')
    }
}

