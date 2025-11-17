<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { CommentState } from '@/composables/useCommentManagerBase'

interface Props {
  state: CommentState
  onClick: () => void
}

const props = defineProps<Props>()

// Teleport 用 wrapper を保持
const counterWrapper = ref<HTMLElement | null>(null)
const buttonWrapper = ref<HTMLElement | null>(null)

const counterColor = computed(() => {
  const total = props.state.idCountTotal
  if (total <= 3) return 'counter-green'
  if (total <= 10) return 'counter-yellow'
  return 'counter-red'
})

onMounted(() => {
  const footer = props.state.el.querySelector('footer')
  if (!footer) return

  const first = footer.firstElementChild
  const last = footer.lastElementChild

  // ---------- counter: 手前に挿入 ----------
  const c = document.createElement('div')
  c.classList.add('wxt-counter-wrapper')

  if (first) {
    footer.insertBefore(c, first)  // first-child の前
  }
  else {
    footer.appendChild(c) // fallback
  }
  counterWrapper.value = c

  // ---------- button: 後に挿入 ----------
  const b = document.createElement('div')
  b.classList.add('wxt-button-wrapper')

  if (last) {
    footer.insertBefore(b, last.nextSibling) // last-child の後
  }
  else {
    footer.appendChild(b) // fallback
  }
  buttonWrapper.value = b
})
</script>

<template>
  <div id="WXT-FIELD">

    <!-- 手前に挿入される counter -->
    <Teleport v-if="counterWrapper && state.idCountCurrent && state.idCountTotal" :to="counterWrapper">
      <div class="counter-state" :class="counterColor">
        {{ `${state.idCountCurrent} / ${state.idCountTotal}` }}
      </div>
    </Teleport>

    <!-- 後に挿入される button -->
    <Teleport v-if="buttonWrapper" :to="buttonWrapper">
      <button class="id-button" @click="onClick">
        ID
        <span class="text-black tooltip">{{ state.id }}</span>
      </button>
    </Teleport>

  </div>
</template>

<style lang="scss">
.wxt-counter-wrapper {
  margin-right: auto;

  .counter-green {
    color: #0a0 !important;
  }

  .counter-yellow {
    color: #d4a700 !important;
  }

  .counter-red {
    color: #d40000 !important;
  }
}
</style>

<style lang="scss" scoped>
.counter-state {

  display: inline-block;
  padding: 2px 0;
  margin-top: 8px;

  font-size: 12px;
  color: #333;

  background: #f2f2f2;
  border-radius: 4px;
  line-height: 1;
}

.id-button {
  position: relative;
  display: inline-block;
  margin: 4px;
  padding: 5px 10px;
  font-size: 10px;
  border: none;
  border-radius: 5px;
  background-color: #e2041b;
  cursor: pointer;
  color: white;

  &.id-button {
    margin: 4px;
  }

  .tooltip {
    visibility: hidden;
    width: 120px;
    background-color: #000;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    /* Position above the button */
    left: 50%;
    margin-left: -60px;
    /* Center the tooltip */
    opacity: 0;
    transition: opacity 0.5s;

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #000 transparent transparent transparent;
    }
  }

  &:not(:hover) {
    opacity: 0.2;
  }

  &:hover {
    opacity: 1;
    background-color: #6adf6a;
    color: rgb(0, 0, 0);
  }

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
}

.id-button {
  margin-left: 36px;
}
</style>