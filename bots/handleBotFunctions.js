const handlePriceBots = async () => {
    const call_price_fn = require('./pricebots/bot')
    const priceModel = require('./database/pricebots')


    try {
        if(process.env.ENVIRONMENT == 'local') {
            let info = await priceModel.find()
            for (let bot of info) {
               await call_price_fn.checkPriceFn(bot.token, bot.path, bot.name, bot.symbol)
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {handlePriceBots}