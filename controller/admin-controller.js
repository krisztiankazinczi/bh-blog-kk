module.exports = class AdminController {
    get(req,res) {
        res.render('admin', {layout: 'main-login'})
    }
}

