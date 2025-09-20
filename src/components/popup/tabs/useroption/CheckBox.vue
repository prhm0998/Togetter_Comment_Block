<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: boolean
}
defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="cursor-pointer flex items-center">
    <input :id="id" type="checkbox" :checked="modelValue"
      class="bg-gray-100 border-gray-300 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 focus:ring-blue-500 h-4 rounded-sm select-none text-blue-600 w-4"
      @change="emit('update:modelValue', !modelValue)" />
    <label :for="id" class="cursor-pointer dark:text-gray-300 font-medium ms-2 select-none text-gray-900 text-sm">
      {{ label }}
    </label>
  </div>
</template>
