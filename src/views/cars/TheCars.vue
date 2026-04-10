<script setup>
import Api from '../../api'
import TheLayout from '../../components/TheLayout.vue';
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const plates = ref([]);
const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const getPlates = onMounted(async () => {
  isLoading.value = true
  try {
    const response = await Api.post(`/link/selectLine?bQz0fX8f=${route.query.bQz0fX8f}`,{
      memberLineId: route.query.mid
    })
    showAlert.value = true;
    let result;
    if (response.data.returnCode == 0) {
      plates.value = response.data.data.map(item => ({
        station: item.park_name,
        plate: item.license_plate
      }));
      result = { status: "success", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    result = { status: "danger", message: response.data.message };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
  } finally {
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
    isLoading.value = false;
  }
});

import { useBasicInfoStore } from "../../stores/plate";
const basicInfoStore = useBasicInfoStore();
   
const goStatus = (detail) => {
  router.push({
    path: "/car_status",
    query: {
      mid: route.query.mid,
      bQz0fX8f: route.query.bQz0fX8f
    },
  });
  basicInfoStore.setBasicInfo({
    selectedOption: detail.station + ' - ' + detail.plate
  });
};
</script>
<template>
  <TheLayout>
    <template #content>
      <div class="d-flex justify-content-center h-100">
        <section class="align-content-center position-relative">
          <loading v-model:active="isLoading" :is-full-page="true" />
          <div
            v-if="showAlert"
            class="alert text-center position-absolute w-100 mx-auto"
            :class="alertType"
            role="alert"
          >
            {{ alertMessage }}
          </div>
          <div class="plates m-5 p-3 border d-flex flex-column">
            <h2 class="text-center">您的車號</h2>
    
            <div class="table-wrapper flex-grow-1 overflow-auto mb-3">
              <table class="table text-center mb-0">
                <thead>
                  <tr>
                    <th scope="col">場區</th>
                    <th scope="col">車號</th>
                    <th scope="col">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in plates" :key="index">
                    <td>{{ item.station }}</td>
                    <td>{{ item.plate }}</td>
                    <td class="text-secondary pointer" @click="goStatus(item)">
                      查看
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
    
            <router-link
              :to="{
                path: '/car_terms',
                query: {
                  mid: $route.query.mid,
                  c: $route.query.c,
                  bQz0fX8f: route.query.bQz0fX8f
                },
              }"
            >
              <button class="btn btn-secondary w-100">
                新增綁定車輛
              </button>
            </router-link>
          </div>
        </section>
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
  height: 40vh;
  border-radius: 10px;
}

.table thead tr {
  position: sticky;
  top: 0;
}

.alert {
  top: 20px;
  left: 0;
  z-index: 10;
}
</style>
