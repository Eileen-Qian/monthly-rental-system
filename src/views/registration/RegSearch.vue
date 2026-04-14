<template>
  <div class="reg-search">
    <header class="reg-bar">
      <h1 class="reg-bar__title">月租登記</h1>
    </header>

    <main class="reg-search__body">
      <div class="reg-search__row">
        <div class="reg-search__input-wrap">
          <i class="mdi mdi-magnify reg-search__input-icon" />
          <input
            v-model="code"
            class="reg-search__input"
            placeholder="場站代碼"
            :disabled="loading"
            @keydown.enter="handleSearch"
          />
        </div>
        <button
          class="reg-search__btn"
          :disabled="loading"
          @click="handleSearch"
        >
          <span v-if="loading" class="reg-search__spinner" />
          <i v-else class="mdi mdi-magnify" />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchSiteInfo, ApiError } from './api/monthlyRental.js'
import { getCompanyToken } from './utils/urlParams.js'
import { alertError, alertWarning } from './utils/alert.js'

const router = useRouter()
const route = useRoute()
const code = ref('')
const loading = ref(false)

onMounted(() => {
  if (!getCompanyToken()) {
    alertWarning('請從正確連結進入此頁面。', '缺少網址參數')
  }
})

async function handleSearch() {
  const trimmed = code.value.trim()
  if (!trimmed) return

  loading.value = true
  try {
    const result = await fetchSiteInfo(trimmed)
    const target = result.termContent
      ? `/service/month/site/terms/${result.site.siteCode}`
      : `/service/month/site/form/${result.site.siteCode}`

    router.push({
      path: target,
      query: route.query,
      state: { siteInfo: result },
    })
  } catch (err) {
    if (err instanceof ApiError) {
      alertError(err.message)
    } else {
      alertError('發生未預期錯誤，請稍後再試。')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reg-search { min-height: 100vh; }
.reg-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0d5c63; display: flex; align-items: center; padding: 0 16px; z-index: 50; }
.reg-bar__title { color: #fefff9; font-size: 1.125rem; font-weight: 700; }
.reg-search__body { padding: 80px 20px 20px; max-width: 600px; margin: 0 auto; }
.reg-search__row { display: flex; gap: 12px; align-items: center; }
.reg-search__input-wrap { flex: 1; border: 2px solid #ccc; border-radius: 24px; padding: 10px 16px; background: #fff; transition: border-color 0.2s; }
.reg-search__input-wrap:focus-within { border-color: #0d5c63; }
.reg-search__input-icon { font-size: 1.4rem; color: #999; flex-shrink: 0; }
.reg-search__input { flex: 1; border: none; outline: none; background: transparent; font-size: 1rem; }
.reg-search__btn { flex-shrink: 0; width: 52px; height: 52px; border-radius: 50%; background: #0d5c63; color: #fefff9; font-size: 1.5rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.reg-search__btn:hover:not(:disabled) { background: #0e6b73; }
.reg-search__btn:disabled { cursor: default; }
.reg-search__spinner { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fefff9; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
