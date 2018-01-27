import React from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

@withRouter
@connect(
    state=>state.chat
)
class NavLinkBar extends React.Component {
    // 调用的时候必须指定props中的data，类型为数组
    // 这里接收的是父组件dashboard中的navList
    static propTypes = {
        data: PropTypes.array.isRequired
    }
    render() {
        // 筛选需要显示的navList条目
        const navList = this.props.data.filter(v => !v.hide)
        // 当前路径
        const {pathname} =this.props.location
        return (
            <TabBar>
                {navList.map(v=>(
                    // 通过路由修饰后可以跳转
                    <TabBar.Item
                        badge={v.path=='/msg'?this.props.unread:null}
                        key={v.path}
                        title={v.text}
                        icon={{uri:require(`./img/${v.icon}.jpg`)}}
                        selectedIcon={{uri:require(`./img/${v.icon}-select.jpg`)}}
                        selected={pathname==v.path}
                        onPress={()=>{
                            this.props.history.push(v.path)
                        }}
                    >
                    </TabBar.Item>
                ))}
            </TabBar>
        )
    }
}

export default NavLinkBar