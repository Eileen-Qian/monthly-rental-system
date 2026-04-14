<template>
  <div class="success-page">
    <header class="success-bar">
      <h1 class="success-bar__title">{{ siteName }}</h1>
    </header>

    <main class="success-page__body">
      <div class="success-page__icon">✅</div>
      <h2 class="success-page__heading">登記完成</h2>
      <p class="success-page__sub">您的月租登記已完成，後續將由管理員與您聯繫。</p>

      <div v-if="formData" class="success-page__summary">
        <dl>
          <dt>車主姓名</dt><dd>{{ formData.name }}</dd>
          <dt>手機號碼</dt><dd>{{ formData.phone }}</dd>
          <dt>車牌號碼</dt><dd>{{ formData.carNumber }}</dd>
          <dt>起租日</dt><dd>{{ formData.beginDate }}</dd>
          <template v-if="rateData">
            <dt>身分費率</dt><dd>{{ rateData.rateName }}</dd>
          </template>
          <template v-if="periodData">
            <dt>繳費期別</dt><dd>{{ periodData.label }}</dd>
            <dt>應繳金額</dt><dd>NT$ {{ periodData.amount?.toLocaleString() }}</dd>
          </template>
        </dl>
      </div>
    </main>

    <div class="success-bottom">
      <button class="success-bottom__btn" @click="goHome">回首頁</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const siteName = ref('登記完成')
const formData = ref(null)
const rateData = ref(null)
const periodData = ref(null)

onMounted(() => {
  const state = window.history.state
  if (!state?.form) {
    router.replace({ path: '/service/month/site', query: route.query })
    return
  }
  formData.value = state.form
  rateData.value = state.rate
  periodData.value = state.period
})

function goHome() {
  router.push({ path: '/service/month/site', query: route.query })
}
</script>

<style scoped>
.success-page { min-height: 100vh; padding-bottom: 72px; }
.success-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0d5c63; display: flex; align-items: center; padding: 0 16px; z-index: 50; }
.success-bar__title { color: #fefff9; font-size: 1.125rem; font-weight: 700; }
.success-page__body { padding: 80px 20px 20px; max-width: 500px; margin: 0 auto; text-align: center; }
.success-page__icon { font-size: 3rem; margin-bottom: 12px; }
.success-page__heading { color: #0d5c63; font-size: 1.5rem; margin-bottom: 8px; }
.success-page__sub { color: #666; font-size: 0.95rem; margin-bottom: 24px; }
.success-page__summary { background: #fff; border-radius: 8px; padding: 20px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: left; }
.success-page__summary dl { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; }
.success-page__summary dt { font-weight: 600; color: #0d5c63; font-size: 0.9rem; }
.success-page__summary dd { font-size: 0.95rem; }
.success-bottom { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
.success-bottom__btn { display: block; width: 100%; height: 56px; background: #0d5c63; color: #fefff9; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; }
</style>
