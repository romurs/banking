// stores/finance.ts
import { defineStore } from 'pinia'; // Keep this if not using autoImports, or remove if autoImports works

export const useFinanceStore = defineStore('finance', {
  state: () => ({ showFinance: false }),
  actions: {
    toggleVisibility() {
      this.showFinance = !this.showFinance;
    },
  },
  persist: {
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined, // Safe for SSR/TS
  },
});