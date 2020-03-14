const authenticator = require('../service/authenticator');

const AUTH_COOKIE = 'authcookie';

function authMiddleware(req, res, next) {
    console.log('Auth middleware running')
    const authCookie = req.cookies[AUTH_COOKIE]
    console.log(`Authentication cookie: ${authCookie}`)

    const session = authenticator.getSessions().find(s => s.id === authCookie)
    console.log(session)
    if (!session) {
        res.status(401).redirect('/login?error=loginNeeded')
        return
    }
    
    req.session = session
    next()
}


module.exports = authMiddleware;