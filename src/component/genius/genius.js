import React from 'react'
import axios from 'axios'
import { Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { connect } from 'react-redux';
import { getUserList } from './../../redux/chatuser.redux';
import UserCard from '../usercard/usercard'

@connect(
    state=>state.chatuser,
    {getUserList}
)
// 与boss组件类似
class Genius extends React.Component {
    componentDidMount() {
        // 从数据库中加载和当前cookie相关的数据到redux
        this.props.getUserList('boss')
    }
    render() {
        return <UserCard userlist={this.props.userlist}/>
    }

}

export default Genius