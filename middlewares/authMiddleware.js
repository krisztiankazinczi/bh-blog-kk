const authenticator = require('../service/authenticator');

const AUTH_COOKIE = 'authcookie';

function authMiddleware(req, res, next) {
    
    const authCookie = req.cookies[AUTH_COOKIE]

    const session = authenticator.getSessions().find(s => s.id === authCookie)
    if (!session) {
        res.status(401).redirect('/login?error=loginNeeded')
        return
    }
    
    req.session = session
    next()
}


module.exports = authMiddleware;