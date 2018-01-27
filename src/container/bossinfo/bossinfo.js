import React from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import { connect } from 'react-redux';
import { update } from '../../redux/user.redux'
import { user } from './../../redux/user.redux';
import { Redirect } from 'react-router-dom'

// 导入redux中的user这个store的状态以及update方法
@connect(
    state => state.user,
    { update }
)
class BossInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            desc:'',
            company:'',
            money:''
        }
    }
    // 将state.[key]修改为val
    onChange(key, val) {
        this.setState({
            [key]: val
        })
    }
    render() {
        // 该组件当前所在path
        const path = this.props.location.pathname
        // 对应redux中的redirectTo状态
        const redirect = this.props.redirectTo
        return (
            <div>
                {/* 若redirectTo有值且不为当前页面路径，则跳转到redirectTo的路径
                    否则就啥也不干 */}
                {redirect&&redirect!==path ? <Redirect to={this.props.redirectTo}></Redirect> : null}
                <NavBar mode="dark">BOSS完善信息页</NavBar>
                {/* 这个组件从父组件传入一个函数，传出一个参数 */}
                <AvatarSelector selectAvatar={
                    // 这里接收AvatarSelector组件中的elm.text，并将其复制给父组件bossinfo
                    // 的state.avatar
                    (imgname) => {
                        this.setState({
                            avatar: imgname
                        })
                    }
                }></AvatarSelector>
                {/* 将state.title修改为v */}
                <InputItem onChange={(v) => this.onChange('title', v)}>
                    招聘职位
                </InputItem>
                {/* 将state.company修改为v */}
                <InputItem onChange={(v) => this.onChange('company', v)}>
                    公司名称
                </InputItem>
                {/* 将state.money修改为v */}
                <InputItem onChange={(v) => this.onChange('money', v)}>
                    职位薪资
                </InputItem>
                {/* 将state.desc修改为v */}
                <TextareaItem onChange={(v) => this.onChange('desc', v)} rows={3} autoHeight title='职位要求'>
                </TextareaItem>
                {/* 点击触发redux中的update方法
                     */}
                <Button
                // 点击将当前组件状态提交给redux中的update方法，更新当前组件props并触发render
                    onClick={() => this.props.update(this.state)}
                    type='primary'>保存</Button>
            </div>
        )
    }
}

export default BossInfo