const { Telegraf } = require('telegraf')

const bot2Fn = async (app) => {
    try {
        const bot = new Telegraf(process.env.HOOK2)
        if (process.env.ENVIRONMENT == 'production') {
            const webhook = `https://api.telegram.org/bot${process.env.HOOK2}/setWebhook?url=${process.env.DOMAIN}/webhook/bot2`
            let info = await axios.get(webhook)
            console.log(info.data)
        }

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
            bot.launch({
                webhook: {
                    domain: process.env.DOMAIN,
                    hookPath: '/webhook/bot2',
                    port: process.env.PORT
                }
            }).catch(e => console.log(e.message))
        } else {
            bot.launch().catch(e=> console.log(e.message))
        }
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    bot2Fn
}