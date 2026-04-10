<script setup>
import Api from "../../api";
import TheLayout from "../../components/TheLayout.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
import { useBasicInfoStore } from "../../stores/plate";
const basicInfoStore = useBasicInfoStore();

const details = ref({});
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const isLoading = ref(false);
const statusMap = {
  0: "未審核",
  Y: "正常",
  N: "停用",
  C: "退租待審核",
  D: "退租",
};
const getDetails = async () => {
  let result;
  try {
    const response = await Api.post(
      `/link/selectparksum?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        license_plate: basicInfoStore.selectedOption.split(" - ")[1] || "",
      }
    );
    showAlert.value = true;
    if (response.data.returnCode == 0) {
      details.value = {
        park_name: response.data.park_name,
        plate: response.data.license_plate,
        status: response.data.contract_status,
        car_sum: response.data.car_sum,
      };
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    result = { status: "danger", message: error.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
};
onMounted(getDetails);

const cancelDate = ref("");
const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0]; // yyyy-mm-dd 格式
});

const showCancelModal = () => {
  const modalEl = document.getElementById("cancelModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

const showCancelAlertModal = () => {
  const modalEl = document.getElementById("cancelAlertModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

const handleCancelClick = () => {
  if (details.value.car_sum > 1) {
    showCancelAlertModal();
  } else {
    showCancelModal();
  }
};

const confirmCancel = async () => {
  let result;
  isLoading.value = true
  try {
    const response = await Api.post(`/link/rentout?bQz0fX8f=${route.query.bQz0fX8f}`, {
      license_plate: details.value.plate,
      rentout_date: cancelDate.value
    })
    showAlert.value = true;
    if (response.data.returnCode == 0) {
      result = { status: "success", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
      getDetails()
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    console.error(error)
    result = { status: "danger", message: error.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
  } finally {
    hideCancelModal()
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    setTimeout(() => {
      isLoading.value = false;
    }, 2000)
  }
};
const hideCancelModal = () => {
  const modalEl = document.getElementById("cancelModal");
  bootstrap.Modal.getInstance(modalEl).hide();
}

const goBack = () => {
  router.back();
};
</script>

<template>
  <TheLayout>
    <template #content>
      <div class="d-flex justify-content-center h-100">
        <loading v-model:active="isLoading" :is-full-page="true" />
        <section class="align-content-center position-relative">
          <div
            v-if="showAlert"
            class="alert text-center position-absolute w-100 mx-auto"
            :class="alertType"
            role="alert"
          >
            {{ alertMessage }}
          </div>
          <div
            class="plates m-5 p-3 border d-flex flex-column align-items-center"
          >
            <table class="table table-bordered text-center mb-3">
              <thead class="table-info">
                <tr>
                  <th class="w-50">場區</th>
                  <th class="w-50">車號</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ details.park_name }}</td>
                  <td>{{ details.plate }}</td>
                </tr>
                <tr class="table-info">
                  <td colspan="2">狀態</td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    :class="
                      details.status === 'Y' ? 'text-success' : 'text-danger'
                    "
                  >
                    {{ statusMap[details.status] }}
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    class="text-secondary pointer"
                    @click="handleCancelClick"
                  >
                    申請退租
                  </td>
                </tr>
              </tbody>
            </table>

            <button class="btn btn-secondary w-100" @click="goBack">
              返回
            </button>
          </div>
        </section>
        <!-- 申請退租 Modal -->
        <div
          class="modal fade"
          id="cancelModal"
          tabindex="-1"
          aria-labelledby="cancelModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-secondary">
                <h5 class="modal-title text-white" id="cancelModalLabel">
                  申請退租
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body text-center">
                <label>請選擇退租日期</label>
                <input
                  type="date"
                  class="form-control w-75 mx-auto"
                  v-model="cancelDate"
                  :min="minDate"
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="confirmCancel"
                  :disabled="!cancelDate || isLoading"
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 取消警告 Modal -->
        <div
          class="modal fade"
          id="cancelAlertModal"
          tabindex="-1"
          aria-labelledby="cancelAlertModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-secondary">
                <h5 class="modal-title text-white" id="cancelAlertModalLabel">
                  退租提示
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body text-center">
                <p>您有多個車牌，退租會將全部車輛進行退租，請確認。</p>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  @click="showCancelModal"
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.h-100 {
  min-height: 100vh;
}

.plates {
  width: 80vw;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
}

.alert {
  top: 20px;
  left: 0;
  z-index: 10;
}
</style>
