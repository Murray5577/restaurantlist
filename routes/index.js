const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const users = require('./users')

const passport = require('passport')
const authHandler = require('../middlewares/auth-handler')


router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)

router.get('/', (req, res) => {
    res.redirect('/restaurants')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/logout', (req, res) => {
    req.logout((error) => {
        if (error) {
            next(error)
        }

        return res.redirect('/login')
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router