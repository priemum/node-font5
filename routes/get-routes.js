const router = require('express').Router()
const vyuo_deg_db = require('../model/vyuo-degree')
const mkoa_db = require('../model/vyuo-degree')
const ds_users = require('../model/dramastore-users')

const {Telegraf} = require('telegraf')
const bot = new Telegraf(process.env.DS_TOKEN)
const bot_oh = new Telegraf(process.env.OH_TOKEN)

//send success (no content) response to browser
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/', async (req, res) => {
    try {
        let vyuo_deg_db = await mkoa_db.find().sort('name')
        let vyuo = []
        vyuo_deg_db.forEach(chuo => {
            vyuo.push(
                { name: chuo.name, code: chuo.code, own: chuo.owner, type: chuo.type, loc: chuo.location }
            )
        })
        res.render('1-home/home', { vyuo })
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }

})

router.get('/latra', (req, res) => {
    res.redirect('https://www.latra.go.tz/')
})

router.get('/privacy', (req, res)=> {
    res.render('zzzpages/privacy')
})

router.get('/terms', (req, res)=> {
    res.render('zzzpages/terms')
})

router.get('/disclaimer', (req, res)=> {
    res.render('zzzpages/disclaimer')
})

router.get('/contact', (req, res)=> {
    res.render('zzzpages/contact')
})

router.get('/about', (req, res)=> {
    res.render('zzzpages/about')
})

router.get('/blog', (req, res)=> {
    res.redirect(301, '/')
})

router.get(['/blog/post.html', '/blog/post'], async (req, res)=> {
    let vyuo_count = await vyuo_deg_db.countDocuments()
    let rand = Math.floor(Math.random() * vyuo_count)
    let rand_chuo = await vyuo_deg_db.findOne().skip(rand)
    res.render('3-landing/land', {rand_chuo})
})

router.get(['/pages/telegram.html', '/pages/telegram', '/pages/oh-telegram', '/pages/oh-telegram.html'], (req, res)=> {
    res.render('4-old-landing/land')
})

router.get('/req/:uid/:msgid', async (req, res)=> {
    let userId = Number(req.params.uid.trim())
    let msgid = Number(req.params.msgid.trim())

    try {
        await bot.telegram.copyMessage(userId, -1001239425048, msgid)
        let user = await ds_users.findOneAndUpdate({userId}, {$inc: {downloaded: 1}}, {new: true})
        console.log(user.fname + " - Got episode by req")
        res.render('5-epsent/sent', {user})
    } catch (err) {
        console.log(err)
        console.log(err.message)
        res.send('<h2 style="color: red;">Error:... </h2> ' + err.message)
    }
})

router.get('/oh-req/:uid/:mid', async (req, res)=> {
    let userId = Number(req.params.uid.trim())
    let msgId = Number(req.params.mid.trim())

    try {
        await bot_oh.telegram.copyMessage(userId, -1001586042518, msgId)
        console.log(userId + " - Got episode by req")
        res.render('6-showsent/sent', {userId})
    } catch (err) {
        console.log(err)
        console.log(err.message)
        res.send('<h2 style="color: red;">Error:... </h2> ' + err.message)
    }
})

router.get('/:code', async (req, res) => {
    let code = req.params.code

    try {
        let chuo = await vyuo_deg_db.findOne({ code })
        let all = await vyuo_deg_db.find().sort('name').select('name code')
        res.render('2-chuo/chuo', { chuo, all })
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }
})

module.exports = router