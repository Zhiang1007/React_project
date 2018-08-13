/*
包含所有action creator函数的模块
 */

import {
    AUTH_SUCCESS,
    ERROR_MSG
} from './action-types'
import {
    reqRegister,
    reqLogin
} from '../api'


// 同步错误消息
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
// 同步成功响应
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

/*
异步注册
 */
export function register({username, password, password2, type}) {
    // 进行前台表单验证, 如果不合法返回一个同步action对象, 显示提示信息
    if (!username || !password || !type) {
        return errorMsg('用户名密码必须输入')
    }
    if (password !== password2) {
        return errorMsg('密码和确认密码不同')
    }
    return async dispatch => {
        // 异步ajax请求, 得到响应
        const response = await reqRegister({username, password, type})
        // 得到响应体数据
        const result = response.data
        // 如果是正确的
        if (result.code === 0) {
            // 分发成功的action
            dispatch(authSuccess(result.data))
        } else {
            // 分发提示错误的action
            dispatch(errorMsg(result.msg))
        }
    }
}

/*
异步登陆
 */
export const login = ({username, password}) => {
    if (!username || !password) {
        return errorMsg('用户密码必须输入')
    }
    return async dispatch => {
        const response = await reqLogin({username, password})
        const result = response.data
        if (result.code === 0) {
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}




// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data:user})
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data:{users, chatMsgs, userid}})
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
// 读取了某个聊天消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

// 注册异步action
export const reqRegister = (user) => {
  const {username, password, password2, type} = user
  // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
  if(!username) {
    return errorMsg('用户名必须指定!')
  } else if(password!==password2) {
    return errorMsg('2次密码要一致!')
  }
  // 表单数据合法, 返回一个发ajax请求的异步action函数
  return async dispatch => {


    // 发送注册的异步ajax请求
    /*const promise = reqRegister(user)
    promise.then(response => {
      const result = response.data  // {code: 0/1, data: user, msg: ''}
    })*/
    const response = await reqRegister({username, password, type})
    const result = response.data //  {code: 0/1, data: user, msg: ''}
    if(result.code===0) {// 成功
      getMsgList(dispatch, result.data._id)
      // 分发授权成功的同步action
      dispatch(authSuccess(result.data))
    } else { // 失败
      // 分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

// 登陆异步action
export const login = (user) => {

  const {username, password} = user
  // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
  if(!username) {
    return errorMsg('用户名必须指定!')
  } else if(!password) {
    return errorMsg('密码必须指定!')
  }

  return async dispatch => {
    // 发送注册的异步ajax请求
    /*const promise = reqLogin(user)
    promise.then(response => {
      const result = response.data  // {code: 0/1, data: user, msg: ''}
    })*/
    const response = await reqLogin(user)
    const result = response.data
    if(result.code===0) {// 成功
      getMsgList(dispatch, result.data._id)
      // 分发授权成功的同步action
      dispatch(authSuccess(result.data))
    } else { // 失败
      // 分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

// 更新用户异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code===0) { // 更新成功: data
      dispatch(receiveUser(result.data))
    } else { // 更新失败: msg
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户异步action
export const getUser = () => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUser()
    const result = response.data
    if(result.code===0) { // 成功
      getMsgList(dispatch, result.data._id)
      dispatch(receiveUser(result.data))
    } else { // 失败
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUserList(type)
    const result = response.data
    // 得到结果后, 分发一个同步action
    if(result.code===0) {
      dispatch(receiveUserList(result.data))
    }
  }
}

