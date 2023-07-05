/**
 * @description  公共API方法
 * @author       张喜津
 * @time         2021/11/24 09::40
 */

export default {
  /**
   * 获取当前用户登录信息
   * uid(用户名)、ukey(若使用腾讯SDK则返回签名，环信SDK则返回用户密码)、roomid(此处返回当前用户所拥有的聊天室id)、groupid(此处返回当前用户所拥有的群组id)
   * @returns promise    返回Promise对象 {data:{uid,ukey,roomid,groupid}}
   **/
  getUserInfo: (url) => {
    return fetch(url + '/gdim/getuserinfo').then((res) => res.json())
  },
  addUserJoinRoom: (url, params) => {
    return fetch(url + '/gdim/joinroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(params)
    }).then((res) => res.json())
  }
}
