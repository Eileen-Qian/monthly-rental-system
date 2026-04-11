<template>
  <header class="lottery-bar">
    <button class="lottery-bar__back" @click="$router.push('/place/lottery')">
      ←
    </button>
    <span class="lottery-bar__title">{{ title }}</span>
  </header>
</template>

<script setup>
defineProps({ title: String })
</script>

<style scoped>
.lottery-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #0d5c63;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 50;
}
.lottery-bar__back {
  background: none;
  border: none;
  color: #fefff9;
  font-size: 1.4rem;
  padding: 4px 8px;
  margin-right: 8px;
  cursor: pointer;
}
.lottery-bar__title {
  color: #fefff9;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>
