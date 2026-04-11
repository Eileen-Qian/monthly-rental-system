<template>
  <teleport to="body">
    <div v-if="open" class="consent-overlay" @click.self="$emit('disagree')">
      <div class="consent-dialog">
        <div class="consent-header">同意聲明</div>
        <div class="consent-body">
          <p>
            請同意我們蒐集您的個資，使用在
            <strong>停車場月租登記</strong>及<strong>抽籤</strong>使用。
          </p>
          <p>
            僅提供停車場抽籤查核使用並於<strong>完成後30天</strong>刪除
          </p>
        </div>
        <div class="consent-actions">
          <button class="consent-btn" @click="$emit('disagree')">不同意</button>
          <button class="consent-btn consent-btn--bold" @click="$emit('agree')">
            同意
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['agree', 'disagree'])
</script>

<style scoped>
.consent-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.consent-dialog {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
.consent-header {
  background: #0d5c63;
  color: #fefff9;
  padding: 16px 24px;
  font-size: 1.25rem;
  font-weight: 700;
}
.consent-body {
  padding: 20px 24px;
  line-height: 1.8;
  color: #333;
}
.consent-body p + p {
  margin-top: 12px;
}
.consent-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
}
.consent-btn {
  background: none;
  border: none;
  color: #0d5c63;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.consent-btn:hover {
  background: rgba(13, 92, 99, 0.08);
}
.consent-btn--bold {
  font-weight: 700;
}
</style>
