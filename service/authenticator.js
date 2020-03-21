const users = require('../App_Data/registered-users');
const sessions = require('../App_Data/sessions');

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
        const session = { id: user.username, user }
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

}

module.exports = new Authenticator(users, sessions);