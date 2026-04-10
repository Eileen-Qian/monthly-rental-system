<template>
  <div class="bg-light h-100">
    <div class="container">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<style scoped>
.h-100 {
  min-height: 100vh;
}
</style>