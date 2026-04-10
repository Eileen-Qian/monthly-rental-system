<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
import TheLayout from "../../components/TheLayout.vue";
import sevenEleven from "/src/assets/icons/bill/7-eleven_logo.svg.png";
import familyMart from "/src/assets/icons/bill/familymart-vector-logo.svg";
import hiLife from "/src/assets/icons/bill/Hi-Life.svg";
import okMart from "/src/assets/icons/bill/OK_Taiwan.svg-3.png";
import Api from "../../api";
import { useBasicInfoStore } from "../../stores/plate";
const basicInfoStore = useBasicInfoStore();
import { useBillStore } from "../../stores/bill";
const billStore = useBillStore();

const bill = ref({
  dueDate: billStore.dueDate,
  station: billStore.station,
  plate: basicInfoStore.selectedOption,
  amount: billStore.amount,
});

const selectedPaymentMethod = ref("");
const selectedStore = ref("seven");

const stores = [
  { name: "seven", image: sevenEleven },
  { name: "FamilyMart", image: familyMart },
  { name: "HiLife", image: hiLife },
  { name: "OKMart", image: okMart },
];

import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";

const paymentChannels = ref({});
const convertPaymentChannels = (apiResponse) => {
  const { data, barcode, counter_code = {} } = apiResponse;

  // 條碼轉 base64 圖
  const generateBarcodeImage = (codes) => {
    const canvas = createCanvas(300, 260);
    const ctx = canvas.getContext("2d");

    codes.forEach((code, index) => {
      const tempCanvas = createCanvas(300, 40);
      JsBarcode(tempCanvas, code, {
        format: "CODE39",
        displayValue: false,
        height: 40,
        width: 1, // 原本預設是 2，改小會讓條碼更密集
        margin: 0, // 可選：讓條碼邊距變小，更貼近上下邊緣
      });
    
    const barcodeWidth = tempCanvas.width;
    const x = (canvas.width - barcodeWidth) / 2;
    const y = index * 100;
    ctx.drawImage(tempCanvas, x, y);
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(code, 150, index * 100 + 56);
    });

    return canvas.toDataURL("image/png").split(",")[1];
  };

  // 根據 Style 選擇處理方式
  const getImage = (storeKey, styleKey) => {
    const style = barcode[styleKey];
    const codes = barcode[storeKey];

    if (style === "1") {
      // 用條碼文字陣列產圖 → 產出的圖包在陣列中
      return [generateBarcodeImage(codes)];
    } else if (style === "2") {
      // API 已提供 base64 圖 → 直接使用（通常就是陣列）
      return codes;
    }
    return [];
  };

  return {
    convenienceStore: {
      seven: getImage("seven", "seven_Style"),
      FamilyMart: getImage("family", "family_Style"),
      HiLife: getImage("hilife", "hilife_Style"),
      OKMart: getImage("OK", "OK_Style"),
    },
    bankTransfer: {
      bank: data.bank,
      bankCode: data.bank_code,
      account: data.account,
      amount: data.amount,
    },
    bankPayment: Array.isArray(counter_code.counter)
      ? generateBarcodeImage(counter_code.counter.filter(code => code !== null && code !== ""))
      : null,
  };
};

const paymentMethods = computed(() => {
  const due = new Date(billStore.dueDate)
  due.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 若過期，只顯示 bankTransfer
  if (today > due) {
    return [
      { label: "銀行轉帳", value: "bankTransfer" },
    ]
  }

  // 未過期，根據 paymentChannels 顯示所有可用方式
  const availableMethods = [
    { label: "超商條碼", value: "convenienceStore" },
    { label: "銀行轉帳", value: "bankTransfer" },
    { label: "信用卡", value: "creditCard" },
    { label: "銀行櫃台", value: "bankPayment" },
  ]

  return availableMethods.filter(method => paymentChannels.value[method.value])
})

watchEffect(() => {
  if (paymentMethods.value.length > 0) {
    selectedPaymentMethod.value = paymentMethods.value[0].value
  }
})

