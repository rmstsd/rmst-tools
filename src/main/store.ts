import Store from 'electron-store'

const store = new Store()

interface SettingStore {
  vscodePath: string
  cmdPath: string
  projectPaths: string[]
  notes: string[]
}

export function getStoreSetting() {
  return store.get('setting') as SettingStore
}

export function setStoreSetting(data: SettingStore) {
  store.set('setting', data)
}

export function clearAllStore() {
  store.clear()
}
