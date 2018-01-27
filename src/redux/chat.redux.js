import axios from 'axios'
import io from 'socket.io-client'
// 上线用这条，本地环境用下面那条
var socket = io.connect('https://salty-beach-72077.herokuapp.com', { secure: true });
// const socket = io('ws://localhost:9093')
const MSG_LIST = 'MSG_LIST'
const MSG_RECV = 'MSG_RECV'
const MSG_READ = 'MSG_READ'
const initState = {
    chatmsg: [],
    users: {},
    unread: 0
}

export function chat(state = initState, action) {
    switch (action.type) {
        // 初始化state
        case MSG_LIST:
            return { ...state, users: action.payload.users, chatmsg: action.payload.msgs, unread: action.payload.msgs.filter(v => !v.read && v.to == action.payload.userid).length }
        // 接收信息
        case MSG_RECV:
            // 如果这条信息目的地id与当前用户id一致 ，n为1，否则为0
            const n = action.payload.to == action.userid ? 1 : 0
            // 在原state基础上，将这条信息加入chatmsg集合，同时unread+n
            return { ...state, chatmsg: [...state.chatmsg, action.payload], unread: state.unread + n }
        case MSG_READ:
            const { from, num } = action.payload
            return { ...state, chatmsg: state.chatmsg.map(v => ({ ...v, read: from == v.from ? true : v.read })), unread: state.unread - num }
        default:
            return state
    }
}
function msgList(msgs, users, userid) {
    return { type: MSG_LIST, payload: { msgs, users, userid } }
}
// 将发的消息传给后端socket
export function sendMsg({ from, to, msg }) {
    return dispatch => {
        // 将{ from, to, msg }提交给socket后端的 'sendmsg'
        socket.emit('sendmsg', { from, to, msg })
    }
}

function msgRecv(msg, userid) {
    return { userid, type: MSG_RECV, payload: msg }
}
function msgRead(from, userid, num) {
    return { type: MSG_READ, payload: { from, userid, num } }
}

export function readMsg(from) {
    return (dispatch, getState) => {
        axios.post('/user/readmsg', { from })
            .then(res => {
                const userid = getState().user._id
                if (res.status == 200 && res.data.code == 0) {
                    dispatch(msgRead({ userid, from, num: res.data.num }))
                }
            })
    }
}

export function recvMsg() {
    return (dispatch, getState) => {
        // socket前端接收到后端'recvmsg'传来的数据后
        socket.on('recvmsg', function (data) {
            // 获取redux中user的mongodb给的id
            const userid = getState().user._id
            // data是写入数据库的那条信息，与当前用户_id匹配捆绑
            dispatch(msgRecv(data, userid))
        })
    }
}

// 只触发一次，用于获取数据库中的信息以及当前登录用户信息初始化redux状态
export function getMsgList() {
    return (dispatch, getState) => {
        axios.get('/user/getmsglist')
        // 返回的msgs中是chat数据库中所有和cookie中user相关的条目，users是含有所有用户id,name和avatar信息的对象
            .then(res => {
                if (res.status == 200 && res.data.code == 0) {
                    // 当前用户id
                    const userid = getState().user._id
                    dispatch(msgList(res.data.msgs, res.data.users, userid))
                }
            })
    }
}