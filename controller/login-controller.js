const authenticator = require('../service/authenticator');

const AUTH_COOKIE = 'authcookie';

module.exports = class LoginController {
    get(req, res) {
        let error;
        let successLogout;
        let border;
        let username;
        if (req.query.error === 'not-found') error = 'Error! User not found!';
        if (req.query.error === 'pw') {
            error = 'Please fill the password field too!';
            border = 'pw';
            username = req.query.val;
        } 
        if (req.query.error === 'username') {
            error = 'Please fill the username field too!';
            border = 'username';
        } 
        if (req.query.error === 'both') {
            error = 'Please fill both fields!';
            border = 'both';
        } 
        
        if (req.query.error === 'inc-pw') {
            error = 'Error! Incorrect password!';
            border = 'pw';
            username = req.query.val;
        } 
        if (req.query.error === 'loginNeeded') error = 'Please login!';
        if (req.query.logout === 'successful') successLogout = 'Logout Successful';
        res.render('login', {layout: 'main-login', error, successLogout, border, username});
    }

    post(req, res) {
        const {username, pw} = req.body;

        if(username && !pw) {res.redirect(`/login?error=pw&val=${username}`); return;}
        else if (!username && pw) {res.redirect('/login?error=username'); return}
        else if (!username && !pw) {res.redirect('/login?error=both'); return}

        const user = authenticator.authenticate(username, pw);

        if (typeof user === 'string') {
            if (user === 'not-found') res.redirect('/login?error=not-found');
            else if (user === 'inc-pw') res.redirect(`/login?error=inc-pw&val=${username}`);
        } else {
            const session = authenticator.registerSession(user)
            res.cookie(AUTH_COOKIE, session.id)
            res.redirect('/admin')
        }
    }

    logout(req, res) {
        res.clearCookie(AUTH_COOKIE)
        const logout = authenticator.deleteSession(req.session.id)
        if (logout) res.redirect('/login?logout=successful')
        else res.redirect('/admin')
    }
}

