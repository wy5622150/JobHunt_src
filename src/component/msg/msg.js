import React from 'react'
import { connect } from 'react-redux';
import { List,Badge } from 'antd-mobile';

@connect(
    state => state
)
class Msg extends React.Component {
    // 返回数组最后一个元素
    getLast(arr) {
        return arr[arr.length - 1]
    }
    render() {
        // 这俩是antd的组件
        const Item = List.Item
        const Brief = Item.Brief
        // 分别要获取redux中user和chat的内容
        // 当前用户id
        const userid = this.props.user._id
        // 这是所有用户的id,name和avatar
        const userinfo = this.props.chat.users
        const msgGroup = {}
        // chatmsg是个{from:'',to:'',msg:''}元素的集合
        this.props.chat.chatmsg.forEach(v => {
            // chatid是由from和to拼接的，
            // 如果这个chatid已经存在，就把相关的chatmsg信息push到这个id下
            // 如果不存在就创建这个chatid属性，并赋值为空
            // 然后再push v的信息
            msgGroup[v.chatid] = msgGroup[v.chatid] || []
            msgGroup[v.chatid].push(v)
        });
        // 对msgGroup的降序排列根据其中的chatid，变成chatList
        const chatList = Object.values(msgGroup).sort((a,b)=>{
            // 取到msgGroup中每个chatid的最后一个item来比较
            const a_last =this.getLast(a)
            const b_last =this.getLast(b)
            return b_last-a_last 
        })

        return (
            <div>
                {/* chatList是根据id拍好的全部聊天内容 */}
                {chatList.map(v => {
                    // 选到每个id下最后的一个信息
                    const lastItem = this.getLast(v)
                    // 指向与当前用户对话的那个用户
                    const targetId = v[0].from == userid ? v[0].to : v[0].from
                    // 每个id对应的未读条目数量
                    const unreadNum = v.filter(v=>!v.read&&v.to==userid).length
                    if (!userinfo[targetId]) {
                        return null
                    }
                    return (
                        <List key={lastItem._id}>
                            <Item
                                // 最右侧红圈里的数字，为读书梁
                                extra={<Badge text={unreadNum}></Badge>}
                                // 对方头像
                                thumb={require(`../img/${userinfo[targetId].avatar}.jpg`)}
                                arrow="horizontal"
                                onClick={()=>{
                                    // 点击则跳转到对方的聊天页
                                    this.props.history.push(`/chat/${targetId}`)
                                }}
                                style={{zIndex:1}}
                            >
                            {/* 显示每个组最后一条信息内容 */}
                                {lastItem.content}
                                {/* 显示对方名字 */}
                                <Brief>{userinfo[targetId].name}</Brief>
                            </Item>
                        </List>
                    )
                })}

            </div>
        )
    }
}

export default Msg