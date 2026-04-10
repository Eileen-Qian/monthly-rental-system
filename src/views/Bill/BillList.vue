<script setup>
import TheLayout from "../../components/TheLayout.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

import Api from "../../api";
import { useBasicInfoStore } from "../../stores/plate";
const basicInfoStore = useBasicInfoStore();
import { useBillStore } from "../../stores/bill";
const billStore = useBillStore();

const billDataMap = ref({});
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const isLoading = ref(false);
const getBillDataMap = async () => {
  
  isLoading.value = true;
  showAlert.value = true;
  let result;
  try {
    const response = await Api.post(
      `/link/billmain?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        license_plate: basicInfoStore.selectedOption,
        parkId: basicInfoStore.selectedParkId
      }
    );
    const apiData = response.data.data || {};
    const plate = basicInfoStore.selectedOption || "";

    const transformPeriod = (items) =>
      (items || []).map((item) => ({
        id: item.id.toString(),
        billId: item.billId,
        period: item.period,
        startMonth: item.startMonth,
        station: item.park_name,
        plate,
        car_sum: item.car_sum,
        amount: item.sumAmount - item.disAmount,
        dueDate: item.limitDate,
      }));

    if (response.data.returnCode == 0) {
      result = { status: "success", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      billDataMap.value = {
        monthly_rent: transformPeriod(apiData.monthly_rent),
        bimonthly_rent: transformPeriod(apiData.bimonthly_rent),
        quarterly_rent: transformPeriod(apiData.quarterly_rent),
        halfyear_rent: transformPeriod(apiData.halfyear_rent),
        year_rent: transformPeriod(apiData.year_rent),
      };
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    console.error(error);
    result = { status: "danger", message: response.data.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
};

const billingPeriodOptions = computed(() =>
  [
    { label: "月繳", value: "monthly_rent" },
    { label: "雙月繳", value: "bimonthly_rent" },
    { label: "季繳", value: "quarterly_rent" },
    { label: "半年繳", value: "halfyear_rent" },
    { label: "年繳", value: "year_rent" },
  ].filter((option) => billDataMap.value[option.value]?.length > 0)
);

const selectedPeriod = ref(null);
const billData = ref([]);

const selectPeriod = (startMonth) => {
  selectedPeriod.value = startMonth;
  billData.value = billDataMap.value[startMonth] || [];
};

onMounted(async () => {
  await getBillDataMap();
  if (billingPeriodOptions.value.length > 0) {
    selectedPeriod.value = billingPeriodOptions.value[0].value;
    billData.value = billDataMap.value[selectedPeriod.value];
  }
});

const goBill = (bill) => {
  router.push({
    path: `/bill`,
    query: {
      mid: route.query.mid,
      bQz0fX8f: route.query.bQz0fX8f 
    },
  });
  billStore.setBill({
    id: bill.id,
    billId: bill.billId,
    period: bill.period,
    startMonth: bill.startMonth,
    dueDate: bill.dueDate,
    amount: bill.amount,
    station: bill.station
  })
};
</script>

<template>
  <TheLayout>
    <template #content>
      <h3 class="pt-4 text-primary text-center mb-3">月租繳費</h3>
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
      <div class="d-flex justify-content-center gap-3 mb-4">
        <span
          v-for="option in billingPeriodOptions"
          :key="option.value"
          class="payment-option"
          :class="{ selected: selectedPeriod === option.value }"
          @click="selectPeriod(option.value)"
        >
          {{ option.label }}
        </span>
      </div>
      <div class="bill-container">
        <div
          v-for="bill in billData"
          :key="bill.plate"
          class="bill p-4 mx-auto mb-4"
        >
          <p class="fs-5 text-primary fw-bold mb-3">{{ bill.startMonth }}</p>
          <div class="text-muted mb-3">
            <span>{{ bill.station }}&nbsp;</span>
            <span>{{ bill.plate }}</span>
          </div>
          <p class="fs-1 fw-bold mb-0">
            <span>$</span>
            {{ bill.amount.toLocaleString("en", { minimumFractionDigits: 0 }) }}
          </p>
          <p>共有{{ bill.car_sum }}台共租</p>
          <button
            class="btn btn-primary w-100 mb-3 rounded-pill"
            @click="goBill(bill)"
          >
            繳費單
          </button>
          <div class="text-danger text-center">
            繳費期限：{{ bill.dueDate }}
          </div>
        </div>
      </div>
    </template>
  </TheLayout>
</template>

<style lang="scss" scoped>
@import "../../assets/scss/main.scss";
@import "../../assets/scss/custom-bootstrap.scss";
.h-100 {
  min-height: 100vh;
}
.payment-option {
  cursor: pointer;
  color: $gray-400;
}
.payment-option.selected {
  color: $primary;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.bill-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}
.bill {
  max-width: 350px;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
