const router = require('express').Router()
const vyuo_deg_db = require('../model/vyuo-degree')
const mkoa_db = require('../model/vyuo-degree')
const ds_users = require('../model/dramastore-users')
const bin_db = require('../model/bin')
const analytics = require('../model/analytics')
const graphModel = require('../model/graph-tips')

//times
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const { Telegraf } = require('telegraf')
const { application } = require('express')
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

router.get('/privacy', (req, res) => {
    res.render('zzzpages/privacy')
})

router.get('/terms', (req, res) => {
    res.render('zzzpages/terms')
})

router.get('/disclaimer', (req, res) => {
    res.render('zzzpages/disclaimer')
})

router.get('/contact', (req, res) => {
    res.render('zzzpages/contact')
})

router.get('/about', (req, res) => {
    res.render('zzzpages/about')
})

router.get('/blog', (req, res) => {
    res.redirect(301, '/')
})

router.get('/withdraw-tax-1xbet-tanzania', (req, res)=> {
    res.render('7-1xbet/calc')
})

router.get(['/blog/post.html', '/blog/post'], async (req, res) => {
    let vyuo_count = await vyuo_deg_db.countDocuments()
    let rand = Math.floor(Math.random() * vyuo_count)
    let rand_chuo = await vyuo_deg_db.findOne().skip(rand)
    res.render('3-landing/land', { rand_chuo })
})

router.get(['/pages/telegram.html', '/pages/telegram', '/pages/oh-telegram', '/pages/oh-telegram.html'], (req, res) => {
    res.render('4-old-landing/land')
})

router.get('/req/:uid/:msgid', async (req, res) => {
    let userId = Number(req.params.uid.trim())
    let msgid = Number(req.params.msgid.trim())

    try {
        let bin = await bin_db.findOne({ uid: `${userId}`, mid: `${msgid}`, ch: 'ds' })
        if (!bin) {
            await bot.telegram.copyMessage(userId, -1001239425048, msgid)
            let user = await ds_users.findOneAndUpdate({ userId }, { $inc: { downloaded: 1 } }, { new: true })
            await bin_db.create({ uid: `${userId}`, mid: `${msgid}`, ch: 'ds' })
            await analytics.findOneAndUpdate({}, {$inc: {times: 1}})
            console.log(`${user.fname} - Got episode by req`)
        }
        res.redirect(`/dramastore/success/${userId}`)
    } catch (err) {
        console.log(err)
        console.log(err.message)
        res.send('<h2 style="color: red;">Error:... </h2> ' + err.message)
    }
})

router.get('/dramastore/success/:userId', async (req, res) => {
    let userId = req.params.userId

    try {
        let user = await ds_users.findOne({ userId })
        let users = await ds_users.find().sort('-downloaded').select('fname downloaded updatedAt userId').limit(1000)
        let wote = []
        for (let huyu of users) {
            if(huyu.userId == 1473393723) {
                wote.push({fname: huyu.fname, downloaded: huyu.downloaded, last: '🤪🤪🤪'})
            } else {
                wote.push({fname: huyu.fname, downloaded: huyu.downloaded, last: timeAgo.format(new Date(huyu.updatedAt))})
            }
        }
        let all_users = await ds_users.find().sort('-downloaded').select('fname downloaded')
        let rnk = all_users.findIndex(d => d.fname == user.fname) + 1
        res.render('5-epsent/sent', { user, wote, rnk })
    } catch (err) {
        console.log(err)
        console.log(err.message)
        res.send('<h2 style="color: red;">Error:... </h2> ' + err.message)
    }
})

router.get('/oh-req/:uid/:mid', async (req, res) => {
    let userId = Number(req.params.uid.trim())
    let msgId = Number(req.params.mid.trim())

    try {
        let check_bin = await bin_db.findOne({ uid: `${userId}`, mid: `${msgId}`, ch: 'oh' })
        if (!check_bin) {
            await bot_oh.telegram.copyMessage(userId, -1001586042518, msgId)
            await bin_db.create({ uid: `${userId}`, mid: `${msgId}`, ch: 'oh' })
            console.log(userId + " - Got porn by req")
        }
        res.redirect(`/ohmy-channel/success/${userId}`)
    } catch (err) {
        console.log(err)
        console.log(err.message)
        res.send('<h2 style="color: red;">Error:... </h2> ' + err.message)
    }
})

router.get('/ohmy-channel/success/:uid', async (req, res) => {
    let userId = Number(req.params.uid.trim())
    res.render('6-showsent/sent', { userId })
})

router.get('/mkekawaleo/tanzania', async (req, res)=> {
    try {
        res.redirect('http://mkekawaleo.com/betslip/leo')
        await graphModel.findOneAndUpdate({siku: '22/04/2023'}, {$inc: {loaded: 1}})
    } catch (err) {
        console.log(err.message)
    }
})

router.get('/:code', async (req, res) => {
    let code = req.params.code

    try {
        let chuo = await vyuo_deg_db.findOne({ code })
        let all = await vyuo_deg_db.find().sort('name').select('name code')
        if (!chuo) {
            res.sendStatus(404)
        } else {
            res.render('2-chuo/chuo', { chuo, all })
        }
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }
})

router.all('*', (req, res) => {
    res.sendStatus(404)
})

module.exports = router