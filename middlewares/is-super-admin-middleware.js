module.exports = function isSuperAdminMiddleware(req, res, next) {

  if (req.session.user.isSuperAdmin === 0) {
    res.status(403).redirect('http://localhost:3000/admin')
    return
  }

  next()
}