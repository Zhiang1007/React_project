/*
包含n个根据老的state和action返回新的state的函数的模块
 */
import {combineReducers} from 'redux'

import {
    AUTH_SUCCESS,
    ERROR_MSG
} from './action-types'

const initUser = {
    username: '', // 用户名
    type: '', // 类型
    msg: '', // 错误提示信息
    redirectTo: '' // 需要自动跳转的路由path
}
function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS: // 认证成功
            return {...action.data, redirectTo: '/'}
        case ERROR_MSG: // 错误信息提示
            return {...state, msg: action.data}
        default:
            return state
    }
}

// 返回合并的reducer
export default combineReducers({
    user
})
