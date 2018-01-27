import axios from 'axios'
import { getRedirectPath } from './../util'

// const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const ERROR_MSG = 'ERROR_MSG'
// const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOAD_DATA = 'LOAD_DATA'
const LOGOUT = 'LOGOUT'
const initState = {
    redirectTo: '',
    // isAuth: false,
    msg: '',
    user: '',
    type: '',
}

export function user(state = initState, action) {
    switch (action.type) {
        // 在当前state基础上，用payload更新并覆盖，清空报错msg，根据payload中type值来决定redirectTo为boss页还是genius页
        case AUTH_SUCCESS:
            return { ...state, msg: '', redirectTo: getRedirectPath(action.payload), ...action.payload }
        case LOAD_DATA:
            return { ...state, ...action.payload }
        case ERROR_MSG:
            return { ...state, isAuth: false, msg: action.msg }
        case LOGOUT:
            return { ...initState, redirectTo: '/login' }
        default:
            return state
    }
}
// obj对应被调用时，父方法的data，这里就是提取密码信息
function authSuccess(obj) {
    // 将obj拆分成pwd和data
    const { pwd, ...data } = obj
    // 只将data传给payload
    return { type: AUTH_SUCCESS, payload: data }
}


// 提交报错信息
function errorMsg(msg) {
    return { msg, type: ERROR_MSG }
}
// 配合路由组件来更新当前用户信息
export function loadData(userinfo) {
    return { type: LOAD_DATA, payload: userinfo }
}
// 登出
export function logoutSubmit() {
    return { type: LOGOUT }
}
// 传入的data
// data = {
// title: '',
// desc:'',
// company:'',
// money:''
// }
export function update(data) {
    return dispatch => {
        // 先将data提交给服务器端的'/user/update'
        axios.post('/user/update', data)
            // 后端返回的res是个findByIdAndUpdate数据库的结果并且带有code：0
            .then(res => {
                // 如果提交成功且code：0则分发authSuccess动作
                if (res.status == 200 && res.data.code == 0) {
                    dispatch(authSuccess(res.data.data))
                }
                // 否则报错
                else {
                    dispatch(errorMsg(res.data.msg))
                }
            })
    }
}
// 从login.js传入user和pwd
export function login({ user, pwd }) {
    // user和pwd任意为空则dispatch一个报错action
    if (!user || !pwd) {
        return errorMsg('用户密码必须输入')
    }
    return dispatch => {
        // 向服务器'/user/login'提交用户名和密码
        axios.post('/user/login', { user, pwd }).then(res => {
            // 返回数据库中匹配user和pwd的条目所有内容，以及code
            if (res.status == 200 && res.data.code == 0) {
                // 批准登陆，将匹配条目传给authSuccess方法
                dispatch(authSuccess(res.data.data))
            }
            else {
                // 不批准
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}
// 传入user,pwd,reapeatpwd,type，然后让后端数据库new一个条目
export function register({ user, pwd, repeatpwd, type }) {
    // 筛选条件，不符合就dispatch报错信息
    if (!user || !pwd || !type) {
        return errorMsg('用户名密码必须输入')
    }
    if (pwd != repeatpwd) {
        return errorMsg('密码和确认密码不同')
    }
    return dispatch => {
        // 提交user,pwd,type给服务器'/user/register'
        axios.post('/user/register', { user, pwd, type }).then(res => {
            // 后端应该返回user,type,id以及code：0
            if (res.status == 200 && res.data.code == 0) {
                // 这里用的是请求的data内容
                dispatch(authSuccess({ user, pwd, type }))
            }
            else {
                // 如果后端出错这里返回后端传回的报错
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}