import { defineStore } from 'pinia'
export const useDemoStore = defineStore('demo', () => {
  const demoObj = reactive({
    count: 0
  })

  const mutation = {
    setCount(num: number) {
      demoObj.count = num
    },
    increment: () => demoObj.count++,
    decrement: () => demoObj.count--
  }

  const action = {}
  const getter = {}

  return { demoObj, ...mutation, ...action, ...getter }
})
