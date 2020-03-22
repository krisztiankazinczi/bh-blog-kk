const users = require('../data/registered-users');
const sessions = require('../data/sessions');
const uid = require('uid-safe')

const SSID_LENGTH = 18;

class Authenticator {
    
    getSessions() {
        return sessions;
    }

    authenticate(username, password) {
        const user = users.find(u => u.username === username)
        if (user && user.password === password) return user
        else return false
    }

    registerSession(user) {
        const session = {id: uid.sync(SSID_LENGTH), user}
        sessions.push(session);
        return session
    }

    deleteSession(sessionId) {
        const idx = sessions.findIndex(session => session.id === sessionId);
        if (idx !== -1){
            sessions.splice(idx, 1)
            return true
        } return false
    }

    findUserBySession(ssid) {
        const session = sessions.find(s => s.id === ssid)
        return session.user;
    }

}

module.exports = new Authenticator(users, sessions);