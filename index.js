const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const getRouter = require('./routes/get-routes')
const elimit = require('express-rate-limit')
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.HOOK)

const app = express()

// database connection
mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/vyuo-degree?ssl=true&replicaSet=atlas-pyxyme-shard-0&authSource=admin&retryWrites=true&w=majority`)
    .then(() => console.log('Connected to Vyuo Degree'))
    .catch((err) => {
        console.log(err)
    })

const limiter = elimit({
    windowMs: 60 * 1000, // 1 minute
    max: 7, // Limit each IP to 7 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "To many request, please try again after 3 minutes"
})

// MIDDLEWARES
app.use(bot.webhookCallback('/webhook/bot'))
bot.on('message', async ctx=> {
    try {
        await ctx.reply('Hello, welcome')
    } catch (error) {
        console.log(error.message)
    }
})
bot.telegram.setWebhook('https://font5.onrender.com/webhook/bot')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('trust proxy', true) //our app is hosted on server using proxy to pass user request
app.use(limiter)
app.use(getRouter)


app.listen(process.env.PORT || 3000, ()=> console.log('Listen to port 3000'))

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason)
    //on production here process will change from crash to start cools
})

process.on('uncaughtException', async (err) => {
    console.log(err)
})

process.on('warning', e => console.warn(e.stack));