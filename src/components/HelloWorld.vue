<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBasicInfoStore } from "../stores/plate";
const basicInfoStore = useBasicInfoStore();

const route = useRoute();
const router = useRouter();

const mid = route.query.mid;
const bQz0fX8f = route.query.bQz0fX8f;

import billIcon from "/src/assets/icons/bill.png";
import invoiceIcon from "/src/assets/icons/invoice.png";
import receiptIcon from "/src/assets/icons/receipt.png";
import basicInfoIcon from "/src/assets/icons/basic_info.png";
import contractIcon from "/src/assets/icons/contract.png";
import pointsIcon from "/src/assets/icons/points.png";

const navItems = ref([
  {
    name: "繳費單",
    path: `/bill-list?mid=${mid}&bQz0fX8f=${bQz0fX8f}`,
    icon: billIcon,
    alt: "bill",
  },
  {
    name: "發票設定",
    path: `/invoice-setting?mid=${mid}&bQz0fX8f=${bQz0fX8f}`,
    icon: invoiceIcon,
    alt: "invoice",
  },
  {
    name: "繳費收據",
    path: `/receipts?mid=${mid}&bQz0fX8f=${bQz0fX8f}`,
    icon: receiptIcon,
    alt: "receipt",
  },
  {
    name: "資訊設定",
    path: `/basic-info?mid=${mid}&bQz0fX8f=${bQz0fX8f}`,
    icon: basicInfoIcon,
    alt: "basic_info",
  },
  {
    name: "合約",
    path: `/contract?mid=${mid}&bQz0fX8f=${bQz0fX8f}`,
    icon: contractIcon,
    alt: "contract",
  },
  {
    name: "點數/儲值金",
    path: `/points?mid=${mid}&bQz0fX8f=${bQz0fX8f}`,
    icon: pointsIcon,
    alt: "points",
  },
]);

import Api from "../api";
const isLoading = ref(false);
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);

const selectedOption = ref(null);
onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await Api.post(
      `/link/selectmain?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        memberLineId: route.query.mid,
      }
    );

    showAlert.value = true;
    let result;
    if (response.data.returnCode == 0) {
    const options = response.data.data.getmain.map((item) => ({
      label: `${item.park_name} - ${item.license_plate}`,
      value: item.license_plate,
      parkId: item.parkId,
    }));
    const defaultSelected = options[0];
    
    basicInfoStore.name = response.data.data.LineName
    basicInfoStore.options = options;
    basicInfoStore.selectedOption = defaultSelected.value;
    basicInfoStore.selectedParkId = defaultSelected.parkId;

    // 設定給 v-model
    selectedOption.value = defaultSelected;
  } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      basicInfoStore.setBasicInfo({
        name: "",
        options: [],
        selectedOption: "",
      });
    }
  } catch (error) {
    result = { status: "danger", message: error.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
    basicInfoStore.setBasicInfo({
        name: "",
        options: [],
        selectedOption: "",
      });
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
});

const updateSelectedInfo = () => {
  if (selectedOption.value) {
    basicInfoStore.selectedOption = selectedOption.value.value; // 車牌號碼
    basicInfoStore.selectedParkId = selectedOption.value.parkId;
  }
};

</script>

<template>
  <div class="my-3 d-flex align-items-center justify-content-center">
    <div class="container">
      <section class="my-3 position-relative">
        <div
          v-if="showAlert"
          class="alert text-center position-absolute w-100 mx-auto"
          :class="alertType"
          role="alert"
        >
          {{ alertMessage }}
        </div>
        <loading v-model:active="isLoading" :is-full-page="true" />
        <h2>您好 {{ basicInfoStore.name }}</h2>
        <p>基本訊息</p>
        <div class="basic-info">
          <div class="d-flex justify-content-center align-items-center">
            <img src="/src/assets/icons/pin.png" alt="pin" />
            <span>月租場站&nbsp;</span>
            <select
              v-model="selectedOption"
              class="p-3 rounded-3 bg-light"
              @change="updateSelectedInfo"
            >
              <option
                v-for="option in basicInfoStore.options"
                :value="option"
                :key="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </section>
      <section>
        <div class="row g-3">
          <div class="col-12">
            <router-link
              :to="navItems[0].path"
              class="btn border d-flex align-items-center p-3"
            >
              <img
                :src="navItems[0].icon"
                :alt="navItems[0].alt"
                class="me-2"
                width="25"
                height="25"
              />
              {{ navItems[0].name }}
            </router-link>
          </div>
          <div class="col-6">
            <router-link
              :to="navItems[1].path"
              class="btn border d-flex align-items-center p-3"
            >
              <img
                :src="navItems[1].icon"
                :alt="navItems[1].alt"
                class="me-2"
                width="25"
                height="25"
              />
              {{ navItems[1].name }}
            </router-link>
          </div>
          <div class="col-6">
            <router-link
              :to="navItems[2].path"
              class="btn border d-flex align-items-center p-3"
            >
              <img
                :src="navItems[2].icon"
                :alt="navItems[2].alt"
                class="me-2"
                width="25"
                height="25"
              />
              {{ navItems[2].name }}
            </router-link>
          </div>
          <div class="col-6">
            <router-link
              :to="navItems[3].path"
              class="btn border d-flex align-items-center p-3"
            >
              <img
                :src="navItems[3].icon"
                :alt="navItems[3].alt"
                class="me-2"
                width="25"
                height="25"
              />
              {{ navItems[3].name }}
            </router-link>
          </div>
          <div class="col-6">
            <router-link
              :to="navItems[4].path"
              class="btn border d-flex align-items-center p-3"
            >
              <img
                :src="navItems[4].icon"
                :alt="navItems[4].alt"
                class="me-2"
                width="25"
                height="25"
              />
              {{ navItems[4].name }}
            </router-link>
          </div>
          <div class="col-12">
            <router-link
              :to="navItems[5].path"
              class="btn border d-flex align-items-center p-3"
            >
              <img
                :src="navItems[5].icon"
                :alt="navItems[5].alt"
                class="me-2"
                width="25"
                height="25"
              />
              {{ navItems[5].name }}
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.basic-info {
  padding: 5px;
  border-radius: 5px;
  background: #e8e8e8;
}
</style>