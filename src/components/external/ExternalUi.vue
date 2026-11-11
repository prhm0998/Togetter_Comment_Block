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

const isIgnored = computed(() => props.state.prevJudge?.byId)

const buttonLabel = computed(() =>
  isIgnored.value ? 'NG解除' : 'NG追加')

const buttonClass = computed(() =>
  isIgnored.value ? 'is-ignored' : 'is-not-ignored')

const violationRules = computed(() => {
  const judge = props.state.prevJudge

  const rules = [
    { key: 'byId', label: 'ID一致' },
    { key: 'byMention', label: 'メンション' },
    { key: 'bySessionId', label: 'セッションID一致' },
    { key: 'byWord', label: 'NGワード一致' },
  ] as const

  return rules.filter(rule => judge?.[rule.key])
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
      <div class="comment-action">
        <div v-if="violationRules.length" class="violation-rules">
          <span v-for="rule in violationRules" :key="rule.key" class="violation-tag">
            {{ rule.label }}
          </span>
        </div>
        <button class="id-button" :class="buttonClass" @click="onClick">
          {{ buttonLabel }}
          <span class="text-black tooltip">{{ state.id }}</span>
        </button>
      </div>
    </Teleport>

  </div>
</template>

<style lang="scss">
.wxt-counter-wrapper {
  margin-right: auto;

  .counter-green {
    color: #568F78 !important;
  }

  .counter-yellow {
    color: #B18B43 !important;
  }

  .counter-red {
    color: #B56870 !important;
  }
}
</style>

<style lang="scss" scoped>
.counter-state {

  display: inline-block;
  padding: 2px 0;
  margin-top: 8px;

  font-size: 10px;
  font-weight: bold;
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
  cursor: pointer;
  color: #fff;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;

  &:not(:hover) {
    opacity: 0.65;
  }

  &:hover {
    opacity: 1;
  }

  &.is-not-ignored {
    background-color: #C66B72;

    &:hover {
      background-color: #A94F58;
    }
  }

  &.is-ignored {
    background-color: #A94F58;

    &:hover {
      background-color: #39766E;
    }
  }

  .tooltip {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 30px;
    display: inline-block;
    padding: 5px;
    white-space: nowrap;
    font-size: 0.8rem;
    line-height: 1.3;
    background: #333;
    color: #fff;
    border-radius: 3px;
    transition: 0.3s ease-in;
  }
}

/* ホバー時にツールチップの非表示を解除 */
.id-button:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.comment-action {
  display: flex;
  align-items: center;
  margin-left: 6px;
  gap: 3px;
}

.violation-rules {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.violation-tag {
  padding: 3px 5px;
  border-radius: 4px;
  background: #e8e8e8;
  color: #555;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
}
</style>