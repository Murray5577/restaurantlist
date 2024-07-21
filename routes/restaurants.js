const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const {Op} = require('sequelize')

router.get('/', async(req, res,next) => {
    const page = parseInt(req.query.page)||1
    const limit = 9
    
    const sort = req.query.sort

    let sortCondition = []
    switch(sort){
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

    const searchOptions = keyword?{
        [Op.or]: [
            {name: {[Op.like]: `%${keyword}%`}},
            {name_en: {[Op.like]: `%${keyword}%`}},
            {category: {[Op.like]: `%${keyword}%`}},
            {description: {[Op.like]: `%${keyword}%`}},
        ]
    }:{}

    let restaurantCount=''
    if (keyword){
        restaurantCount = await Restaurant.count({
            where: searchOptions,
        })
    }else{
        restaurantCount = await Restaurant.count()
    }

    const maxPage = Math.ceil(restaurantCount / limit)

    return await Restaurant.findAll({
        attributes: ['id', 'image', 'name', 'name_en','category', 'location','rating', 'description'],
        where: searchOptions,
        order: sortCondition,
        //order: sortOptions[sort],
        offset:(page-1)*limit,
        limit,
        raw: true
    })
        .then((restaurantdatas) => res.render('index', { 
            restaurantdatas,
            page,
            prev:page>1?page-1:page,
            next:page<maxPage?page+1:maxPage,
            maxPage,
            keyword
         }))
        .catch((error) => {
            error.errorMessage='載入資料失敗'
            next(error)
        })
})

/* 順序不對，會造成錯誤 */
router.get('/new', (req, res) => {
    return res.render('new')
})

router.get('/:id', (req, res,next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description'],
        raw: true
    })
        .then((restaurant) => res.render('detail', { restaurant }))
        .catch((error) => {
            error.errorMessage='載入分頁失敗'
            next(error)
        })
    //const restaurant = restaurantDatas.find((rd)=>rd.id.toString() === id)
    //res.render('detail', { restaurant })
})


router.get('/:id/edit', (req, res,next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
        raw: true
    })
        .then((restaurant) => res.render('edit', { restaurant }))
        .catch(()=>{
            error.errorMessage = '載入分頁失敗'
            next(error)
        })
})

router.post('/', (req, res,next) => {
    const create = req.body
    return Restaurant.create({
        name: create.name,
        name_en: create.name_en,
        category: create.category,
        image: create.image,
        location: create.location,
        phone: create.phone,
        google_map: create.google_map,
        rating: create.rating,
        description: create.description
    })
        .then(() => {
            req.flash('success','新增成功')
            res.redirect('/restaurants')
        })
        .catch((error) => {
            error.errorMessage='新增失敗'
            next(error)
        })
})

router.put('/:id', (req, res,next) => {
    const body = req.body
    const id = req.params.id

    return Restaurant.update({
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
})

router.delete('/:id', (req, res,next) => {
    const id = req.params.id

    return Restaurant.destroy({ where: { id } })
        .then(() => {
            req.flash('success','刪除成功')
            res.redirect("/restaurants")
        })
        .catch(()=>{
            error.errorMessage='刪除失敗'
            next(error)
        })
})

module.exports=router