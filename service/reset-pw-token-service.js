let tokenContainer = require('../data/token-container')
const uid = require('uid-safe')

const TOKEN_LENGTH = 30;


module.exports = class ResetPwTokenService {

  createNewToken() {
    return uid.sync(TOKEN_LENGTH) 
  }

  /**
   * 
   * @param {string} token 
   * @param {string} email 
   */

  saveToken(token, email) {
    tokenContainer.push({token, email, time: new Date()})
  }

  /**
   * 
   * @param {string} token
   * @returns {Object} 
   */

  checkTokenValidity(token) {
    const openedToken = tokenContainer.find(pwToken => pwToken.token === token)
    return openedToken
  }

  /**
   * 
   * @param {string} token
   * @returns {Boolean} 
   */
  deleteToken(token) {
    const filteredTokens = tokenContainer.filter(pwToken => pwToken.token !== token)
    if (filteredTokens.length < tokenContainer.length) {
      tokenContainer = filteredTokens
      return true
    }
    return false
  }


  deleteTokenAutomatically(token) {

    setTimeout( () => {
      const isTokenStillExists = this.checkTokenValidity(token)
      if (isTokenStillExists) {
        this.deleteToken(token)
      } 
    }, 3600000)
  }


}