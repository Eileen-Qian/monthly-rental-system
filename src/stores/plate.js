import { defineStore } from "pinia";

export const useBasicInfoStore = defineStore("basicInfo", {
  state: () => ({
    name: "",
    selectedOption: "",
    options: [],
    selectedParkId: ""
  }),
  actions: {
    setBasicInfo({ name, selectedOption, options, selectedParkId }) {
      this.name = name;
      this.selectedOption = selectedOption;
      this.options = options;
      this.selectedParkId = selectedParkId
    },
  },
  persist: {
    enabled: true,
  },
});
