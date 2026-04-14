<template>
  <div class="terms-page">
    <header class="terms-bar">
      <button class="terms-bar__back" @click="goBack">←</button>
      <h1 class="terms-bar__title">{{ siteName }}</h1>
    </header>

    <main class="terms-page__body">
      <h2 class="terms-page__heading">- 場站條款 -</h2>

      <div class="terms-page__box">
        <p
          v-for="(item, i) in terms"
          :key="i"
          :class="['terms-page__line', { 'terms-page__line--red': item.red }]"
        >
          {{ item.text || '\u00A0' }}
        </p>
      </div>

      <label class="terms-page__checkbox">
        <input v-model="agreed" type="checkbox" />
        <span>我已同意此條款</span>
      </label>
    </main>

    <div class="terms-bottom">
      <button class="terms-bottom__btn" :disabled="!agreed" @click="goNext">
        下一步
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchSiteInfo } from './api/monthlyRental.js'

const router = useRouter()
const route = useRoute()
const siteCode = route.params.siteCode
const siteName = ref('月租登記')
const terms = ref([])
const agreed = ref(false)

onMounted(async () => {
  try {
    const data =
      window.history.state?.siteInfo || (await fetchSiteInfo(siteCode))
    siteName.value = data.site.parkName || data.site.siteName
    terms.value = data.terms || []

    if (!data.termContent) {
      router.replace({
        path: `/service/month/site/form/${siteCode}`,
        query: route.query,
      })
    }
  } catch {
    router.replace({ path: '/service/month/site', query: route.query })
  }
})

function goBack() {
  router.push({ path: '/service/month/site', query: route.query })
}

function goNext() {
  router.push({
    path: `/service/month/site/form/${siteCode}`,
    query: route.query,
  })
}
</script>

<style scoped>
.terms-page { min-height: 100vh; padding-bottom: 72px; }
.terms-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0d5c63; display: flex; align-items: center; gap: 8px; padding: 0 16px; z-index: 50; }
.terms-bar__back { background: none; border: none; color: #fefff9; font-size: 1.25rem; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.terms-bar__title { color: #fefff9; font-size: 1.125rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.terms-page__body { padding: 72px 16px 16px; max-width: 800px; margin: 0 auto; }
.terms-page__heading { text-align: center; color: #0d5c63; font-size: 1.15rem; margin-bottom: 12px; }
.terms-page__box { background: #fff; border-radius: 8px; padding: 16px; max-height: 63vh; overflow-y: auto; font-size: 0.9rem; line-height: 1.6; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.terms-page__line { margin-bottom: 4px; }
.terms-page__line--red { color: #d32f2f; }
.terms-page__checkbox { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; font-size: 0.95rem; cursor: pointer; }
.terms-page__checkbox input { width: 20px; height: 20px; accent-color: #0d5c63; cursor: pointer; }
.terms-bottom { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
.terms-bottom__btn { display: block; width: 100%; height: 56px; background: #0d5c63; color: #fefff9; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; }
.terms-bottom__btn:disabled { background: #aaa; cursor: not-allowed; }
</style>
