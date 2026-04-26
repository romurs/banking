<script setup lang="ts">
import EyeEmptyIcon from "~/components/main/wallet/eyeEmptyIcon.vue";
import EyeOffIcon from "~/components/main/wallet/eyeOffIcon.vue";
import KebabHorizontal from "~/components/main/wallet/kebabHorizontalIcon.vue";
import { useFinanceStore } from "~/stores/finance";

const financeStore = useFinanceStore();

const headBtnTitle = computed(() =>
  financeStore.showFinance ? "Показать финансы" : "Скрыть финансы",
);
</script>

<template>
  <div class="account-head">
    <h1>Кошелёк</h1>
    <div class="head-btns">
      <button
        class="head-btn"
        :title="headBtnTitle"
        :aria-label="headBtnTitle"
        @click="financeStore.toggleVisibility()"
      >
        <EyeEmptyIcon v-if="financeStore.showFinance" />
        <EyeOffIcon v-if="!financeStore.showFinance" />
      </button>
      <button
        class="head-btn"
        title="Настройки главного экрана"
        aria-label="Настройки главного экрана"
      >
        <KebabHorizontal />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-head {
  display: flex;
  justify-content: space-between;
  height: 48px;
  align-items: center;
}

.head-btns {
  display: flex;
  height: 100%;
}
.head-btn {
  margin-right: 1rem;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background-color: rgba(38, 38, 38, 0.08);
  border: none;
  padding: 0.8rem;
  align-items: center;
  cursor: pointer;
}
</style>
