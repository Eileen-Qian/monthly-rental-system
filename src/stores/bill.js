import { defineStore } from "pinia";

export const useBillStore = defineStore("bill", {
  state: () => ({
    id: "",
    billId: "",
    period: "",
    startMonth: "",
    dueDate: "",
    amount: null,
    station: ""
  }),
  actions: {
    setBill({ id, billId, period, startMonth, dueDate, amount, station }) {
      this.id = id;
      this.billId = billId;
      this.period = period;
      this.startMonth = startMonth;
      this.dueDate = dueDate;
      this.amount = amount;
      this.station = station;
    },
  },
  persist: {
    enabled: true,
  },
});
