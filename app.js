const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const port = 3000
const restaurantDatas = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect('/restaurants')
})

app.get('/restaurants',(req,res)=>{
    return Restaurant.findAll({
        attributes: ['id', 'name','createdAt'],
        raw: true
    })
        .then((restaurants) => res.send({ restaurants }))
        .catch((err)=>res.status(422).json(err))

    /*
    const keyword = req.query.search
    const matchedRestaurants = keyword ? restaurantDatas.filter((rd) => Object.values(rd).some((property)=>{
        if (typeof property === 'string'){
            return property.toLowerCase().includes(keyword.toLowerCase())
        }
        return false
    }) 
    ) : restaurantDatas
    res.render('index', { restaurantDatas: matchedRestaurants })*/
})

app.get('/restaurants/:id',(req,res)=>{
    const id = req.params.id
    const restaurant = restaurantDatas.find((rd)=>rd.id.toString() === id)
    res.render('detail', { restaurant })
})

app.get('/restaurants/new',(req,res)=>{
    res.send('create new restaurant')
})

app.get('/restaurants/:id/edit',(req,res)=>{
    res.send(`edit ${req.params.id} restaurants`)
})

app.post('/restaurants',(req,res)=>{
    res.send('post new restaurant')
})

app.put('/restaurants/:id',(res,req)=>{
    res.send('update new restaurants')
})

app.delete('/restaurant/:id',(res,req)=>{
    res.send('delete new restaurants')
})

app.listen(port,()=>{
    console.log(`123456`)
})