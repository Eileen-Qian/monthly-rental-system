<script setup>
import Api from "../api";

import TheLayout from "../components/TheLayout.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useBasicInfoStore } from "../stores/plate";
const basicInfoStore = useBasicInfoStore();

const route = useRoute();
const router = useRouter();

const basic_info = ref({});
const isLoading = ref(false);
const getBasic_info = async () => {
  isLoading.value = true;
  try {
    const response = await Api.post(
      `/link/infoset_select?bQz0fX8f=${route.query.bQz0fX8f}`,
      { license_plate: basicInfoStore.selectedOption || "" }
    );
    if (response.data.returnCode == 0) {
      basic_info.value = {
        name: response.data.data.name,
        phone_number: response.data.data.phone_number,
        address: response.data.data.address,
        mail: response.data.data.mail,
        sec_name: response.data.data.sec_name,
        sec_phone_number: response.data.data.sec_phone_number,
      };
    } else {
      basic_info.value = {};
    }
  } catch (error) {
    console.error(errpr);
  } finally {
    isLoading.value = false;
  }
};

onMounted(getBasic_info);

const goInvoiceSetting = () => {
  router.push({ name: "InvoiceSetting", query: { mid: route.query.mid, bQz0fX8f: route.query.bQz0fX8f} });
};

const goBack = () => {
  router.go(-1);
};

const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const updateSettings = async () => {
  isLoading.value = true;
  let result;
  try {
    const response = await Api.post(
      `/link/infoset_update?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        license_plate: basicInfoStore.selectedOption || "",
        mail: basic_info.value.mail,
        sec_name: basic_info.value.sec_name,
        sec_phone_number: basic_info.value.sec_phone_number,
      }
    );
    showAlert.value = true;

    if (response.data.returnCode == 0) {
      result = { status: "success", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      getBasic_info();
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    result = { status: "danger", message: error.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
    console.error(error);
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
};
</script>

<template>
  <TheLayout>
    <template #content>
      <h2 class="text-center py-3">資訊設定</h2>
      <div class="position-relative">
        <div
          v-if="showAlert"
          class="alert text-center position-absolute w-100"
          :class="alertType"
          role="alert"
        >
          {{ alertMessage }}
        </div>
      </div>
      <loading v-model:active="isLoading" :is-full-page="true" />
      <div class="p-3">
        <div class="row mb-3">
          <label class="col-3 form-label mb-0">租用人</label>
          <div class="col-9">
            <input
              v-model="basic_info.name"
              type="text"
              class="form-control"
              readonly
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-3 form-label mb-0">聯絡電話</label>
          <div class="col-9">
            <input
              v-model="basic_info.phone_number"
              type="text"
              class="form-control"
              readonly
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-3 form-label mb-0">通訊地址</label>
          <div class="col-9">
            <textarea
              v-model="basic_info.address"
              class="form-control text-wrap"
              rows="2"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-3 form-label mb-0">Email</label>
          <div class="col-9">
            <input
              v-model="basic_info.mail"
              type="email"
              class="form-control"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-3 form-label mt-2">發票設定</label>
          <div class="col-9">
            <button class="btn btn-sm btn-primary" @click="goInvoiceSetting">
              <img src="../assets/icons/invoiceW.png" alt="invoice" />
              <span class="text-white px-2">設定頁面</span>
            </button>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-3 form-label mb-0 text-nowrap">第二聯絡人</label>
          <div class="col-9">
            <input
              v-model="basic_info.sec_name"
              type="text"
              class="form-control"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-3 form-label mb-0">聯絡電話</label>
          <div class="col-9">
            <input
              v-model="basic_info.sec_phone_number"
              type="text"
              class="form-control"
            />
          </div>
        </div>
        <div class="d-flex justify-content-end gap-3">
          <button class="btn btn-outline-warning px-5" @click="goBack">
            離開
          </button>
          <button class="btn btn-warning" @click="updateSettings">
            <span class="text-white px-5">完成設定</span>
          </button>
        </div>
      </div>
    </template>
  </TheLayout>
</template>
