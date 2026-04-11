<template>
  <div>
    <LotteryTopBar title="查詢登記" />
    <div v-if="!siteData" class="query-page" style="text-align:center;padding-top:120px">載入中...</div>
    <div v-else class="query-page">
      <div class="query-page__card-wrap">
        <InfoCard :site-data="siteData" />
      </div>

      <form @submit.prevent="handleSearch">
        <p class="query-section-title">查詢條件</p>

        <div class="query-fields">
          <div class="query-field">
            <label class="query-label">車牌號碼</label>
            <input
              v-model="plate"
              class="query-input"
              type="text"
              placeholder="e.g. 1234-TT"
            />
          </div>
          <div class="query-field">
            <label class="query-label">手機號碼</label>
            <input
              v-model="phone"
              class="query-input"
              type="tel"
              placeholder="手機號碼"
            />
          </div>
        </div>

        <div class="query-submit-wrap">
          <button
            type="submit"
            class="query-submit-btn"
            :disabled="!plate || !phone"
          >
            查詢
          </button>
        </div>
      </form>

      <div v-if="searched" class="query-result">
        <div v-if="result" class="query-found">
          <p>車牌：<strong>{{ result.plate }}</strong></p>
          <p>姓名：<strong>{{ result.name }}</strong></p>
          <p>狀態：<strong>{{ result.status }}</strong></p>
        </div>
        <p v-else class="query-not-found">查無登記資料</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchSiteData } from './config'
import LotteryTopBar from './components/LotteryTopBar.vue'
import InfoCard from './components/InfoCard.vue'

const siteData = ref(null)
const plate = ref('')
const phone = ref('')
const result = ref(null)
const searched = ref(false)

onMounted(async () => {
  siteData.value = await fetchSiteData()
})

function handleSearch() {
  if (!plate.value || !phone.value) return
  // TODO: 接 API
  result.value = null
  searched.value = true
}
</script>

<style scoped>
.query-page { padding: 72px 16px 40px; max-width: 600px; margin: 0 auto; }
.query-page__card-wrap { text-align: center; margin-bottom: 24px; }
.query-section-title { font-size: 1rem; font-weight: 700; color: #0d5c63; margin-bottom: 16px; text-align: left; }
.query-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 480px) { .query-fields { grid-template-columns: 1fr; } }
.query-field { display: flex; flex-direction: column; }
.query-label { font-size: 0.8rem; color: #666; margin-bottom: 4px; }
.query-input { padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; outline: none; }
.query-input:focus { border-color: #0d5c63; }
.query-submit-wrap { margin-top: 24px; text-align: center; }
.query-submit-btn { background: #0d5c63; color: #fefff9; border: none; padding: 12px 64px; font-size: 1rem; font-weight: 700; border-radius: 4px; cursor: pointer; }
.query-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.query-result { margin-top: 32px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
.query-found { text-align: left; line-height: 2; }
.query-not-found { color: #666; }
</style>
