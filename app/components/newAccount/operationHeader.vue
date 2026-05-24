<script setup lang="ts">
import { useFinanceStore } from "~/stores/finance";
import EyeEmptyIcon from "../main/wallet/eyeEmptyIcon.vue";
import EyeOffIcon from "../main/wallet/eyeOffIcon.vue";
import KebabHorizontalIcon from "../main/wallet/kebabHorizontalIcon.vue";

const financeStore = useFinanceStore();
</script>

<template>
  <header class="operations_header">
    <div>
      <h1>История</h1>
    </div>

    <div class="header_actions">
      <button
        class="icon_button"
        type="button"
        :aria-label="
          financeStore.showFinance ? 'Показать суммы' : 'Скрыть суммы'
        "
        @click="financeStore.toggleVisibility"
      >
        <EyeEmptyIcon v-if="financeStore.showFinance" />
        <EyeOffIcon v-else />
      </button>

      <button class="icon_button" type="button" aria-label="Опции">
        <KebabHorizontalIcon />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.operations_header {
  align-items: flex-start;
  background: linear-gradient(135deg, #d6e0ff, #f6e4f1);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;

  h1 {
    color: #262626;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }

  p {
    color: rgba(38, 38, 38, 0.58);
    font-size: 0.95rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
}

.header_actions {
  display: flex;
  gap: 0.5rem;
}

.icon_button {
  align-items: center;
  background: rgba(255, 255, 255, 0.52);
  border: none;
  border-radius: 12px;
  color: #262626;
  cursor: pointer;
  display: flex;
  height: 44px;
  justify-content: center;
  padding: 0;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
  width: 44px;

  svg {
    fill: currentColor;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.72);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 480px) {
  .operations_header {
    border-radius: 0;
    padding: 1.25rem 1rem;

    h1 {
      font-size: 1.65rem;
    }
  }
}
</style>
