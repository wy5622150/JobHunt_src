const express = require('express')
const userRouter = require('./user')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const models = require('./model')
const Chat = models.getModel('chat')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function (socket) {
    console.log('user login')
    socket.on('sendmsg', function (data) {
        // 接收socket前端的'sendmsg'数据{ from, to, msg }
        const { from, to, msg } = data
        // 将from和to拼接作为当前信息的id
        const chatid = [from, to].sort().join('_')
        // 将该条信息条目写入Chat数据库
        Chat.create({ chatid, from, to, content: msg }, function (err, doc) {
            // 写入数据库后将该消息条目转发给socket前端的'recvmsg'
            io.emit('recvmsg', Object.assign({}, doc._doc))
        })

    })
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)
app.use(function(req,res,next){
    if (req.url.startsWith('/user/')||req.url.startsWith('/static/')){
        return next()
    }
    return res.sendFile(path.resolve('build/index.html'))
})
app.use('/', express.static(path.resolve('build')))
server.listen(9093, function () {
    console.log('app at port 9093')
})

