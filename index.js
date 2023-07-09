const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const getRouter = require('./routes/get-routes')
const elimit = require('express-rate-limit')

const app = express()

//bots
const { Telegraf } = require('telegraf')
const botRegi = new Telegraf(process.env.REGI_TOKEN)
    .catch((err) => console.log(err.message))

// database connection
mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/vyuo-degree?ssl=true&replicaSet=atlas-pyxyme-shard-0&authSource=admin&retryWrites=true&w=majority`)
    .then(() => console.log('Connected to Vyuo Degree'))
    .catch((err) => {
        console.log(err)
    })

const regina_bot = require('./bot/regibot/bot')

const limiter = elimit({
    windowMs: 60 * 1000, // 1 minute
    max: 7, // Limit each IP to 7 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "To many request, please try again after 3 minutes"
})

// MIDDLEWARES
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('trust proxy', true) //our app is hosted on server using proxy to pass user request
app.use(limiter)
app.use(getRouter)

regina_bot.reginaBot(botRegi)

app.listen(process.env.PORT || 3000, async () => {
    try {
        console.log('listen to port 3000')
        await botRegi.launch()
        console.log('bot restarted')
    } catch (error) {
        console.log(error.message)
        await botRegi.telegram.sendMessage(741815228, error.message)
    }
})

process.once('SIGINT', () => botRegi.stop('SIGINT'))
process.once('SIGTERM', () => botRegi.stop('SIGTERM'))

process.on('unhandledRejection', async (reason, promise) => {
    await botRegi.telegram.sendMessage(741815228, reason + ' It is an unhandled rejection.')
    console.log(reason)
})

process.on('uncaughtException', async (err) => {
    console.log(err)
})