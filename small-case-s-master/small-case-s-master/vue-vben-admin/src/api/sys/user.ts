import { defHttp } from '/@/utils/http/axios'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'
import { ErrorMessageMode } from '/#/axios'

//登录
export function login(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>({ url: '/auth/login', params }, { errorMessageMode: mode })
}
// 获取验证码
export function getCodeImg() {
  return defHttp.get({ url: '/code' })
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>(
    { url: '/system/user/getInfo' },
    { errorMessageMode: 'none' },
  )
}

// export function getPermCode() {
//   return defHttp.get<string[]>({ url: '/getPermCode' })
// }

export function logout() {
  return defHttp.get({ url: '/logout' })
}

export function testRetry() {
  return defHttp.get(
    { url: '/testRetry' },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  )
}
