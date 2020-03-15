const users = require('../model/registered-users');
const sessions = require('../model/sessions');

class Authenticator {
    
    getSessions() {
        return sessions;
    }

    authenticate(username, password) {
            const user = users.find(u => u.username === username)
            if (!user) return 'not-found';
            else if (user && user.password !== password) return 'inc-pw';
            else if (user && user.password === password) return user 
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