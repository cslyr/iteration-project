// 登录参数类型
export interface LoginParams {
  username: string
  password: string
  code: number
  uuid: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

// 登录返回参数类型
export interface LoginResultModel {
  code: number
  msg: string
  data: {
    access_token: string
    expires_in: number
    msg: null | string
  }
}

// 返回用户信息的类型
export interface GetUserInfoModel {
  code?: number
  msg?: string
  roles: RoleInfo[]
  user: any
}
