import request from "../utils/request";
import qs from 'qs'

export const audioToText = (data) => {
  return request({
    url: '/audioToText',
    method: 'post',
    data
  })
}