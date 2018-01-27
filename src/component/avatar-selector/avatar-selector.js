import React from 'react'
import { Grid,List } from 'antd-mobile'
import PropTypes from 'prop-types'

class AvatarSelector extends React.Component {
    // 规定调用该组件时selectAvatar这个prop必须指定，且必须为函数类型
    static propTypes = {
        selectAvatar:PropTypes.func.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        // 返回对象数组，每个对象有icon和text两属性
        // 这是所有可选头像的信息集合
        const avatarList = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17'.split(',')
            .map(v => ({
                icon: require(`../img/${v}.jpg`),
                text: v
            }))
        // 如果state里的text属性有值则返回已经选择的头像，
        // 否则则返回“选择头像”
        const gridHeader = this.state.text ? (<div><span>已选择头像</span><img style={{ width: "20px" }} src={this.state.icon} alt="" /></div>)
            : (<div>请选择头像</div>)
        return (
            <div>
                <List renderHeader={() => gridHeader}>
                    <Grid data={avatarList} columnNum={5} onClick={elm => {
                        // 点击哪个头像就把该头像的信息传入组件state并重新触发render
                        this.setState(elm)
                        // 随后将elm.text（所选图片名称）通过下面的函数传出该组件
                        this.props.selectAvatar(elm.text)
                    }} />
                </List>
            </div>
        )
    }
}

export default AvatarSelector