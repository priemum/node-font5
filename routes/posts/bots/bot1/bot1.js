const { Telegraf } = require('telegraf')
const axios = require('axios').default

const bot1Fn = async () => {
    try {
        const bot = new Telegraf(process.env.HOOK)

        bot.command('mama', async ctx => {
            try {
                await ctx.reply('Mama yako ni selina')
            } catch (err) {
                console.log(err.message)
            }
        })

        bot.on('message', async ctx => {
            try {
                await ctx.reply('Hello, welcome')
            } catch (error) {
                console.log(error.message)
            }
        })
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    bot1Fn
}