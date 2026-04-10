<script setup>
import { onMounted, ref } from "vue";
import TheLayout from "../../components/TheLayout.vue";
const currentDate = new Date();
const date = ref("");
onMounted(() => {
  date.value = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;
});

import Api from "../../api";

const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const records = ref([]);
const isLoading = ref(false)
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const timeout = 1000
const getRecords = async () => {
  let result;
  try {
    isLoading.value = true
    const response = await Api.post(`/link/payment_record?bQz0fX8f=${route.query.bQz0fX8f}`, {
      memberLineId: route.query.mid,
      payment_date: date.value
    })
    if (response.data.returnCode == 0) {
      records.value = response.data.data.map((item) => ({
        id: item.id,
        year_month: item.payment_date,
        plate: item.license_plate,
        station: item.park_name,
        amount: item.payAmount
      }))
    } else {
      showAlert.value = true;
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      records.value = []
    }
  } catch (error) {
    showAlert.value = true;
    result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      records.value = []
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, timeout);
    setTimeout(() => {
      showAlert.value = false;
    }, timeout);
  }
  
};
onMounted(() => getRecords());

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useReceiptStore } from "../../stores/receipt";
const receiptStore = useReceiptStore();
const goDetails = (record) => {
  receiptStore.setReceipt({
    id: record.id
  })
  router.push({
    path: "/receipts/monthly/details",
    query: {
      mid: route.query.mid,
      bQz0fX8f: route.query.bQz0fX8f
    },
  })
};
</script>
<template>
  <TheLayout>
    <template #content>
      <loading v-model:active="isLoading" :is-full-page="true" />
      <div class="position-relative">
        <div
          v-if="showAlert"
          class="alert text-center position-absolute w-100 mx-auto"
          :class="alertType"
          role="alert"
        >
          {{ alertMessage }}
        </div>
      </div>
      
      <p class="text-green fw-bold fs-2 text-center py-3">月租繳費記錄</p>
      <el-date-picker
        class="w-100"
        v-model="date"
        type="month"
        format="YYYY-MM"
        value-format="YYYY-MM"
        placeholder="請選擇搜尋月份"
        @change="getRecords"
        :clearable="false"
        :disabled-date="(date) => date > maxDate"
      />
      <div class="search-results">
        <div
          v-for="record in records"
          :key="record.id"
          class="record-card my-3 p-4 rounded-3"
        >
          <p class="text-primary fs-4">{{ record.year_month }}</p>
          <p>{{ record.station }}&nbsp;{{ record.plate }}</p>
          <div class="d-flex justify-content-between">
            <p class="fs-2 fw-bold mb-0">${{ record.amount.toLocaleString("en", { minimumFractionDigits: 0 }) }}</p>
            <button class="btn btn-green" @click="goDetails(record)">發票／收據</button>
          </div>
        </div>
      </div>
    </template>
  </TheLayout>
</template>
<style scoped>
.record-card {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
