import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', {
  state: () => ({
    count: 1
  }),
  actions: {
    add () {
      this.count++
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})