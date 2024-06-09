
const botFn = async () => {
    try {
        const { Bot } = require('grammy')
        const { autoRetry } = require("@grammyjs/auto-retry");
        const bot = new Bot("")
        

        //config auto retry
        bot.api.config.use(autoRetry)
        bot.catch((err) => {
            const ctx = err.ctx
            console.error(`Error while handling update ${ctx.update.update_id}:`);
        })

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

        process.once("SIGINT", () => bot.stop());
        process.once("SIGTERM", () => bot.stop());

        bot.start().catch(e => console.log(e.message))
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    botFn
}