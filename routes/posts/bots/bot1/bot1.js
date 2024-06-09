const { Telegraf } = require('telegraf')

const bot1Fn = async () => {
    try {
        const bot = new Telegraf(process.env.HOOK)

        bot.command('mama', async ctx=> {
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


        if(process.env.ENVIRONMENT == 'production') {
            bot.telegram.setWebhook(`https://node-font5-production.up.railway.app/webhook/bot1`)
            .catch(e => console.log(e.message, e))
        } else {
            bot.launch().catch(e=> console.log(e.message))
        }
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    bot1Fn
}