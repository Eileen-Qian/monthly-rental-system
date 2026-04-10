<script setup>
import Api from "../api";
import { useRoute, useRouter } from "vue-router";
import { useBasicInfoStore } from "../stores/plate";
const basicInfoStore = useBasicInfoStore();

const route = useRoute();
const router = useRouter();
import TheLayout from "../components/TheLayout.vue";
import { ref, onMounted } from "vue";

const buyerId = ref("");
const buyerTitle = ref("");
const carrier = ref("");
const email = ref("");
const savedData = ref({ buyerId: "", title: "", carrier: "", email: "" });
const errors = ref({});

const validateUnifiedNumber = (unifiedNumber) => {
  // 如果沒填寫（null、undefined、空字串），視為驗證通過
  if (!unifiedNumber || unifiedNumber.trim() === '') {
    return true;
  }

  // 檢查字元是否符合規則
      const regex = /^[0-9]{8}$/;

      // 統一編號 邏輯乘數
      const logicMultipliers = [1, 2, 1, 2, 1, 2, 4, 1];

      // 計算陣列總和
      const sum = (numbers) => {
        const initialValue = 0;
        const sumWithInitial = numbers.reduce(
          (accumulator, currentValue) =>
            Number(accumulator) + Number(currentValue),
          initialValue
        );
        return sumWithInitial;
      };

      if (!unifiedNumber) {
        return false;
      }
      if (unifiedNumber.length !== 8 || !regex.test(unifiedNumber)) {
        return false;
      }

      let logicProductArr = [];
      let logicProduct = 0;
      // 統一編號倒數第二位為7時，乘積之和最後第二位數取0或1均可，其中之一和能被5整除，則符合統編邏輯
      if (unifiedNumber[6] == "7") {
        for (let i = 0; i < unifiedNumber.length; i++) {
          if (i != 6) {
            logicProductArr.push(
              parseInt(unifiedNumber[i]) * logicMultipliers[i]
            );
          }
        }
      } else {
        for (let i = 0; i < unifiedNumber.length; i++) {
          logicProductArr.push(
            parseInt(unifiedNumber[i]) * logicMultipliers[i]
          );
        }
      }

      for (const item of logicProductArr) {
        logicProduct += sum(item.toString().split(""));
      }

      if (
        unifiedNumber[6] === "7" &&
        (logicProduct % 5 === 0 || (logicProduct + 1) % 5 === 0)
      ) {
        return true;
      } else if (logicProduct % 5 === 0) {
        return true;
      }

      return false;
};

const validateCarrier = (value) => {
  if (!value) return true;
  return /^\/[0-9A-Z.+-]{7}$/.test("/" + value);
};

const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if(buyerId.value && !buyerTitle.value) {
    errors.value.buyerTitle = '買方抬頭為必填';
    isValid = false;
  }

  if (!validateUnifiedNumber(buyerId.value)) {
    errors.value.buyerId = "買方統編格式不正確";
    isValid = false;
  }

  if (carrier.value && !validateCarrier(carrier.value)) {
    errors.value.carrier = "不是有效的共通性手機載具";
    isValid = false;
  }

  if (!email.value) {
    errors.value.email = "Email為必填";
    isValid = false;
  } else if (!validateEmail(email.value)) {
    errors.value.email = "Email格式不正確";
    isValid = false;
  }

  return isValid;
};

