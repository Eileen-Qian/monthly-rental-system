import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../components/HelloWorld.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/bill-list",
      name: "Bill_list",
      component: () => import("../views/Bill/BillList.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/bill",
      name: "Bill",
      component: () => import("../views/Bill/TheBill.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/invoice-setting",
      name: "InvoiceSetting",
      component: () => import("../views/InvoiceSetting.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/receipts",
      name: "Receipts",
      component: () => import("../views/Receipts/TheReceipts.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/receipts/monthly",
      name: "MonthlyReceipts",
      component: () => import("../views/Receipts/MonthlyReceipts.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/receipts/monthly/details",
      name: "MonthlyDetails",
      component: () => import("../views/Receipts/MonthlyDetails.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/receipts/temp",
      name: "TempReceipts",
      component: () => import("../views/Receipts/TempReceipts.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/basic-info",
      name: "BasicInfo",
      component: () => import("../views/BasicInfo.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/contract",
      name: "Contract",
      component: () => import("../views/TheContract.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/points",
      name: "Points",
      component: () => import("../views/ThePoints.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/car-view",
      name: "Cars",
      component: () => import("../views/cars/TheCars.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/car_status",
      name: "Car_status",
      component: () => import("../views/cars/TheStatus.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
        pid: "",
        car: "",
      },
    },
    {
      path: "/car_terms",
      name: "Car_terms",
      component: () => import("../views/cars/TheTerms.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },
    {
      path: "/car_register",
      name: "Car_register",
      component: () => import("../views/cars/CarRegister.vue"),
      query: {
        mid: "",
        bQz0fX8f: "",
      },
    },

    /* ── 月租抽籤 ── */
    {
      path: "/place/lottery",
      name: "LotteryHome",
      component: () => import("../views/lottery/LotteryHome.vue"),
      meta: { title: "月租停車抽籤登記" },
    },
    {
      path: "/place/lottery/register",
      name: "LotteryRegister",
      component: () => import("../views/lottery/LotteryRegister.vue"),
      meta: { title: "月租停車抽籤登記" },
    },
    {
      path: "/place/lottery/query",
      name: "LotteryQuery",
      component: () => import("../views/lottery/LotteryQuery.vue"),
      meta: { title: "月租停車抽籤登記" },
    },

    /* ── 中獎發票下載 ── */
    {
      path: "/invoice-download",
      name: "InvoiceDownload",
      component: () => import("../views/invoice/InvoiceDownload.vue"),
      meta: { title: "中獎發票下載" },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title;
  } else {
    document.title = '月租整合系統';
  }
});

export default router;
