<script setup>
import TheLayout from "../../components/TheLayout.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const goMonthly = () => {
  router.push({
    path: "receipts/monthly",
    query: {
      mid: route.query.mid,
      bQz0fX8f: route.query.bQz0fX8f
    },
  });
};
const goTemporay = () => {
  router.push({
    path: "receipts/temp",
    query: {
      mid: route.query.mid,
      bQz0fX8f: route.query.bQz0fX8f
    },
  });
};
</script>
<template>
  <TheLayout>
    <template #content>
      <p class="fs-2 py-3">繳費收據</p>
      <div class="d-flex flex-column gap-5">
        <div
          class="box rounded-2 p-3 d-flex justify-content-between align-items-center pointer"
          @click="goMonthly"
        >
          <p class="text-white fs-4 mb-0">月租發票開立查詢</p>
          <img src="../../assets/icons/search.png" alt="search" />
        </div>
        <div
          class="box rounded-2 p-3 d-flex justify-content-between align-items-center pointer"
          @click="goTemporay"
        >
          <p class="text-white fs-4 mb-0">臨停及其他收據及發票查詢</p>
          <img src="../../assets/icons/search.png" alt="search" />
        </div>
      </div>
    </template>
  </TheLayout>
</template>
<style lang="scss" scoped>
@import "../../assets/scss/main.scss";
@import "../../assets/scss/custom-bootstrap.scss";
.box {
  width: 100%;
  height: 48px;
  background: $gray-600;
}
</style>
