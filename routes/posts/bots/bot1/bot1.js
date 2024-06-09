const { Telegraf } = require('telegraf')
const axios = require('axios').default

const bot1Fn = async (app) => {
    try {
        const bot = new Telegraf(process.env.HOOK)
        if (process.env.ENVIRONMENT == 'production') {
            let wh = `${process.env.DOMAIN}/webhook/bot1`
            app.use(await bot.createWebhook({ domain:  wh}));
        }

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


        if (process.env.ENVIRONMENT == 'production') {
            //
        } else {
            bot.launch().catch(e => console.log(e.message))
        }
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    bot1Fn
}