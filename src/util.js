// 传入user redux中的state对象，返回路由的url
export function getRedirectPath(type, avatar){
    console.log(type)
    let url = (type.type=='boss')?'/boss': '/genius'
    if (!type.avatar){
        url+= 'info'
    }
    return url
}

export function getChatId(userId, targetId){
    return [userId,targetId].sort().join('_')
}