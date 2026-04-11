<template>
  <div>
    <LotteryTopBar title="月租登記" />
    <div v-if="!siteData" class="reg-page" style="text-align:center;padding-top:120px">載入中...</div>
    <div v-else class="reg-page">
      <!-- 成功畫面 -->
      <div v-if="submitted" class="reg-success">
        <p class="reg-success__icon">✓</p>
        <p class="reg-success__text">登記完成</p>
        <p class="reg-success__detail">
          車牌 <strong>{{ form.plate }}</strong> 已完成登記
        </p>
      </div>

      <!-- 表單 -->
      <template v-else>
        <div class="reg-page__card-wrap">
          <InfoCard :site-data="siteData" />
        </div>

        <form @submit.prevent="handleSubmit">
          <p class="reg-section-title">基本資料</p>

          <div class="reg-select-row">
            <div class="reg-select-wrap">
              <select
                v-model="form.identity"
                :class="['reg-select', { 'reg-select--error': errors.identity }]"
                @change="onIdentityChange"
              >
                <option value="" disabled>身分類別</option>
                <option
                  v-for="cat in siteData?.identityCategories"
                  :key="cat.value"
                  :value="cat.value"
                >
                  {{ cat.label }}
                </option>
              </select>
              <p v-if="errors.identity" class="reg-error">{{ errors.identity }}</p>
            </div>

            <div v-if="areaOptions.length" class="reg-select-wrap">
              <select
                v-model="form.area"
                :class="['reg-select', { 'reg-select--error': errors.area }]"
                @change="errors.area = ''"
              >
                <option value="" disabled>登記區域</option>
                <option
                  v-for="a in areaOptions"
                  :key="a.value"
                  :value="a.value"
                >
                  {{ a.label }}
                </option>
              </select>
              <p v-if="errors.area" class="reg-error">{{ errors.area }}</p>
            </div>
          </div>

          <p v-if="selectedAreaLabel" class="reg-area-full">
            {{ selectedAreaLabel }}
          </p>

          <hr class="reg-divider" />

          <div class="reg-fields">
            <div class="reg-field">
              <label class="reg-label">車主真實姓名</label>
              <input
                v-model="form.name"
                :class="['reg-input', { 'reg-input--error': errors.name }]"
                type="text"
                placeholder="車主真實姓名"
                @input="errors.name = ''"
              />
              <p v-if="errors.name" class="reg-error">{{ errors.name }}</p>
            </div>

            <div class="reg-field">
              <label class="reg-label">
                車牌號碼 <small>("包含符號 - " e.g.1234-TT)</small>
              </label>
              <input
                v-model="form.plate"
                :class="['reg-input', { 'reg-input--error': errors.plate }]"
                type="text"
                placeholder="e.g. 1234-TT"
                @input="errors.plate = ''"
              />
              <p v-if="errors.plate" class="reg-error">{{ errors.plate }}</p>
            </div>

            <div class="reg-field">
              <label class="reg-label">手機號碼</label>
              <input
                v-model="form.phone"
                :class="['reg-input', { 'reg-input--error': errors.phone }]"
                type="tel"
                placeholder="手機號碼"
                @input="errors.phone = ''"
              />
              <p v-if="errors.phone" class="reg-error">{{ errors.phone }}</p>
            </div>
          </div>

          <div class="reg-submit-wrap">
            <button type="submit" class="reg-submit-btn">送出登記</button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { fetchSiteData } from './config'
import LotteryTopBar from './components/LotteryTopBar.vue'
import InfoCard from './components/InfoCard.vue'

const siteData = ref(null)
const submitted = ref(false)
const form = reactive({ identity: '', area: '', name: '', plate: '', phone: '' })
const errors = reactive({ identity: '', area: '', name: '', plate: '', phone: '' })

onMounted(async () => {
  siteData.value = await fetchSiteData()
})

const areaOptions = computed(() => {
  const cat = siteData.value?.identityCategories?.find(c => c.value === form.identity)
  return cat ? cat.areas : []
})

const selectedAreaLabel = computed(() => {
  const a = areaOptions.value.find(a => a.value === form.area)
  return a ? a.label : ''
})

function onIdentityChange() {
  form.area = ''
  errors.identity = ''
  errors.area = ''
}

function validate() {
  const errs = {}
  if (!form.identity) errs.identity = '請選擇身分類別'
  if (!form.area) errs.area = '請選擇登記區域'
  if (!form.name.trim()) errs.name = '請填寫車主姓名'
  if (!form.plate.trim()) {
    errs.plate = '請填寫車牌號碼'
  } else if (!/^[^\s]+-[^\s]+$/.test(form.plate.trim())) {
    errs.plate = '車牌格式錯誤，需包含 "-" 且前後無空格'
  }
  if (!form.phone.trim()) {
    errs.phone = '請填寫手機號碼'
  } else if (!/^09\d{8}$/.test(form.phone.trim())) {
    errs.phone = '手機格式錯誤，需 09 開頭共 10 碼'
  }
  return errs
}

function handleSubmit() {
  const errs = validate()
  Object.assign(errors, { identity: '', area: '', name: '', plate: '', phone: '', ...errs })
  if (Object.keys(errs).length) return
  // TODO: 接 API
  submitted.value = true
}
</script>

<style scoped>
.reg-page { padding: 72px 16px 40px; max-width: 900px; margin: 0 auto; }
.reg-page__card-wrap { text-align: center; margin-bottom: 24px; }
.reg-section-title { font-size: 1rem; font-weight: 700; color: #0d5c63; margin-bottom: 12px; text-align: left; }
.reg-select-row { display: flex; gap: 16px; margin-bottom: 8px; }
.reg-select-wrap { flex: 1; min-width: 0; }
.reg-select { width: 100%; padding: 10px 12px; font-size: 1rem; border: none; border-bottom: 2px solid #0d5c63; background: transparent; outline: none; }
.reg-select--error { border-bottom-color: #d32f2f; }
.reg-area-full { margin-top: 8px; padding: 10px 12px; font-size: 0.9rem; color: #237b7c; line-height: 1.6; word-break: break-all; }
.reg-divider { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
.reg-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.reg-field { display: flex; flex-direction: column; }
.reg-label { font-size: 0.8rem; color: #666; margin-bottom: 4px; }
.reg-label small { color: #999; }
.reg-input { padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; outline: none; }
.reg-input:focus { border-color: #0d5c63; }
.reg-input--error { border-color: #d32f2f; }
.reg-error { color: #d32f2f; font-size: 0.78rem; margin-top: 4px; }
.reg-submit-wrap { margin-top: 32px; text-align: center; }
.reg-submit-btn { background: #0d5c63; color: #fefff9; border: none; padding: 12px 64px; font-size: 1rem; font-weight: 700; border-radius: 4px; cursor: pointer; }
.reg-success { text-align: center; margin-top: 80px; }
.reg-success__icon { font-size: 3rem; color: #0d5c63; margin-bottom: 12px; }
.reg-success__text { font-size: 1.5rem; font-weight: 700; color: #0d5c63; margin-bottom: 8px; }
.reg-success__detail { color: #666; }
</style>
