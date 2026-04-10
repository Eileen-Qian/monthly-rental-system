<script setup>
import TheLayout from "../../components/TheLayout.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const terms = ref([]);
const isChecked = ref(false);

const getTerms = onMounted(() => {
  terms.value = [
    "本停車場僅供停車使用，不負保管責任。",
    "車輛於停放期間內發生天災(如颱風、地震、淹水等) 或失竊、偷盜、火災及不明碰撞造成車輛毀損，本公司無法負責任何理賠責任，敬請見諒！",
    "本場不另保留月租車位且不提共固定車位，月租車輛應與臨停車輛依序入場。",
    "月租客戶如須辦理退租，至少需於10日前告知，否則不予以受理。",
  ];
});

const goRegister = () => {
  if (isChecked.value) {
    router.push({
      path: "/car_register",
      query: {
        mid: route.query.mid,
        bQz0fX8f: route.query.bQz0fX8f
      },
    });
  }
};
</script>

<template>
  <TheLayout>
    <template #content>
      <div class="d-flex justify-content-center h-100">
        <section class="align-content-center">
          <h2 class="text-center text-secondary">停車場約定條款</h2>
          <div class="plates m-3 p-3 border">
            <ol>
              <li
                v-for="(item, index) in terms"
                :key="index"
                :class="{ 'text-danger': index === terms.length - 1 }"
              >
                {{ item }}
              </li>
            </ol>
          </div>
          <div class="form-check mb-3 d-flex justify-content-center">
            <label class="form-check-label d-flex align-items-center">
              <input
                class="form-check-input me-2"
                type="checkbox"
                v-model="isChecked"
              />
              我已閱讀並同意以上條款
            </label>
          </div>

          <button
            class="btn btn-secondary w-100 text-white"
            :disabled="!isChecked"
            @click="goRegister"
          >
            前往綁定
          </button>
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
  height: auto;
  border-radius: 10px;
}
</style>
