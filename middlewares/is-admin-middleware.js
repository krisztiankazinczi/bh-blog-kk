module.exports = function isAdminMiddleware(req, res, next) {

  // in the authMiddleware I have put the userdetails into the req.session
  if (req.session.user.isAdmin === 0) {
    res.status(403).redirect('http://localhost:3000/admin')
    return
  }

  next()
}