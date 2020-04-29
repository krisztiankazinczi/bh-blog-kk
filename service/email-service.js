const nodemailer = require('nodemailer');

//SMTP server connection details
let transport = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: 'lilkrisz17@gmail.com',
    pass: 'QGzFWyV2pNnt3Ijk'
  }
});

const blogAdminEmail = 'admin@blogAdmin.com'
const resetPWSubj = 'Reset your password'

module.exports = class EmailService {

  /**@param {string} resetPwUrl  */
  getEmailContent(resetPwUrl) {
    return `<h3>Forgot your password?</h3>
            <p>We have received a request to reset the password for this email address</p>
            <p>To reset your password, please click in this link or cut and paste this URL into your browser (link expires in 60 minutes)</p>
            <a href="${resetPwUrl}">${resetPwUrl}</a>
            <p>This link takes you to a secure page where you can reset your password</p>
            <p>If you don't want to reset your password please ignore this message.</p>
            <p>If you received this email by mistake, please delete it.</p>
            `
  }

/**
 * @param {string} emailTo - the email will be sent here
 * @param {string} resetPwUrl - this is the url of reset password page
 */

  createMessage(emailTo, resetPwUrl) {
    const message = {
      from: blogAdminEmail,
      to: emailTo,
      subject: resetPWSubj,
      html: this.getEmailContent(resetPwUrl)
    }
    return message
  }

  /**
   * 
   * @param {Object} message 
   */
  sendResetPwEmail(message) {
    return new Promise( (resolve, reject) => {
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(true)
        }
      });
    })
    
  }

  createSuccessPwChangeMessage(emailTo) {
    const message = {
      from: blogAdminEmail,
      to: emailTo,
      subject: 'Password have been changed successfully',
      html: `<h4>Please be informed that your password have been changed successfully.</h4>
              <p>If you have any questions please contact us here: <a href="#">support@blogpost.com</a>`
    }
    return message
  }


  sendPwChangeSuccessEmail(message) {
    return new Promise( (resolve, reject) => {
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(true)
        }
      });
    })
    
  }





}