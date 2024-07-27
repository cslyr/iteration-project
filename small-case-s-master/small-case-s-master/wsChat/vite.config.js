import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'fs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   host: '',
  //   https: {
  //     key: fs.readFileSync('./src/asset/localhost+3-key.pem'),
  //     cert: fs.readFileSync('./src/asset/localhost+3.pem'),
  //   },
  // },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
})
