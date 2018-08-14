/*
包含n个根据老的state和action返回新的state的函数的模块
 */
import {combineReducers} from 'redux'

import {getRedirectPath} from '../utils'

const initUser= {
    usrename: "",
    type: "",
}
function user (state=initUser,action){
   switch (action.type){
       case AUTH_SUCCESS: // 认证成功
           const redirectTo = getRedirectPath(action.data.type, action.data.header)
           return {...action.data, redirectTo}
       case ERROR_MSG: // data是msg
           return {...state, msg: action.data}
       case RECEIVE_USER: // data是user
           return action.data
       case RESET_USER: // data是msg
           return {...initUser, msg: action.data}
       default:
           return state
    }
}


// 返回合并的reducer
export default combineReducers({
    user
})
