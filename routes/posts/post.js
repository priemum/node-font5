const router = require('express').Router()
const { bot1Fn } = require('./bots/bot1/bot1')

router.post('/webhook/bot1', async (req, res)=> {
    try {
        await bot1Fn(router)
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router