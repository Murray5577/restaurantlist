const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

router.get('/', async (req, res) => {
    try {
        const restaurantdatas = await Restaurant.findAll({
            attributes: ['id', 'image', 'name', 'category', 'rating', 'description'],
            raw: true
        })

        const keyword = req.query.search?.trim()
        const matchedRestaurants = keyword ? restaurantdatas.filter((r) => Object.values(r).some((property) => {
            if (typeof property === 'string') {
                return property.toLowerCase().includes(keyword.toLowerCase())
            }
            return false
        })
        ) : restaurantdatas
        res.render('index', { restaurantdatas: matchedRestaurants })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router