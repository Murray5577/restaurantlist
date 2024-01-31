const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const port = 3000
const restaurantDatas = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect('/restaurants')
})

app.get('/restaurants',(req,res)=>{
    const keyword = req.query.search
    const matchedRestaurants = keyword ? restaurantDatas.filter((rd) => Object.values(rd).some((property)=>{
        if (typeof property === 'string'){
            return property.toLowerCase().includes(keyword.toLowerCase())
        }
        return false
    }) 
    ) : restaurantDatas
    res.render('index', { restaurantDatas: matchedRestaurants })
})

app.get('/restaurants/:id',(req,res)=>{
    const id = req.params.id
    const restaurant = restaurantDatas.find((rd)=>rd.id.toString() === id)
    res.render('detail', { restaurant })
})

app.listen(port,()=>{
    console.log(`123456`)
})