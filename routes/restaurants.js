const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const { Op } = require('sequelize')

router.get('/', async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = 9
    const userId = req.user.id

    const sort = req.query.sort

    let sortCondition = []
    switch (sort) {
        case 'asc':
            sortCondition = [['name', 'ASC']]
            break;
        case 'desc':
            sortCondition = [['name', 'DESC']]
            break;
        case 'category':
            sortCondition = [['category', 'ASC']]
            break;
        case 'location':
            sortCondition = [['location', 'ASC']]
            break;
        case 'ratingASC':
            sortCondition = [['rating', 'ASC']]
            break;
        case 'ratingDESC':
            sortCondition = [['rating', 'DESC']]
            break;
    }
    /*
    const sortOptions = {
        asc: [['name', 'ASC']],
        desc: [['name', 'DESC']],
        category: [['category', 'ASC']],
        location: [['location', 'ASC']],
        ratingASC:[['rating','ASC']],
        ratingDESC:[['rating','DESC']],
    }; */

    const keyword = req.query.search?.trim().toLowerCase()

    const searchOptions = keyword ? {
        [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { name_en: { [Op.like]: `%${keyword}%` } },
            { category: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } },
        ]
    } : {}

    let restaurantCount = ''
    if (keyword) {
        restaurantCount = await Restaurant.count({
            where: searchOptions,
        })
    } else {
        restaurantCount = await Restaurant.count()
    }

    const maxPage = Math.ceil(restaurantCount / limit)

    return await Restaurant.findAll({
        attributes: ['id', 'image', 'name', 'name_en', 'category', 'location', 'rating', 'description', 'userId'],
        where: { [Op.and]: [searchOptions, { userId: userId }] },
        order: sortCondition,
        //order: sortOptions[sort],
        offset: (page - 1) * limit,
        limit,
        raw: true
    })
        .then((restaurantdatas) => res.render('index', {
            restaurantdatas,
            page,
            prev: page > 1 ? page - 1 : page,
            next: page < maxPage ? page + 1 : maxPage,
            maxPage,
            keyword,
            sort
        }))
        .catch((error) => {
            error.errorMessage = '載入資料失敗'
            next(error)
        })
})

/* 順序不對，會造成錯誤 */
router.get('/new', (req, res) => {
    return res.render('new')
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    const userId = req.user.id

    return Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description', 'userId'],
        raw: true
    })
        .then((restaurant) => {
            if (!restaurant) {
                req.flash('error', '找不到資料')
                return res.redirect('/restaurants')
            }
            if (restaurant.userId !== userId) {
                req.flash('error', '權限不足')
                return res.redirect('/restaurants')
            }
            res.render('detail', { restaurant })
        })
        .catch((error) => {
            error.errorMessage = '載入分頁失敗'
            next(error)
        })
    //const restaurant = restaurantDatas.find((rd)=>rd.id.toString() === id)
    //res.render('detail', { restaurant })
})


router.get('/:id/edit', (req, res, next) => {
    const id = req.params.id
    const userId = req.user.id

    return Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
        raw: true
    })
        .then((restaurant) => {
            if (!restaurant) {
                req.flash('error', '找不到資料')
                return res.redirect('/restaurants')
            }
            if (restaurant.userId !== userId) {
                req.flash('error', '權限不足')
                return res.redirect('/restaurants')
            }
            return res.render('edit', { restaurant })
        })
        .catch(() => {
            error.errorMessage = '載入分頁失敗'
            next(error)
        })
})

router.post('/', (req, res, next) => {
    const create = req.body
    const userId = req.user.id

    return Restaurant.create({
        name: create.name,
        name_en: create.name_en,
        category: create.category,
        image: create.image,
        location: create.location,
        phone: create.phone,
        google_map: create.google_map,
        rating: create.rating,
        description: create.description,
        userId: userId
    })
        .then(() => {
            req.flash('success', '新增成功')
            res.redirect('/restaurants')
        })
        .catch((error) => {
            error.errorMessage = '新增失敗'
            next(error)
        })
})

router.put('/:id', (req, res, next) => {
    const body = req.body
    const id = req.params.id
    const userId = req.user.id

    return Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description', 'userId'],
    })
        .then((restaurant) => {
            if (!restaurant) {
                req.flash('error', '找不到資料')
                return res.redirect('/restaurants')
            }
            if (restaurant.userId !== userId) {
                req.flash('error', '權限不足')
                return res.redirect('/restaurants')
            }
            return restaurant.update({
                name: body.name,
                name_en: body.name_en,
                category: body.category,
                image: body.image,
                location: body.location,
                phone: body.phone,
                google_map: body.google_map,
                rating: body.rating,
                description: body.description
            }, { where: { id } })
                .then(() => {
                    req.flash('success', '修改成功')
                    res.redirect(`/restaurants/${id}`)
                })

        })
        .catch((error) => {
            error.errorMessage = '更新失敗'
            next(error)
        })

    /*return Restaurant.update({
        name: body.name,
        name_en: body.name_en,
        category: body.category,
        image: body.image,
        location: body.location,
        phone: body.phone,
        google_map: body.google_map,
        rating: body.rating,
        description: body.description
    }, { where: { id } })
        .then(() => {
            req.flash('success', '修改成功')
            res.redirect(`/restaurants/${id}`) 
        })
        .catch(()=>{
            error.errorMessage='修改失敗'
            next(error)
        })
        */
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    const userId = req.user.id

    return Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description', 'userId'],
        //不能用 raw:true，恩為下面return restaurant.destroy是用小寫restaurant而不是大寫'Restaurant'
    })
        .then((restaurant) => {
            if (!restaurant) {
                req.flash('error', '找不到資料')
                return res.redirect('/restaurants')
            }
            if (restaurant.userId !== userId) {
                req.flash('error', '權限不足')
                return res.redirect('/restaurants')
            }
            return restaurant.destroy({ where: { id } })
                .then(() => {
                    req.flash('success', '刪除成功')
                    res.redirect("/restaurants")
                })
        })
        .catch((error) => {
            error.errorMessage = '刪除失敗'
            next(error)
        })

})

module.exports = router