<template>
  <div class="form-page">
    <header class="form-bar">
      <button class="form-bar__back" @click="goBack">←</button>
      <h1 class="form-bar__title">{{ siteName }}</h1>
    </header>

    <main class="form-page__body">
      <h2 class="form-page__heading">基本資料</h2>

      <div class="form-page__fields">
        <!-- 車型類別 -->
        <div class="form-page__full">
          <label class="form-label">車型類別 *</label>
          <select v-model="form.carType" class="form-select" @change="onCarTypeChange">
            <option value="" disabled>請選擇</option>
            <option v-for="ct in carTypeOptions" :key="ct.value" :value="ct.value">
              {{ ct.label }}
            </option>
          </select>
          <p v-if="errors.carType" class="form-error">{{ errors.carType }}</p>
        </div>

        <!-- 身分費率 -->
        <div v-if="form.carType" class="form-page__full">
          <label class="form-label">身分費率 *</label>
          <select v-model="form.rateName" class="form-select" @change="onRateChange">
            <option value="" disabled>請選擇</option>
            <option v-for="r in rateOptions" :key="r.value" :value="r.value">
              {{ r.label }}
            </option>
          </select>
          <p v-if="errors.rateName" class="form-error">{{ errors.rateName }}</p>
        </div>

        <!-- 繳費期別 -->
        <div v-if="form.rateName" class="form-page__full">
          <label class="form-label">繳費期別 *</label>
          <select v-model="form.paymentPeriod" class="form-select">
            <option value="" disabled>請選擇</option>
            <option v-for="p in periodOptions" :key="p.value" :value="p.value">
              {{ p.label }}
            </option>
          </select>
          <p v-if="errors.paymentPeriod" class="form-error">{{ errors.paymentPeriod }}</p>
        </div>

        <!-- 費率金額 -->
        <div v-if="selectedPeriod" class="form-page__full form-page__fee">
          <span class="form-page__fee-label">費率金額</span>
          <span class="form-page__fee-amount">NT$ {{ selectedPeriod.amount.toLocaleString() }}</span>
          <span class="form-page__fee-per">／{{ selectedPeriod.label }}</span>
        </div>

        <!-- 基本欄位 -->
        <div>
          <label class="form-label">車主姓名 *</label>
          <input v-model="form.name" class="form-input" placeholder="車主姓名" />
          <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
        </div>
        <div>
          <label class="form-label">手機號碼 *</label>
          <input v-model="form.phone" class="form-input" type="tel" placeholder="09 開頭共 10 碼" />
          <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
        </div>
        <div>
          <label class="form-label">車牌號碼 *</label>
          <input v-model="form.carNumber" class="form-input" placeholder="包含 - 例：ABC-1234" />
          <p v-if="errors.carNumber" class="form-error">{{ errors.carNumber }}</p>
        </div>
        <div class="form-page__full">
          <label class="form-label">聯絡地址</label>
          <input v-model="form.address" class="form-input" placeholder="選填" />
        </div>
        <div>
          <label class="form-label">起租日 *</label>
          <input v-model="form.beginDate" class="form-input" type="date" :min="tomorrow" />
          <p v-if="errors.beginDate" class="form-error">{{ errors.beginDate }}</p>
        </div>
        <div>
          <label class="form-label">統一編號</label>
          <input v-model="form.taxId" class="form-input" placeholder="選填，8 碼" />
          <p v-if="errors.taxId" class="form-error">{{ errors.taxId }}</p>
        </div>
        <div>
          <label class="form-label">公司抬頭</label>
          <input v-model="form.company" class="form-input" placeholder="選填" />
        </div>
        <div>
          <label class="form-label">Email</label>
          <input v-model="form.email" class="form-input" type="email" placeholder="選填" />
          <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
        </div>
        <div>
          <label class="form-label">手機載具</label>
          <input v-model="form.carrier" class="form-input" placeholder="選填，/ 開頭共 8 碼" />
          <p v-if="errors.carrier" class="form-error">{{ errors.carrier }}</p>
        </div>
      </div>
    </main>

    <div class="form-bottom">
      <button class="form-bottom__btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '送出中...' : '送出資料' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  fetchSiteInfo,
  fetchRates,
  getAvailablePeriods,
  submitRegistration,
  CAR_TYPE_LABELS,
  ApiError,
} from './api/monthlyRental.js'
import { isValidCarNumber, isValidCarrier, isValidEmail, isValidPhone, isValidTaxId } from './utils/validators.js'
import { alertError } from './utils/alert.js'

const router = useRouter()
const route = useRoute()
const siteCode = route.params.siteCode
const siteName = ref('')
const rates = ref([])
const submitting = ref(false)

const form = reactive({
  carType: '', rateName: '', paymentPeriod: '',
  name: '', phone: '', carNumber: '', address: '',
  beginDate: fmtDate(addDays(new Date(), 1)),
  email: '', carrier: '', taxId: '', company: '',
})
const errors = reactive({})

const tomorrow = fmtDate(addDays(new Date(), 1))
const today = fmtDate(new Date())

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate()+n); return r }

