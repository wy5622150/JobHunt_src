import axios from 'axios'

const USER_LIST = 'USER_LIST'

const initState = {
    userlist: []
}

export function chatuser(state=initState, action) {
    switch (action.type) {
        case USER_LIST:
        // 将userlist改成从后端发来的筛选过的数据
            return { ...state, userlist: action.payload }
        default: return state
    }
}

function userList(data) {
    return { type: USER_LIST, payload: data }
}
// 向后端user/list发起带有筛选type的请求
export function getUserList(type) {
    return dispatch => {
        axios.get('user/list?type='+type)
            .then(res => {
                // 返回的数据dispatch一个userlist，对象数组
                if (res.data.code == 0) {
                    dispatch(userList(res.data.data))
                }
            })
    }
}