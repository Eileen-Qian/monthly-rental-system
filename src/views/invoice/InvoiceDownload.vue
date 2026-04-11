<template>
  <div v-if="data" class="invoice-page">
    <p class="invoice-status">{{ data.downloaded ? '已下載' : '未下載' }}</p>
    <h1 class="invoice-title">雲研電子發票平台中獎發票下載</h1>

    <!-- 已下載 -->
    <div v-if="data.downloaded" class="invoice-content">
      <p class="invoice-already">
        您的發票已下載，無法再提供下載，以下為您的下載資訊
      </p>
      <p class="invoice-info">下載發票時間：{{ data.downloadedAt }}</p>
      <p class="invoice-info">下載發票的中獎人：{{ data.downloadedBy }}</p>
    </div>

    <!-- 未下載 -->
    <div v-else class="invoice-content">
      <p>中獎人：{{ data.winnerName }}</p>
      <p>繳費車牌：{{ data.plate }}</p>
      <p>繳費手機：{{ data.phone }}</p>
      <p class="invoice-warn">
        提醒您發票僅能下載一次，下載後請妥善保存並儘速領獎，以免發票遺失，喪失兌獎權益。
      </p>
      <button class="invoice-download-btn" @click="handleDownload">
        發票下載
      </button>
    </div>

    <RedeemGuide />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchInvoiceData, downloadInvoice } from './config'
import RedeemGuide from './components/RedeemGuide.vue'

const data = ref(null)

onMounted(async () => {
  data.value = await fetchInvoiceData()
})

async function handleDownload() {
  await downloadInvoice()
  data.value = {
    ...data.value,
    downloaded: true,
    downloadedAt: new Date().toLocaleString('zh-TW'),
    downloadedBy: data.value.winnerName,
  }
}
</script>

<style scoped>
.invoice-page { max-width: 720px; margin: 0 auto; padding: 16px 20px 48px; border: 1px solid #ccc; min-height: 100vh; background: #fff; }
.invoice-status { font-size: 0.85rem; color: #666; margin-bottom: 8px; }
.invoice-title { font-size: 1.75rem; font-weight: 700; color: #333; margin-bottom: 24px; }
.invoice-content { margin-bottom: 32px; line-height: 2; }
.invoice-warn { color: #c62828; margin-top: 16px; line-height: 1.7; }
.invoice-download-btn { margin-top: 16px; padding: 8px 24px; font-size: 1rem; background: #fff; border: 1px solid #ccc; border-radius: 2px; cursor: pointer; }
.invoice-download-btn:hover { background: #f0f0f0; }
.invoice-already { font-style: italic; color: #666; margin-bottom: 8px; }
.invoice-info { padding-left: 12px; }
</style>
