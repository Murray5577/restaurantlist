const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

const router = require('./routes')

const flash = require('connect-flash')
const session = require('express-session')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

const handlebars = require('handlebars')
const passport = require('./config/passport')

handlebars.registerHelper('equal', (arg1, arg2) => {
    return arg1 === arg2
})
const port = 3000
//const restaurantDatas = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: false
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Express server is running on http://localhost:3000`)
})