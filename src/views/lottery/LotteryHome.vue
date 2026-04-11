<template>
  <div class="lottery-home">
    <div class="lottery-home__center">
      <p class="lottery-home__date">{{ siteData?.date }}</p>
      <p class="lottery-home__place">
        {{ siteData?.placeName }}-{{ siteData?.vehicleType }}
      </p>
      <p class="lottery-home__subtitle">–月租登記–</p>

      <div class="lottery-home__buttons">
        <button class="btn-primary" @click="showConsent = true">
          開始登記
        </button>
        <button class="btn-outline" @click="$router.push('/place/lottery/query')">
          查詢登記
        </button>
      </div>
    </div>

    <ConsentDialog
      :open="showConsent"
      @agree="onAgree"
      @disagree="showConsent = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSiteData } from './config'
import ConsentDialog from './components/ConsentDialog.vue'

const router = useRouter()
const siteData = ref(null)
const showConsent = ref(false)

onMounted(async () => {
  siteData.value = await fetchSiteData()
})

function onAgree() {
  showConsent.value = false
  router.push('/place/lottery/register')
}
</script>

<style scoped>
.lottery-home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.lottery-home__center {
  text-align: center;
  padding: 24px;
}
.lottery-home__date {
  font-size: 1.75rem;
  font-weight: 300;
  color: #0d5c63;
  margin-bottom: 8px;
}
.lottery-home__place {
  font-size: 1.2rem;
  font-weight: 700;
  color: #237b7c;
  margin-bottom: 8px;
}
.lottery-home__subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: #0d5c63;
  margin-bottom: 32px;
}
.lottery-home__buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.btn-primary {
  background: #0d5c63;
  color: #fefff9;
  border: none;
  padding: 10px 48px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  min-width: 160px;
  cursor: pointer;
}
.btn-outline {
  background: transparent;
  color: #0d5c63;
  border: 1px solid #0d5c63;
  padding: 10px 48px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  min-width: 160px;
  cursor: pointer;
}
</style>
