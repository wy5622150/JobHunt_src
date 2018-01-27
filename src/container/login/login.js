import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { login } from '../../redux/user.redux'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import imoocForm from '../../component/imooc-form/imooc-form'

// 从redux的user中传入props，接收redux中的login方法
@connect(
    state => state.user,
    { login }
)
// 利用装饰器的写法为组件提供了一个handleChange()方法
@imoocForm
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.register = this.register.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    // 跳转到register路径
    register() {
        this.props.history.push('/register');
    }
    // 
    handleLogin() {
        // login方法来源于redux中的user
        // this.props.state来源于imoocForm装饰器，利用handleChange()方法修改的state内容会累积在imoocForm中并一次性传入这里
        // 事实上这里只有user和pwd
        // login()返回user与pwd相匹配的数据库中条目（第一条）和code给redux
        this.props.login(this.props.state)
    }
    render() {
        return (
            <div>
                {/* 若redirectTo有值且非login，则跳转到redirectTo的路径
                    否则就啥也不干 */}
                {this.props.redirectTo && this.props.redirectTo != '/login' ? <Redirect to={this.props.redirectTo} /> : null}
                {/* 这个组件就是给页面添加一个logo图片 */}
                <Logo />
                <WingBlank>
                    <List>
                        {/* 若redux中的msg有值则将其渲染，用于检测用户名与密码规则教验 */}
                        {this.props.msg ? <p className='error-msg'>{this.props.msg}</p> : null}
                        {/* 这里的handleChange()来源于imoocForm装饰器 */}
                        <InputItem onChange={v => { this.props.handleChange('user', v) }}>用户名</InputItem>
                        <WhiteSpace />
                        {/* 将state.company修改为v */}
                        <InputItem type='password' onChange={v => { this.props.handleChange('pwd', v) }}>密码</InputItem>
                    </List>
                    <WhiteSpace />
                    {/* 点击执行handleLogin提交积累在imoocForm装饰器中的组件状态给redux */}
                    <Button onClick={this.handleLogin} type='primary'>登陆</Button>
                    <WhiteSpace />
                    {/* 点击则路由到register路径 */}
                    <Button type='primary' onClick={this.register}>注册</Button>
                </WingBlank>
            </div>
        )
    }
}

export default Login