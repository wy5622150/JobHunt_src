import React from 'react'
import { connect } from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import NavLinkBar from '../navlink/navlink'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../../component/msg/msg'
import { getMsgList, sendMsg, recvMsg } from '../../redux/chat.redux';

// 这里传入所有redux状态，包含user,chat,chatuser
@connect(
    state => state,
    { getMsgList, recvMsg }
)
class Dashboard extends React.Component {
    componentDidMount() {
        // 如果redux中chat下的chatmsg长度为零
        if (!this.props.chat.chatmsg.length) {
            // 初始化chat.redux数据，与后台数据库同步
            this.props.getMsgList()
            // 接收信息，修改redux，触发render
            this.props.recvMsg()
        }
    }
    render() {
        // 当前dashboard组件路径
        const { pathname } = this.props.location
        // 当前redux中user的state
        const user = this.props.user
        // 这是dashboard能够路由到的子组件对象信息集合
        const navList = [
            {
                path: '/boss',
                text: '牛人',
                icon: 'boss',
                title: '牛人列表',
                component: Boss,
                hide: user.type == 'genius'
            },
            {
                path: '/genius',
                text: 'boss',
                icon: 'job',
                title: 'BOSS列表',
                component: Genius,
                hide: user.type == 'boss'
            },
            {
                path: '/msg',
                text: '消息',
                icon: 'msg',
                title: '消息列表',
                component: Msg
            },
            {
                path: '/me',
                text: '我',
                icon: 'user',
                title: '个人中心',
                component: User
            }
        ]
        return (
            <div>
                {/* 通过当前dashboard组件的路径判断导航栏内容 */}
                <NavBar className='fixed-header' mode='dard'>{navList.find(v => v.path == pathname).title}</NavBar>
                <div style={{ marginTop: 45 }}>
                    <Switch>
                        {/* 路由组件到Boss,Genius,Msg,User */}
                        {navList.map(v => (
                            <Route key={v.path} path={v.path} component={v.component}></Route>
                        ))}
                    </Switch>
                </div>
                {/* 底部导航组件，传入子组件信息集合 */}
                <NavLinkBar data={navList}></NavLinkBar>
            </div>
        )
    }
}

export default Dashboard