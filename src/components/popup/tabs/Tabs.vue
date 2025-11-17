<script setup lang="ts">
import { IconRaiseHandOff, IconPenOff, IconGear } from '@iconify-prerendered/vue-pepicons-pop'

import IgnoreList from './ignorelist/IgnoreList.vue'
import UserOption from './useroption/UserOption.vue'

export interface TabType {
  key: StorageItemKey
  name: 'Id' | 'Word' | 'Option'
}

const tabs: TabType[] = [
  { key: 'local:Id', name: 'Id' },
  { key: 'local:Word', name: 'Word' },
  { key: 'local:Option', name: 'Option' },
]

const activeTab = ref<TabType>(tabs[0])
</script>

<template>
  <div class="tab-container">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <ul class="dark:text-gray-400 flex flex-wrap font-medium gap-3 text-gray-500 text-lg">
        <li v-for="tab in tabs" :key="tab.key" class="me-2" @click="activeTab = tab">
          <a href="#"
            class="border-b-2 border-transparent dark:hover:text-gray-300 hover:border-gray-300 hover:text-gray-600 inline-flex items-center justify-center p-4 rounded-t-lg select-none">
            <IconPenOff v-if="tab.name === `Word`" class="mr-2" color="#393f4c" />
            <IconGear v-if="tab.name === `Option`" class="mr-2" color="#393f4c" />
            <IconRaiseHandOff v-if="tab.name === `Id`" class="mr-2" color="#393f4c" />
            {{ tab.name }}
          </a>
        </li>
      </ul>
      <div class="px-2 tab-contentx">
        <IgnoreList v-if="activeTab.key === 'local:Id'" ref="ignoreListRef" :model-value="activeTab" />
        <IgnoreList v-else-if="activeTab.key === 'local:Word'" ref="ignoreListRef" :model-value="activeTab"
          :regexp="true" :edit="true" />
        <UserOption v-else :model-value="activeTab" />
      </div>
    </div>
  </div>
</template>