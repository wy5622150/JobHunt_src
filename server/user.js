const express = require('express')
const Router = express.Router()
const models = require('./model')
const User = models.getModel('user')
const Chat = models.getModel('chat')
const utils = require('utility')
const _filter = { 'pwd': 0, '__v': 0 }
// Chat.remove({}, function (e, d) {

// })
// 这里是根据req中的query来决定查询条件
Router.get('/list', function (req, res) {
    const { type } = req.query
    // User.remove({},function(e,d){})
    User.find({ type }, function (err, doc) {
        return res.json({ code: 0, data: doc })
    })
})

Router.get('/getmsglist', function (req, res) {
    const user = req.cookies.userid
    User.find({}, function (e, userdoc) {
        let users = {}
        // userdoc是所有的用户信息
        userdoc.forEach(v => {
            // 这是对象中根据变量字符串新建属性的方法
            users[v._id] = { name: v.user, avatar: v.avatar }
        })
        // 在Chat数据库中查找from或者to属性为cookie中user的条目（和cookie信息相关的条目）
        Chat.find({ '$or': [{ from: user }, { to: user }] }, function (err, doc) {
            if (!err) {
                // doc是chat数据库中所有和user相关的条目，users是含有所有用户id,name和avatar信息的对象
                return res.json({ code: 0, msgs: doc, users: users })
            }
        })
    })
})
// 这里接受的是user和pwd
Router.post('/login', function (req, res) {
    // 事实上服务器这里接收的的type是空值
    const { user, pwd, type } = req.body
    // 通过user和pwd在数据库中查找条目（找到第一条返回）
    User.findOne({ user, pwd: md5Pwd(pwd) }, _filter, function (err, doc) {
        // 没找到返回code：1+报错信息
        if (!doc) {
            return res.json({ code: 1, msg: '用户名或者密码错误' })
        }
        // 找到就响应一个cookie，其中包含从mongodb中自动生成的id
        res.cookie('userid', doc._id)
        // 创建cookie后返回code：0和数据库的查找结果给前端
        return res.json({ code: 0, data: doc })
    })
})

Router.post('/readmsg', function (req, res) {
    const userid = req.cookies.userid
    const { from } = req.body
    console.log(userid, from)
    Chat.update(
        { from, to: userid },
        { '$set': { read: true } },
        { 'multi': true },
        function (err, doc) {
            console.log(doc)
            if (!err) {
                return res.json({ code: 0, num: doc.nModified })
            }
            return res.json({ code: 1, msg: '修改失败' })
        })
})

Router.post('/update', function (req, res) {
    // 先接受cookie
    const userid = req.cookies.userid
    if (!userid) {
        // 若没有cookie直接返回code：1
        return json.dumps({ code: 1 })
    }
    // body是前端提交的data
    const body = req.body
    // 若有cookie,则修改cookie中Id对应的条目内容,用前端提交的data覆盖,
    User.findByIdAndUpdate(userid, body, function (err, doc) {
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type
        }, body)
        // 并且返回cookie中Id对应条目的全部信息给前端
        return res.json({ code: 0, data })
    })
})
// 前端请求中包含user,pwd,type
Router.post('/register', function (req, res) {
    const { user, pwd, type } = req.body
    // user在数据库中已经存在则返回已有存在用户msg和code：1
    User.findOne({ user }, function (err, doc) {
        if (doc) {
            return res.json({ code: 1, msg: '用户名重复' })
        }
        // 如果user不存在则用user相关信息新建一个条目userModel
        const userModel = new User({ user, type, pwd: md5Pwd(pwd) })
        // 将userModel存入数据库
        userModel.save(function (e, d) {
            // 存入出错
            if (e) {
                return res.json({ code: 1, msg: '后端出错了' })
            }
            // 存入成功的话通过返回数据中id创建cookie
            const { user, type, _id } = d
            res.cookie('userid', _id)
            // 并将user,type,id以及code：0返回给前端redux
            return res.json({ code: 0, data: { user, type, _id } })
        })
    })
})

// 如果请求中含有cookie，在User数据库中查找cookie中Id对应的数据+code：0一起返回
// 否则，直接返回code：1
Router.get('/info', function (req, res) {
    const { userid } = req.cookies
    if (!userid) {
        return res.json({ code: 1 })
    }
    User.findOne({ _id: userid }, _filter, function (err, doc) {
        if (err) {
            return res.json({ code: 1, msg: '后端出错' })
        }
        if (doc) {
            return res.json({ code: 0, data: doc })
        }
    })
})
// 对pwd进行MD5 hash
function md5Pwd(pwd) {
    const salt = 'imooc_is_good_3957x8yza6!@#IUHJh~~'
    return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router