const isLoading = ref(false);
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const saveSettings = async () => {
  if (validateForm()) {
    isLoading.value = true;
    let result;
    try {
    const response = await Api.post(
      `/link/invoiceset?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        license_plate: basicInfoStore.selectedOption || "",
        tax_id: buyerId.value,
        invoice_title: buyerTitle.value,
        phone_carrier: carrier.value ? "/" + carrier.value : "",
        email: email.value
      }
    );
    showAlert.value = true;
    
    if (response.data.returnCode == 0) {
      result = { status: "success", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      hasData.value = true;
      buyerId.value = ''
      buyerTitle.value = ''
      carrier.value = ''
      email.value = ''
      getSettings();
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    result = { status: "danger", message: error.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
    console.error(error)
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
  }
};

const hasData = ref(false)
const getSettings =  async () => {
  isLoading.value = true;
    try {
    const response = await Api.post(
      `/link/invoiceset_select?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        license_plate: basicInfoStore.selectedOption || "",
      }
    );
    
    if (response.data.returnCode == 0) {
      hasData.value = true
      savedData.value = {
        buyerId: response.data.data.tax_id,
        title: response.data.data.invoice_title,
        carrier: response.data.data.phone_carrier,
        email: response.data.data.email
      }
      buyerId.value = response.data.data.tax_id
      buyerTitle.value = response.data.data.invoice_title
      carrier.value = response.data.data.phone_carrier.replace('/', '')
      email.value = response.data.data.email
    } else {
      hasData.value = false
    }
  } catch (error) {
    hasData.value = false
    console.error(error)
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
}
onMounted(getSettings)
const deleteSetting = async () => {
  isLoading.value = true;
    let result;
    try {
    const response = await Api.post(
      `/link/invoiceset_delete?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        license_plate: basicInfoStore.selectedOption || "",
      }
    );
    showAlert.value = true;
    
    if (response.data.returnCode == 0) {
      result = { status: "success", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      getSettings();
      hasData.value = false;
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      hasData.value = false
    }
  } catch (error) {
    result = { status: "danger", message: error.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
    console.error(error)
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
}
</script>

<template>
  <TheLayout>
    <template #content>
      <h2>發票設定</h2>
      <div class="invoice-setting p-3">
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
        <div class="form-group mb-3">
          <label>買方統編</label>
          <input type="text" class="form-control" v-model="buyerId" />
          <small v-if="errors.buyerId" class="text-danger">
            {{ errors.buyerId }}
          </small>
        </div>
        <div class="form-group mb-3">
          <label>買方抬頭</label>
          <input type="text" class="form-control" v-model="buyerTitle" />
          <small v-if="errors.buyerTitle" class="text-danger">
            {{ errors.buyerTitle }}
          </small>
        </div>
        <div class="form-group mb-3">
          <label>共同性載具 (手機載具)</label>
          <div class="input-group">
            <span class="input-group-text">/</span>
            <input type="text" class="form-control" v-model="carrier" />
          </div>
          <p class="text-warning">無設定則統一使用網優會員載具</p>
          <small v-if="errors.carrier" class="text-danger">
            {{ errors.carrier }}
          </small>
        </div>
        <div class="form-group mb-3">
          <label>Email</label>
          <input type="email" class="form-control" v-model="email" @keydown.enter="saveSettings"/>
          <small v-if="errors.email" class="text-danger">
            {{ errors.email }}
          </small>
        </div>
        <p class="text-warning">
          本設定僅限新開立發票，設定前已開立發票更改為開立統編發票，請與場站人員聯繫。
        </p>
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-warning fw-bold"
            @click="saveSettings"
          >
            設定
          </button>
        </div>
      </div>
      <div v-if="hasData" class="verification my-3 p-3">
        <p class="underline">已設定發票資訊</p>
        <p>{{ savedData.buyerId }}</p>
        <p>{{ savedData.title }}</p>
        <p>{{ savedData.carrier }}</p>
        <p>{{ savedData.email }}</p>
        <p>{{ savedData.settings }}</p>
        <div class="d-flex justify-content-end">
          <button class="btn btn-danger fw-bold" @click="deleteSetting">刪除</button>
        </div>
      </div>
    </template>
  </TheLayout>
</template>

<style lang="scss" scoped>
@import "../assets/scss/main.scss";
@import "../assets/scss/custom-bootstrap.scss";

.invoice-setting {
  border: 2px solid $warning;
}
.verification {
  border: 2px solid $danger;
}

.underline {
  text-decoration: underline;
  text-underline-offset: 6px;
}
</style>
