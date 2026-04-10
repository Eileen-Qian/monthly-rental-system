<script setup>
import { ref, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import TheLayout from "../../components/TheLayout.vue";

import { useReceiptStore } from "../../stores/receipt";
const receiptStore = useReceiptStore();
import Api from "../../api";
const isLoading = ref(false)
const paymentInfo = ref({})
const invoiceData = ref({})
const paymentDetails = ref([])
const getInvoiceDetails = async () => {
    isLoading.value = true;
    try {
        const response = await Api.post(`/link/payment_record_details?bQz0fX8f=${route.query.bQz0fX8f}`, {
            id: receiptStore.id
        })
        const res = response.data.data;
        paymentInfo.value = {
            payment_date: res.info.payment_date,
            feeAmount: res.info.feeAmount,
            storeId: res.info.storeId, // 繳費方式
            account: res.info.account,
            invoiceNumber: res.info.invoiceNumber
        }

        if (res.invoice.length != 0) {
            invoiceData.value = {
                invoiceStatus: res.invoice[0].invoiceStatus,
                issueDate: res.invoice[0].invoiceDate,
                amount: res.invoice[0].Amount,
                randomCode: res.invoice[0].randomCode,
                invoiceMessage: res.invoice[0].invoiceMessage,
                tax_id: res.invoice[0].Bidentifier,
                carrierType: res.invoice[0].CarrierType,
                NPOBAN: res.invoice[0].NPOBAN,
                PrintMark: res.invoice[0].PrintMark
            }
        }

        paymentDetails.value = res.details.map((item) => ({
            feeMonth: item.feeMonth,
            amount: item.totalAmount,
            content: item.content
        }))
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false;
    }
}
onMounted(() => {
    getInvoiceDetails()
})

const alertMessage = ref("");
const alertType = ref("");
const showAlert = ref(false);
const downloadInvoice = async (paymentInfo, invoiceData) => {
  const date = invoiceData.issueDate.split('-')[0] + invoiceData.issueDate.split('-')[1]
  showAlert.value = true;
  isLoading.value = true;

  try {
    const response = await Api.post(
      `/link/downloadInvoice?bQz0fX8f=${route.query.bQz0fX8f}`,
      {
        date,
        invoiceNum: paymentInfo.invoiceNumber,
      },
      { responseType: 'blob' }
    );

    // 嘗試解析 blob 是否為錯誤訊息（JSON）
    const text = await response.data.text(); // 將 blob 轉為 text
    try {
      const json = JSON.parse(text); // 嘗試解析為 JSON
      if (json.returnCode === -1 || json.returnCode === -2) {
        alertType.value = 'alert-danger';
        alertMessage.value = json.returnMessage || '發票下載失敗';
        return;
      }
    } catch (e) {
      // 不是 JSON，就視為正常的 PDF
      const fileName = `${paymentInfo.invoiceNumber}.pdf`;
      downloadFile(new Blob([response.data]), fileName);
    }
  } catch (error) {
    console.error(error);
    alertType.value = 'alert-danger';
    alertMessage.value = error.message || '發票下載時發生錯誤';
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
  }
};


const downloadFile = (blob, fileName) => {
  // 動態建立 <a> 標籤
  const link = document.createElement('a')
  // 設置下載鏈接 blobURL
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  //添加到 DOM 並觸發點擊
  document.body.append(link)
  link.click()
  link.remove()
  // 釋放資源
  setTimeout(() => URL.revokeObjectURL(link.href), 7000)
}
</script>
<template>
    <TheLayout>
        <template #content>
            <loading v-model:active="isLoading" :is-full-page="true" />
            <div class="container">
                <div class="payment-info mb-3">
                    <p class="fs-3 text-center pt-3">繳費資訊</p>
                    <div class="row border-bottom py-2">
                        <div class="col-6">繳費日期</div>
                        <div class="col-6">{{ paymentInfo.payment_date }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">繳費金額</div>
                        <div class="col-6">
                            {{ paymentInfo.feeAmount?.toLocaleString("en", { minimumFractionDigits: 0 }) }}
                        </div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">繳費方式</div>
                        <div class="col-6">{{ paymentInfo.storeId }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">
                            {{ paymentInfo.account?.length === 15 ? '會員帳號' : paymentInfo.account?.length === 16 ? '繳費帳號' : '' }}
                        </div>
                        <div class="col-6">{{ paymentInfo.account }}</div>
                    </div>
                </div>
                <div v-if="paymentInfo.invoiceNumber != 0 || paymentInfo.invoiceNumber != 1" class="invoice-details mb-3">
                    <p class="fs-3 text-center">發票資訊</p>
                    <div class="row border-bottom py-2">
                        <div class="col-6">發票狀態</div>
                        <div class="col-6">{{ invoiceData.invoiceStatus }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">發票日期</div>
                        <div class="col-6">{{ invoiceData.issueDate }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">發票號碼</div>
                        <div class="col-6">{{ paymentInfo.invoiceNumber }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">隨機碼</div>
                        <div class="col-6">{{ invoiceData.randomCode }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">買方統編</div>
                        <div class="col-6">{{ invoiceData.tax_id }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">發票金額</div>
                        <div class="col-6">
                            {{ invoiceData.amount?.toLocaleString("en", { minimumFractionDigits: 0 }) }}
                        </div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">發票備註</div>
                        <div class="col-6">{{ invoiceData.invoiceMessage }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">載具資訊</div>
                        <div class="col-6">
                            {{ invoiceData.carrierType }}
                        </div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">捐贈編號</div>
                        <div class="col-6">{{ invoiceData.NPOBAN }}</div>
                    </div>
                    <div class="row border-bottom py-2">
                        <div class="col-6">是否列印</div>
                        <div class="col-6">{{ invoiceData.PrintMark }}</div>
                    </div>
                </div>
                <p class="fs-3 text-center">繳款明細</p>
                <table class="table text-nowrap">
                    <thead>
                        <tr>
                            <th class="text-center">銷帳期別</th>
                            <th class="text-center">繳費金額</th>
                            <th class="text-center">內容</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="detail in paymentDetails" :key="detail.item">
                            <td class="text-center">{{ detail.feeMonth }}</td>
                            <td class="text-end">{{ detail.amount.toLocaleString("en", { minimumFractionDigits: 0 }) }}
                            </td>
                            <td class="text-center">{{ detail.content }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <section class="my-3 position-relative">
               <div
                 v-if="showAlert"
                 class="alert text-center position-absolute w-100 mx-auto"
                 :class="alertType"
                 role="alert"
               >
                {{ alertMessage }}
               </div>
            </section>

            <button v-if="invoiceData.tax_id" class="btn btn-green d-flex justify-content-between w-100 mb-3"
                @click="downloadInvoice(paymentInfo, invoiceData)">
                <span>下載開立統編發票</span>
                <img src="/src/assets/icons/download.svg" width="24" height="24" alt="download">
            </button>
        </template>
    </TheLayout>
</template>

<style scoped></style>