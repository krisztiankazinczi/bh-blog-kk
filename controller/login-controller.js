const Authenticator = require('../service/authenticator');

const nodemailer = require('nodemailer');

const AUTH_COOKIE = 'ssid';

module.exports = class LoginController {
  constructor(themeService, authenticator, resetPwTokenService, userService, emailService) {
    this.themeService = themeService
    this.authenticator = authenticator
    this.resetPwTokenService = resetPwTokenService
    this.userService = userService
    this.emailService = emailService
  }

  get(req, res) {
    let error;
    let successLogout;
    if (req.query.error === 'credentials') error = 'Error! Invalid Credentials';
    if (req.query.error === 'loginNeeded') error = 'Please login!';
    if (req.query.logout === 'successful') successLogout = 'Logout Successful';
    res.render('login', { layout: 'main', error, successLogout, css: this.themeService.createThemePath() });
  }

  async post(req, res) {
    const { username, pw } = req.body;
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

  forgotPw(req, res) {
    const { status } = req.query
    let userError, serverError, success, pwChangeSuccess
    if (status === 'userError') userError = true
    if (status === 'serverError') serverError = true
    if (status === 'success') success = true
    if (status === 'pwChangeSuccess') pwChangeSuccess = true
    res.render('forgot', {
      layout: 'main',
      css: this.themeService.createThemePath(),
      userError,
      serverError,
      success,
      pwChangeSuccess
    })
  }

  async resetPwEmail(req, res) {
    const { email } = req.body

    let isUserExists;

    try {
      // first parameter is undefined, since I am just reusing an other db request!!
      isUserExists = await this.userService.checkIfUsernameOrEmailExist(undefined, email)
    } catch (error) {
      res.redirect('/forgot?status=serverError')
    }
    if (!isUserExists) {
      res.redirect('/forgot?status=userError')
      return
    }

    const token = this.resetPwTokenService.createNewToken()

    this.resetPwTokenService.saveToken(token, email)

    const resetPwUrl = `http://localhost:3000/forgot/change?token=${token}`

    const message = this.emailService.createMessage(email, resetPwUrl)


    try {
      await this.emailService.sendResetPwEmail(message)
      res.redirect(`/forgot?status=success&emailTo=${email}`)
      this.resetPwTokenService.deleteTokenAutomatically(token)
    } catch (error) {
      console.log(error)
      res.redirect('/forgot?status=serverError')
    }

  }


  changePwPage(req, res) {
    const { token, status } = req.query;
    let success, incorrectPw, serverError;

    if (status === 'success') success = true
    if (status === 'serverError') serverError = true
    if (status === 'incorrectPw') incorrectPw = true

    let isTokenValid = this.resetPwTokenService.checkTokenValidity(token)

    // if the token would be stored in database, and server restart happens, 
    //then the deleteAutomatically method would never run!!! So if 1 hour has passed, I just make the token invalid and redirect
    const actualTime = new Date()
    if (isTokenValid && (actualTime - isTokenValid.time) > 3600000) {
      this.resetPwTokenService.deleteToken(isTokenValid.token)
      isTokenValid = undefined
    }

    //if token is invalid, the client will see an error message on the page

    res.render('change-password', {
      layout: 'main',
      css: this.themeService.createThemePath(),
      isTokenValid,
      serverError,
      incorrectPw,
      success
    })

  }

  async changePassword(req, res) {
    const { password, password_confirm, email, token } = req.body;

    if (password && password_confirm && password.length > 4 && password === password_confirm) {
      try {
        await this.userService.changePassword(password, email)
        this.resetPwTokenService.deleteToken(token)

        //send an email about the success password change
        const message = this.emailService.createSuccessPwChangeMessage(email)
        await this.emailService.sendPwChangeSuccessEmail(message)

        res.redirect('/forgot?status=pwChangeSuccess')
      } catch (error) {
        console.log(error)
        res.redirect(`/forgot/change?status=serverError&token=${token}`)
      }
      return
    }
    res.redirect(`/forgot/change?status=incorrectPw&token=${token}`)
  }







}

