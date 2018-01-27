import React from 'react'
import axios from 'axios'
import { Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { connect } from 'react-redux';
import { getUserList } from './../../redux/chatuser.redux';
import UserCard from './../usercard/usercard';

@connect(
    // 只有一个userlist数组
    state => state.chatuser,
    { getUserList }
)
class Boss extends React.Component {
    componentDidMount() {
        // 获取type为genius的所有user相关数据到redux，更新redux的state触发render
        this.props.getUserList('genius')
    }
    render() {
        const Body = Card.Body
        const Header = Card.Header
        // 把userlist信息放到名片内
        return <UserCard userlist={this.props.userlist} />
    }

}

export default Boss