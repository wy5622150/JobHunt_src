import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { loadData } from '../../redux/user.redux'
import { connect } from 'react-redux';

@withRouter
// 路由组件专用装饰器
@connect(
    null,
    { loadData }
    //这是redux里的读取，用传入的对象重写redux中的state
)
class AuthRoute extends React.Component {
    componentDidMount() {
        // 如果当前组件path是login或者register，啥也不干
        // 否则向'/user/info'发起请求
        const publicList = ['login', 'register']
        const pathName = this.props.location.pathname
        // 请求失败啥也不干
        if (publicList.indexOf(pathName) > -1) {
            return null
        }
        // 请求成功的话返回一个对象（应该是cookie存在与否决定的User表内的data对象，外加一个code：0属性）
        axios.get('/user/info').then(res => {
            if (res.status == 200) {
                console.log(res.data)
                // 如果code==0，就将与cookie内id匹配的user信息从后端传递给redux
                if (res.data.code == 0) {
                    this.props.loadData(res.data.data)
                }
                // 如果code！=0就返回login页
                else {
                    this.props.history.push('/login')
                }
            }
        })
    }
    render() {
        return null
    }
}

export default AuthRoute