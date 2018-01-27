import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button, Radio } from 'antd-mobile'
import { connect } from 'react-redux'
import { register } from '../../redux/user.redux'
import { Redirect } from 'react-router-dom'
import imoocForm from './../../component/imooc-form/imooc-form';

@connect(
    state => state.user,
    { register }
)
// 与login组件相同，用装饰器注入handleChange()方法并管理state
@imoocForm
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this)
    }
    componentDidMount(){
        // 这里就是给radio初始化一个选中效果
        this.props.handleChange('type','genius')
    }
    // 调用即将imoocForm装饰器中的状态提交给redux中的register()方法
    // 包括user,pwd,reapeatpwd,type
    handleRegister() {
        this.props.register(this.props.state)
    }
    render() {
        const RadioItem = Radio.RadioItem;
        return (
            <div>
                {/* redux中的redirectTo有值就跳到该path，否则啥也不干 */}
                {this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null}
                {/* Logo图片组件 */}
                <Logo />
                <List>
                    {/* 若有报错信息就显示报错信息，由redux中的msg决定 */}
                    {this.props.msg ? <p className='error-msg'>{this.props.msg}</p> : null}
                    {/* 调用装饰器中的handleChange方法修改其中的state */}
                    <InputItem onChange={v => { this.props.handleChange('user', v) }}>用户名</InputItem>
                    {/* 调用装饰器中的handleChange方法修改其中的state */}
                    <InputItem type='password' onChange={v => { this.props.handleChange('pwd', v) }}>密码</InputItem>
                    {/* 调用装饰器中的handleChange方法修改其中的state */}
                    <InputItem type='password' onChange={v => { this.props.handleChange('repeatpwd', v) }}>确认密码</InputItem>
                    <WhiteSpace />
                    {/* 修改装饰器imoocFrom中state的type，并通过type值决定radio是否为checked */}
                    <RadioItem
                        checked={this.props.state.type == 'genius'}
                        onChange={() => this.props.handleChange('type', 'genius')}
                    >
                        牛人
                    </RadioItem>
                    {/* 修改装饰器imoocFrom中state的type，并通过type值决定radio是否为checked */}
                    <RadioItem
                        checked={this.props.state.type == 'boss'}
                        onChange={() => this.props.handleChange('type', 'boss')}
                    >
                        BOSS
                    </RadioItem>
                    {/* 向redux提交状态 */}
                    <Button type='primary' onClick={this.handleRegister}>注册</Button>
                </List>
            </div>
        )
    }
}

export default Register