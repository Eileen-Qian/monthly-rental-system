<script setup>
import Api from "../../api";
import TheLayout from "../../components/TheLayout.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const plate = ref("");
const phone = ref("");
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);

const plateError = ref("");
const phoneError = ref("");

// 手機與市話驗證規則
const phonePattern = /^(0\d{1,2}(-?\d{3,4}){1,2})(#\d{1,5})?$/;
const mobilePattern = /^(09\d{2}(-?\d{3}){2})(#\d{1,5})?$/;

const goBack = () => {
  router.back();
};

const validateForm = () => {
  let isValid = true;

  // 車牌驗證
  if (
    !plate.value.includes("-") ||
    plate.value.split("-").length !== 2 ||
    /[^A-Za-z0-9\-]/.test(plate.value)
  ) {
    plateError.value = "格式錯誤：請輸入如 ABC-1234";
    isValid = false;
  } else {
    plateError.value = "";
  }

  // 手機驗證
  if (!phonePattern.test(phone.value) && !mobilePattern.test(phone.value)) {
    phoneError.value = "格式錯誤：請輸入正確的手機或市話號碼";
    isValid = false;
  } else {
    phoneError.value = "";
  }

  return isValid;
};

const isLoading = ref(false);
const bindPlate = async () => {
  if (!validateForm()) return;
  let result;
  isLoading.value = true;
  try {
    const response = await Api.post(
      `/link/linkLine?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        memberLineId: route.query.mid,
        license_plate: plate.value,
        phone: phone.value,
      }
    );
    showAlert.value = true;

    switch (response.data.returnCode) {
      case 0:
        result = { status: "success", message: response.data.message };
        plate.value = "";
        phone.value = "";
        break;
      case -1:
      case -2:
      case -3:
        result = { status: "warning", message: response.data.message };
        break;
      default:
        result = { status: "danger", message: response.data.message };
        break;
    }
  } catch (error) {
    result = { status: "danger", message: error.message };
    console.error(error);
  } finally {
    isLoading.value = false;
  }

  alertType.value = `alert-${result.status}`;
  alertMessage.value = result.message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 2000);
};
</script>

<template>
  <TheLayout>
    <template #content>
      <div class="d-flex justify-content-center h-100">
        <section
          class="align-content-center text-center mt-5"
          style="width: 100%; max-width: 400px"
        >
          <loading v-model:active="isLoading" :is-full-page="true" />
          <div
            v-if="showAlert"
            class="alert mt-4"
            :class="alertType"
            role="alert"
          >
            {{ alertMessage }}
          </div>
          <h2 class="mb-4 fw-bold">車牌綁定</h2>
          <input
            v-model="plate"
            class="form-control mb-1"
            placeholder="輸入車號，如 ABC-1234"
          />
          <div v-if="plateError" class="text-danger small mb-2">
            {{ plateError }}
          </div>
          <input
            v-model="phone"
            class="form-control mb-1"
            placeholder="輸入手機號碼或市話"
            @keydown.enter="bindPlate"
          />
          <div v-if="phoneError" class="text-danger small mb-3">
            {{ phoneError }}
          </div>
          <button class="btn btn-secondary w-100 mb-2" @click="bindPlate">
            車牌綁定
          </button>
          <p class="text-secondary pointer" @click="goBack">返回</p>
          <p class="mt-3 text-muted">若無反應，請點選右上以其他應用開啟</p>
        </section>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.h-100 {
  min-height: 100vh;
}
</style>
