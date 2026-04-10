import { defineStore } from "pinia";

export const useReceiptStore = defineStore("receipt", {
  state: () => ({
    id: "",
  }),
  actions: {
    setReceipt({ id }) {
      this.id = id;
    },
  },
  persist: {
    enabled: true,
  },
});
