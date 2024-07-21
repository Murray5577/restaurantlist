const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const search = require('./search')

router.use('/restaurants',restaurants)

//router.use('/search',search)

router.get('/', (req, res) => {
    res.redirect('/restaurants')
})

module.exports=router