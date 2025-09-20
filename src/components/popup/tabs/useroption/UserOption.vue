<script setup lang="ts">
import useUserOption, { type UserOption } from '@/composables/useUserOption'
import Checkbox from './CheckBox.vue'
import Header from './Header.vue'
const { state, updateUserOption } = useUserOption()

export interface UserOptionEntry {
  key: keyof UserOption,
  label: string
}
const options: UserOptionEntry[] = [
  { key: 'enabled', label: 'NG設定を有効化する' },
  { key: 'useNormalize', label: 'ひらがな・カタカナを区別しない' },
  { key: 'useCaseInsensitive', label: '大文字・小文字を区別しない' },
  { key: 'useTemporaryWordSensitive', label: '禁止語句を使用したユーザーを一時的に非表示にします' },
  { key: 'useWordSensitive', label: '禁止語句を使用したユーザーを非表示ユーザーに登録します' },
  { key: 'useTemporaryMentionSensitive', label: '非表示ユーザーへメンションしたユーザーを一時的に非表示にします' },
  { key: 'useMentionSensitive', label: '非表示ユーザーへメンションしたユーザーを非表示ユーザーに登録します' },
]

</script>

<template>
  <div class="box-border flex flex-col h-[420px] w-[520px]">
    <Header />
    <div v-if="state" class="flex flex-col flex-grow gap-2">
      <Checkbox v-for="option in options" :id="option.key" :key="option.key" :label="option.label"
        :model-value="state[option.key]" @update:model-value="updateUserOption({ type: 'toggle', key: option.key })" />
    </div>
  </div>
</template>