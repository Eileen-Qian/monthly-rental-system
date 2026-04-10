<script setup>
import { ref, onMounted } from "vue";
import TheLayout from "../components/TheLayout.vue";

const parkInfo = ref({});
const getParkInfo = async () => {
  parkInfo.value = {
    owner: "角落停停車股份有限公司",
    serviceNumber: "0900123456",
    tax_id: "93598290",
    parkAddress: "台北市長安東路100巷100號旁空地",
  }
}

const contractInfo = ref({});
const getContractInfo = async () => {
  contractInfo.value = {
    contractNumber: "T20250103001",
    userName: "李大嬸",
    phone: "09123456789",
    address: "台北市長安東路120號5樓之3",
    spaceCount: 1,
    carNumbers: [
      { type: "汽車", plate: "AXX-6895" },
      { type: "汽車", plate: "BBC-1234" },
    ],
    invoiceType: "個人發票",
    deposit: 1000,
    rentAmount: "依繳費單金額",
    contractPeriodStart: "2025-04-01",
    contractPeriodEnd: "2025-04-30",
  }
}

onMounted(() => {
  getParkInfo();
  getContractInfo();
});
</script>

<template>
  <TheLayout>
    <template #content>
      <p class="fw-bold fs-3 text-center py-3">電子化合約</p>
      <div class="container">
        <p class="text-center">建立中...</p>
        <!-- <div class="park-info">
          <div class="row border-bottom py-2 bg-contract_gray">
            <div class="col-4">停車業者</div>
            <div class="col-8">{{ parkInfo.owner }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_gray">
            <div class="col-4">客服電話</div>
            <div class="col-8">{{ parkInfo.serviceNumber }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_gray">
            <div class="col-4">統一編號</div>
            <div class="col-8">{{ parkInfo.tax_id }}</div>
          </div>
          <div class="row py-2 bg-contract_gray">
            <div class="col-4">場站地址</div>
            <div class="col-8">{{ parkInfo.parkAddress }}</div>
          </div>
        </div>
        <div class="contract-info">
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">合約編號</div>
            <div class="col-8">{{ contractInfo.contractNumber }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">租用人</div>
            <div class="col-8">{{ contractInfo.userName }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">聯絡電話</div>
            <div class="col-8">{{ contractInfo.phone }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">通訊地址</div>
            <div class="col-8">{{ contractInfo.address }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">車位數</div>
            <div class="col-8">{{ contractInfo.spaceCount }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">登記車號</div>
            <div class="col-8">
              <div v-for="i in contractInfo.carNumbers" :key="i.plate">
                {{ i.type }}
                &nbsp;
                {{ i.plate }}
              </div>
            </div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">發票開立</div>
            <div class="col-8">{{ contractInfo.invoiceType }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">押金</div>
            <div class="col-8">{{ contractInfo.deposit?.toLocaleString("en", { minimumFractionDigits: 0 }) }}</div>
          </div>
          <div class="row border-bottom py-2 bg-contract_yellow">
            <div class="col-4">租金</div>
            <div class="col-8">依繳費單金額</div>
          </div>
          <div class="row py-2 bg-contract_yellow">
            <div class="col-4">本期合約</div>
            <div class="col-8">
              {{ contractInfo.contractPeriodStart }}
              <br>
              {{ contractInfo.contractPeriodEnd }}
            </div>
          </div>
        </div> -->
      </div>
    </template>
  </TheLayout>
</template>


<style lang="scss" scoped>
@import "../assets/scss/custom-bootstrap.scss";

.park-info .row:first-child {
  border-top: 3px solid #aeabab;
}

.park-info .row:last-child {
  border-bottom: 3px solid #aeabab;
}


.park-info .row {
  border-left: 3px solid #aeabab;
  border-right: 3px solid #aeabab;
}

.contract-info .row:last-child {
  border-bottom: 3px solid #aeabab;
}


.contract-info .row {
  border-left: 3px solid #aeabab;
  border-right: 3px solid #aeabab;
}
</style>