onMounted(async () => {
  try {
    const data = window.history.state?.siteInfo || await fetchSiteInfo(siteCode)
    siteName.value = data.site.parkName || data.site.siteName
    rates.value = await fetchRates(siteCode)
  } catch (err) {
    const msg = err instanceof ApiError ? err.message : '載入失敗'
    alertError(msg)
  }
})

const carTypeOptions = computed(() => {
  const types = [...new Set(rates.value.map(r => r.carType))]
  return types.map(ct => ({ value: ct, label: CAR_TYPE_LABELS[ct] ?? `類型 ${ct}` }))
})
const filteredRates = computed(() => form.carType ? rates.value.filter(r => r.carType === form.carType) : [])
const rateOptions = computed(() => filteredRates.value.map(r => ({ value: r.rateName, label: r.rateName })))
const selectedRate = computed(() => filteredRates.value.find(r => r.rateName === form.rateName))
const periodOptions = computed(() => getAvailablePeriods(selectedRate.value).map(p => ({ value: p.key, label: p.label })))
const selectedPeriod = computed(() => getAvailablePeriods(selectedRate.value).find(p => p.key === form.paymentPeriod))

function onCarTypeChange() { form.rateName = ''; form.paymentPeriod = '' }
function onRateChange() { form.paymentPeriod = '' }

function validate() {
  const e = {}
  if (!form.carType) e.carType = '請選擇車型類別'
  if (!form.rateName) e.rateName = '請選擇身分費率'
  if (!form.paymentPeriod) e.paymentPeriod = '請選擇繳費期別'
  if (!form.name.trim()) e.name = '請輸入車主姓名'
  if (!form.phone) e.phone = '請輸入手機號碼'
  else if (!isValidPhone(form.phone)) e.phone = '手機號碼格式：09 開頭共 10 碼'
  if (!form.carNumber.trim()) e.carNumber = '請輸入車牌號碼'
  else if (!isValidCarNumber(form.carNumber)) e.carNumber = '格式範例:ABC-1234'
  if (!form.beginDate) e.beginDate = '請選擇起租日'
  else if (form.beginDate <= today) e.beginDate = '起租日需為明日(含)之後'
  if (form.email && !isValidEmail(form.email)) e.email = 'Email 格式不正確'
  if (form.carrier && !isValidCarrier(form.carrier)) e.carrier = '/ 開頭共 8 碼'
  if (form.taxId && !isValidTaxId(form.taxId)) e.taxId = '統一編號格式不正確'
  return e
}

async function handleSubmit() {
  const errs = validate()
  Object.keys(errors).forEach(k => delete errors[k])
  Object.assign(errors, errs)
  if (Object.keys(errs).length) return

  submitting.value = true
  try {
    const result = await submitRegistration({
      ...form, siteCode,
      rate: selectedRate.value,
      period: selectedPeriod.value,
    })
    if (!result.success) return
    if (result.hasBill && result.billId) {
      window.location.href = `https://rental.mitwit-cre.com.tw/?mid=${result.billId}`
    } else {
      router.push({
        path: `/service/month/site/success/${siteCode}`,
        query: route.query,
        state: { form: { ...form }, rate: selectedRate.value, period: selectedPeriod.value },
      })
    }
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.push({ path: '/service/month/site', query: route.query })
}
</script>

<style scoped>
.form-page { min-height: 100vh; padding-bottom: 72px; }
.form-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0d5c63; display: flex; align-items: center; gap: 8px; padding: 0 16px; z-index: 50; }
.form-bar__back { background: none; border: none; color: #fefff9; font-size: 1.25rem; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.form-bar__title { color: #fefff9; font-size: 1.125rem; font-weight: 700; }
.form-page__body { padding: 72px 16px 16px; max-width: 960px; margin: 0 auto; }
.form-page__heading { text-align: center; color: #0d5c63; font-size: 1.25rem; font-weight: 900; margin-bottom: 8px; }
.form-page__fields { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px) { .form-page__fields { grid-template-columns: repeat(3, 1fr); } }
.form-page__full { grid-column: 1 / -1; }
.form-label { display: block; font-size: 0.8rem; color: #666; margin-bottom: 4px; }
.form-input, .form-select { width: 100%; padding: 10px 12px; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; outline: none; background: #fff; }
.form-input:focus, .form-select:focus { border-color: #0d5c63; }
.form-error { color: #d32f2f; font-size: 0.78rem; margin-top: 4px; }
.form-page__fee { display: flex; align-items: baseline; gap: 8px; padding: 12px 16px; background: linear-gradient(135deg, #e8f5f5, #d4eded); border-left: 4px solid #0d5c63; border-radius: 8px; }
.form-page__fee-label { font-size: 0.85rem; color: #666; }
.form-page__fee-amount { font-size: 1.25rem; font-weight: 800; color: #0d5c63; }
.form-page__fee-per { font-size: 0.85rem; color: #666; }
.form-bottom { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; }
.form-bottom__btn { display: block; width: 100%; height: 56px; background: #0d5c63; color: #fefff9; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer; }
.form-bottom__btn:disabled { background: #aaa; cursor: default; }
</style>
