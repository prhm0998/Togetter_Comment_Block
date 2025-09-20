import useStoredValue from './useStoredValue'
import { useDebounceFn } from '@vueuse/core'
import filterProperties from '@/utils/filterPropertiers'
import applyDefaultProperties from '@/utils/applyDefaultProperties'

export interface UserOption {
  enabled: boolean
  useNormalize: boolean
  useCaseInsensitive: boolean
  useTemporaryWordSensitive: boolean
  useWordSensitive: boolean
  useTemporaryMentionSensitive: boolean
  useMentionSensitive: boolean
  //useTemporaryFrequencyLimit: number
  //useFrequencyLimit: number
}

export type UserOptionInputEvent =
  // | { type: 'toggle', key: keyof UserOption }
  | {
    type: 'toggle',
    key:
    'enabled'
    | 'useNormalize'
    | 'useCaseInsensitive'
    | 'useTemporaryWordSensitive'
    | 'useWordSensitive'
    | 'useTemporaryMentionSensitive'
    | 'useMentionSensitive'
  }
//| { type: 'updateNumber', key: 'useTemporaryFrequencyLimit' | 'useFrequencyLimit', value: number }

export default function () {
  const defaultUserOption = getDefaultUserOption()
  const { state: storedJson } = useStoredValue('local:Option', '{}')
  const memoryCache = ref<UserOption>(defaultUserOption)

  // json to state
  const deserialize = (jsonString: string): UserOption => {
    try {
      const parsed = JSON.parse(jsonString) as Partial<UserOption>
      // 不要なプロパティを削除
      const filterd = filterProperties(parsed, defaultUserOption)
      // jsonにないプロパティはデフォルトから持ってくる
      return applyDefaultProperties(filterd, defaultUserOption)
    }
    catch {
      return getDefaultUserOption()
    }
  }

  // state to json 後はstringifyするだけの状態に加工する
  const serialize = (): UserOption => {
    return memoryCache.value
  }

  // ストアに更新があったらキャッシュも更新する
  const initializeCache = () => memoryCache.value = deserialize(storedJson.value)
  watch(storedJson, (newVal) => memoryCache.value = deserialize(newVal))
  initializeCache()

  const saveToStorage = useDebounceFn(() => {
    storedJson.value = JSON.stringify(serialize())
  }, 100, { maxWait: 1000 })

  const updateUserOption = (event: UserOptionInputEvent) => {
    const { type, key } = event
    switch (type) {
      case 'toggle':
        // useTempraryWordSensitive, useWordSensitive の排他制御
        if (key === 'useTemporaryWordSensitive' || key === 'useWordSensitive') {
          if (memoryCache.value.useTemporaryWordSensitive && key === 'useWordSensitive') {
            memoryCache.value.useTemporaryWordSensitive = false
          }
          else if (memoryCache.value.useWordSensitive && key === 'useTemporaryWordSensitive') {
            memoryCache.value.useWordSensitive = false
          }
        }

        // useTempraryMensionSensitive, useMentionSensitive の排他制御
        if (key === 'useTemporaryMentionSensitive' || key === 'useMentionSensitive') {
          if (memoryCache.value.useTemporaryMentionSensitive && key === 'useMentionSensitive') {
            memoryCache.value.useTemporaryMentionSensitive = false
          }
          else if (memoryCache.value.useMentionSensitive && key === 'useTemporaryMentionSensitive') {
            memoryCache.value.useMentionSensitive = false
          }
        }
        memoryCache.value[event.key] = !memoryCache.value[event.key]
        break
      //case 'updateNumber':
      //  memoryCache.value[event.key] = event.value
      //  break;
      default:
        break
    }
    saveToStorage()
  }
  return {
    state: (memoryCache),
    updateUserOption,
  }
}
const getDefaultUserOption = (): UserOption => ({
  enabled: true,
  useNormalize: true,
  useCaseInsensitive: true,
  useTemporaryWordSensitive: true,
  useWordSensitive: false,
  useTemporaryMentionSensitive: true,
  useMentionSensitive: false,
  //useTemporaryFrequencyLimit: 0,
  //useFrequencyLimit: 0,
})
