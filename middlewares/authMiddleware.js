const Authenticator = require('../service/authenticator');
const authenticator = new Authenticator()

const AUTH_COOKIE = 'ssid';

function authMiddleware(req, res, next) {
    
    const ssid = req.cookies[AUTH_COOKIE]

    const session = authenticator.getSessions().find(s => s.id === ssid)
    if (!session) {
        res.status(401).redirect('/login?status=loginNeeded')
        return
    }
    
    req.session = session
    next()
}


module.exports = authMiddleware;