import Store from 'electron-store'
import { SettingData } from '@common/type'
const store = new Store()


export function getStoreSetting() {
  return store.get('setting') as SettingData
}

export function setStoreSetting(data: SettingData) {
  store.set('setting', data)
}

export function clearAllStore() {
  store.clear()
}
