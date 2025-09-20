<template>
  <div id="WXT-FIELD">
    <button class="id-button" @click="handleUpsertName(id)">ID
      <span class="text-black tooltip">{{ id }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  upsertId: (id: string) => void
  id: string
  onIgnoreAdd: () => void
}>()

const handleUpsertName = (id: string) => {
  props.upsertId(id)
  props.onIgnoreAdd()
}

</script>

<style lang="scss" scoped>
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