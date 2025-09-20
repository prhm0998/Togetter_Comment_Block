<script lang="ts" setup>
import Popup from '@/components/popup/tabs/Tabs.vue'
// import Test from '@/components/pages/test.vue'

</script>

<template>
  <Popup></Popup>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #54bc4ae0);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
