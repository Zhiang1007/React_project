/*
包含n个根据老的state和action返回新的state的函数的模块
 */
import {combineReducers} from 'redux'

const initUser= {
    usrename: "",
    type: "",
}
function user (state=initUser,action){
   switch (action.type){
       default:
           return state
    }
}


// 返回合并的reducer
export default combineReducers({
    user
})
