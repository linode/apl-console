/* eslint-disable no-console */
import { Dispatch, useState } from 'react'

export const useLocalStorage = (key: string, initialValue: any): [any, Dispatch<any>] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)

      return item && item !== '' ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)

      return initialValue
    }
  })
  const setValue = (value: any): void => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, valueToStore === undefined ? '' : JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export const clearLocalStorage = (key: string): void => {
  window.localStorage.removeItem(key)
}
