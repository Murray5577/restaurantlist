module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user_name = req.user.name || `會員(${req.user.name})`
        return next()
    }

    req.flash('error', '尚未登入')
    return res.redirect('/login')
}