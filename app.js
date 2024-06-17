const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const port = 3000
//const restaurantDatas = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/',(req,res)=>{
    res.redirect('/restaurants')
})

app.get('/restaurants',async(req,res)=>{
    try{
        const restaurantdatas = await Restaurant.findAll({
            attributes: ['id', 'image', 'name', 'category', 'rating'],
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
    }catch(err){
        console.log(err)
    }
    /*
    return Restaurant.findAll({
        attributes: ['id', 'image', 'name', 'category', 'rating'],
        raw: true
    })
        .then((restaurantdatas) => res.render('index',{ restaurantdatas }))
        .catch((err)=>res.status(422).json(err))

    
    const keyword = req.query.search
    const matchedRestaurants = keyword ? restaurantDatas.filter((rd) => Object.values(rd).some((property)=>{
        if (typeof property === 'string'){
            return property.toLowerCase().includes(keyword.toLowerCase())
        }
        return false
    }) 
    ) : restaurantDatas
    res.render('index', { restaurantDatas: matchedRestaurants })
    */
})
/* 順序不對，會造成錯誤 */
app.get('/restaurants/new', (req, res) => {
    return res.render('new')
})

app.get('/restaurants/:id',(req,res)=>{
    const id = req.params.id
    return Restaurant.findByPk(id,{
        attributes: ['id','name', 'category','image', 'location', 'google_map', 'phone','description'],
        raw: true
    })
        .then((restaurant) => res.render('detail', { restaurant }))
        .catch((err) => res.status(422).json(err))
    //const restaurant = restaurantDatas.find((rd)=>rd.id.toString() === id)
    //res.render('detail', { restaurant })
})


app.get('/restaurants/:id/edit',(req,res)=>{
    const id = req.params.id
    return Restaurant.findByPk(id,{
        attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating','description'],
        raw:true
    })
        .then((restaurant) => res.render('edit', { restaurant }))
})

app.post('/restaurants',(req,res)=>{
    const create = req.body
    return Restaurant.create({
        name:create.name,
        name_en:create.name_en,
        category: create.category,
        image: create.image,
        location: create.location,
        phone: create.phone,
        google_map: create.google_map,
        rating: create.rating,
        description: create.description
    })
        .then(() => res.redirect('/restaurants'))
        .catch((err) => console.log(err))
})

app.put('/restaurants/:id',(req,res)=>{
    const body = req.body
    const id = req.params.id

    return Restaurant.update({
        name:body.name,
        name_en:body.name_en,
        category: body.category,
        image: body.image,
        location: body.location,
        phone: body.phone,
        google_map: body.google_map,
        rating: body.rating,
        description: body.description
    },{where:{id}})
        .then(()=>res.redirect(`/restaurants/${id}`))
})

app.delete('/restaurants/:id',(req,res)=>{
    const id = req.params.id

    return Restaurant.destroy({where:{id}})
        .then(() => res.redirect("/restaurants"))
})

app.listen(port,()=>{
    console.log(`123456`)
})