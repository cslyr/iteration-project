import axios from "axios";

const request = axios.create({
  baseURL: 'https://192.168.0.108:8888',
  timeout: 50000
})

// request.interceptors.request((config) => {
//   // todoSomething...
// }, (err) => {
//   console.log('requestErr');
// })

// request.interceptors.response((data) => {
//   // todoSomething
//   return data
// }, (err) => { console.log(err); })

export default request