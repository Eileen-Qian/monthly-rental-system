<template>
  <div class="invoice-page">
    <h1 class="invoice-title">雲研電子發票平台中獎發票下載</h1>

    <!-- 載入中 -->
    <div v-if="loading" class="invoice-loading">載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="invoice-content">
      <p class="invoice-error">{{ error }}</p>
    </div>

    <!-- 已下載 -->
    <div v-else-if="downloaded" class="invoice-content">
      <p class="invoice-status-tag">已下載</p>
      <p class="invoice-already">
        您的發票已下載，無法再提供下載，以下為您的下載資訊
      </p>
      <p class="invoice-info">下載發票時間：{{ downloadedAt }}</p>
      <p class="invoice-info">下載發票的中獎人：{{ downloadedBy }}</p>
    </div>

    <!-- 未下載 -->
    <div v-else-if="invoiceInfo" class="invoice-content">
      <p class="invoice-status-tag">未下載</p>

      <div class="invoice-field">
        <label class="invoice-label">中獎人：</label>
        <input
          v-model="form.userName"
          class="invoice-input"
          type="text"
          placeholder="請輸入中獎人姓名"
        />
      </div>
      <div class="invoice-field">
        <label class="invoice-label">繳費車牌：</label>
        <div class="invoice-plate-wrap">
          <input
            v-model="form.platePrefix"
            class="invoice-input invoice-plate-input"
            type="text"
            placeholder=""
          />
          <span class="invoice-plate-dash">-</span>
          <input
            v-model="form.plateSuffix"
            class="invoice-input invoice-plate-input"
            type="text"
            placeholder=""
          />
        </div>
      </div>
      <div class="invoice-field">
        <label class="invoice-label">繳費手機：</label>
        <input
          v-model="form.phone"
          class="invoice-input"
          type="tel"
          placeholder="請輸入手機號碼"
        />
      </div>

      <p class="invoice-warn">
        提醒您發票僅能下載一次，下載後請妥善保存並儘速領獎，以免發票遺失，喪失兌獎權益。
      </p>
      <p v-if="downloadError" class="invoice-download-error">{{ downloadError }}</p>
      <button
        class="invoice-download-btn"
        :disabled="downloading || !canDownload"
        @click="handleDownload"
      >
        {{ downloading ? '下載中...' : '發票下載' }}
      </button>
    </div>

    <RedeemGuide />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { decryptInvoiceData, getInvoiceInfo, downloadInvoice } from './api'
import RedeemGuide from './components/RedeemGuide.vue'

const route = useRoute()

const loading = ref(true)
const error = ref('')
const downloaded = ref(false)
const downloadedBy = ref('')
const downloadedAt = ref('')
const invoiceNumber = ref('')
const invoiceInfo = ref(null)
const downloading = ref(false)
const downloadError = ref('')

const form = reactive({
  userName: '',
  platePrefix: '',
  plateSuffix: '',
  phone: '',
})

const plateFull = computed(
  () => form.platePrefix.trim() && form.plateSuffix.trim()
    ? `${form.platePrefix.trim()}-${form.plateSuffix.trim()}`
    : '',
)

const canDownload = computed(
  () => form.userName.trim() && plateFull.value && form.phone.trim(),
)

onMounted(async () => {
  const encryptedData = route.query.data
  if (!encryptedData) {
    error.value = '缺少必要參數'
    loading.value = false
    return
  }

  try {
    // 步驟一：解密取得發票號碼
    const decrypted = await decryptInvoiceData(encryptedData)
    invoiceNumber.value = decrypted.invoiceNumber

    // 步驟二：取得發票資訊
    const info = await getInvoiceInfo(decrypted.invoiceNumber)
    invoiceInfo.value = info
  } catch (err) {
    if (err.code === -2) {
      downloaded.value = true
      downloadedBy.value = err.userName
      downloadedAt.value = err.downloadTime
    } else {
      error.value = err.message || '發生錯誤'
    }
  } finally {
    loading.value = false
  }
})

async function handleDownload() {
  downloading.value = true
  downloadError.value = ''
  try {
    const downloadUrl = await downloadInvoice({
      invoiceNumber: invoiceNumber.value,
      userName: form.userName.trim(),
      phone: form.phone.trim(),
      plate: plateFull.value,
    })

    // 開新分頁下載，不離開當前頁面
    window.open(downloadUrl, '_blank')

    // 重新取得發票資訊，讓畫面顯示已下載
    try {
      await getInvoiceInfo(invoiceNumber.value)
    } catch (refreshErr) {
      if (refreshErr.code === -2) {
        invoiceInfo.value = null
        downloaded.value = true
        downloadedBy.value = refreshErr.userName
        downloadedAt.value = refreshErr.downloadTime
      }
    }
  } catch (err) {
    downloadError.value = err.message || '下載失敗'
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.invoice-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px 20px 48px;
  border: 1px solid #ccc;
  min-height: 100vh;
  background: #fff;
}
.invoice-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}
.invoice-loading {
  text-align: center;
  padding: 60px 0;
  color: #666;
}
.invoice-content {
  margin-bottom: 32px;
  line-height: 2;
}
.invoice-status-tag {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
}
.invoice-field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.invoice-label {
  flex-shrink: 0;
  font-weight: 500;
  min-width: 5em;
}
.invoice-input {
  flex: 1;
  padding: 6px 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  outline: none;
}
.invoice-input:focus {
  border-color: #666;
}
.invoice-plate-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.invoice-plate-input {
  flex: 1;
  min-width: 0;
  text-align: center;
  border-radius: 8px;
}
.invoice-plate-dash {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  flex-shrink: 0;
}
.invoice-warn {
  color: #c62828;
  margin-top: 16px;
  line-height: 1.7;
}
.invoice-download-btn {
  margin-top: 16px;
  padding: 8px 24px;
  font-size: 1rem;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 2px;
  cursor: pointer;
}
.invoice-download-btn:hover:not(:disabled) {
  background: #f0f0f0;
}
.invoice-download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.invoice-already {
  font-style: italic;
  color: #666;
  margin-bottom: 8px;
}
.invoice-info {
  padding-left: 12px;
}
.invoice-download-error {
  color: #c62828;
  margin-top: 12px;
  font-size: 0.95rem;
}
.invoice-error {
  color: #c62828;
  font-size: 1.1rem;
  text-align: center;
  padding: 40px 0;
}
</style>