const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const isLoading = ref(false);
const getPaymentChannels = async () => {
  isLoading.value = true
  let result;
  try {
    const response = await Api.post(`/link/store_barcode?bQz0fX8f=${route.query.bQz0fX8f}`, {
      id: billStore.id
    });
    showAlert.value = true;
    if (response.data.returnCode == 0) {
      paymentChannels.value = convertPaymentChannels(response.data);
      
    } else {
      result = { status: "danger", message: response.data.message };
      alertType.value = `alert-${result.status}`;
      alertMessage.value = result.message;
    }
  } catch (error) {
    console.error(error);
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

const paymentDetails = ref([]);
const getPaymentDetails = async () => {
  isLoading.value = true
  try {
    const response = await Api.post(
      `/link/billDetails?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        startMonth: billStore.startMonth,
        billId: billStore.billId,
        period: billStore.period,
      }
    );
    paymentDetails.value = response.data.data.map((item) => ({
      item: item.content,
      amount: item.feeAmount,
    }));
    paymentDetails.value.push({
      item: "折扣",
      amount: response.data.disAmount,
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false
  }
};
onMounted(() => {
  getPaymentChannels();
  getPaymentDetails();
});

const copyAccount = async () => {
  try {
    await navigator.clipboard.writeText(paymentChannels.value.bankTransfer.account);
  } catch (err) {
    console.error('Copy failed:', err);
    const textArea = document.createElement('textarea');
    textArea.value = paymentChannels.value.bankTransfer.account;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  } finally {
    let result;
    showAlert.value = true;
    result = { status: "success", message: '複製成功' };
    alertType.value = `alert-${result.status}`;
    alertMessage.value = result.message;
    setTimeout(() => {
      showAlert.value = false;
    }, 1000);
  }
};
</script>

<template>
  <TheLayout>
    <template #content>
      <div class="p-4">
        <div class="upper-block bg-white p-4 mb-4">
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
          <div class="mb-4">
            <p class="fs-4">
              <span>繳費期限&nbsp;</span>
              <span class="text-danger">{{ bill.dueDate }}</span>
            </p>
            <p class="fs-4">{{ bill.station }}&nbsp;{{ bill.plate }}</p>
            <p class="fs-1 fw-bold mb-0">
              $
              {{
                bill.amount.toLocaleString("en", { minimumFractionDigits: 0 })
              }}
            </p>
          </div>

          <div class="d-flex justify-content-center gap-3 mb-4">
            <span
              v-for="method in paymentMethods"
              :key="method.value"
              class="payment-method"
              :class="{ selected: selectedPaymentMethod === method.value }"
              @click="selectedPaymentMethod = method.value"
            >
              {{ method.label }}
            </span>
          </div>

          <div class="inner-frame">
            <div v-if="selectedPaymentMethod === 'convenienceStore'">
              <div class="store-icons d-flex justify-content-center gap-4 mb-4">
                <img
                  v-for="store in stores"
                  :key="store.name"
                  :src="store.image"
                  alt="store.name"
                  class="store-icon"
                  :style="{ opacity: selectedStore === store.name ? 1 : 0.5 }"
                  @click="selectedStore = store.name"
                />
              </div>
              <div class="barcode-container text-center">
                <div v-if="paymentChannels.convenienceStore?.[selectedStore]">
                  <div class="barcode-segments">
                    <img
                      :src="`data:image/png;base64,${paymentChannels.convenienceStore[selectedStore][0]}`"
                      alt="條碼圖片"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="selectedPaymentMethod === 'bankTransfer'">
              <p class="mb-0">轉帳銀行</p>
              <p class="fs-2 mb-2">{{ paymentChannels.bankTransfer?.bank }}</p>
              <p class="mb-0">銀行代號</p>
              <p class="fs-2 mb-2">
                {{ paymentChannels.bankTransfer?.bankCode }}
              </p>
              <div class="d-flex align-items-center gap-2">
                <p class="mb-0">繳費帳號</p>
                <img src="/src/assets/icons/copy-link-icon.svg" height="24" alt="copy" class="pointer" @click="copyAccount">
              </div>
              <p class="fs-2 mb-2">
                {{ paymentChannels.bankTransfer?.account }}
              </p>
              <p class="mb-0">繳費金額</p>
              <p class="fs-2 mb-2">
                {{
                  paymentChannels.bankTransfer?.amount.toLocaleString("en", {
                    minimumFractionDigits: 0,
                  })
                }}
              </p>
            </div>
            <div
              v-else-if="selectedPaymentMethod === 'creditCard'"
              class="d-flex justify-content-center align-items-center h-100"
            >
              <a href="http://" target="_blank" rel="noopener noreferrer">
                點選後轉信用卡公司繳費頁面
              </a>
            </div>
            <div v-else-if="selectedPaymentMethod === 'bankPayment'">
              <div class="barcode-container text-center">
                <div class="barcode-segments">
                  <img
                    :src="`data:image/png;base64,${paymentChannels.bankPayment}`"
                    alt="條碼圖片"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lower-block bg-white p-4">
          <h2>繳款明細</h2>
          <table class="table">
            <thead>
              <tr>
                <th class="bg-primary text-white">項目</th>
                <th class="bg-primary text-white">金額</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in paymentDetails" :key="detail.item">
                <td>{{ detail.item }}</td>
                <td class="text-primary text-end">
                  {{
                    detail.amount.toLocaleString("en", {
                      minimumFractionDigits: 0,
                    })
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </TheLayout>
</template>

<style lang="scss" scoped>
@import "../../assets/scss/main.scss";
@import "../../assets/scss/custom-bootstrap.scss";
.upper-block {
  height: fit-content;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.inner-frame {
  height: 450px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
}
.lower-block {
  height: 200px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.payment-method {
  cursor: pointer;
  color: $gray-400;
}
.payment-method.selected {
  color: $primary;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.store-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.barcode-segments img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto; /* 讓圖片置中 */
}
.barcode-segments {
  width: 100%;
  overflow-x: auto; /* 若有多段條碼，允許水平滾動 */
}
</style>
