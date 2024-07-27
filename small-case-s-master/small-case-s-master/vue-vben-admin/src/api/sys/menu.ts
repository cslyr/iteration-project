import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetMenuList = '/system/menu/getRoutersForOS',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get({
    url: Api.GetMenuList,
    params: { menuName: '教学管理平台' },
  })
}
