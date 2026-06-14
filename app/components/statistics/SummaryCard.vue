<script setup lang="ts">
import { defineProps } from "vue";
import { formatMoney } from "./utils";

const props = defineProps<{ income: number; expense: number; net: number }>();
</script>

<template>
  <section class="summary_card">
    <div class="summary_row">
      <div>
        <p class="label">Доходы</p>
        <p class="value">{{ formatMoney(props.income) }}</p>
      </div>

      <div>
        <p class="label">Расходы</p>
        <p class="value value-expense">{{ formatMoney(props.expense) }}</p>
      </div>

      <div>
        <p class="label">Чистый</p>
        <p class="value">{{ formatMoney(props.net) }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.summary_card {
  background: var(--color-surface);
  border-radius: 14px;
  padding: 1rem;
}
.summary_row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.label {
  color: var(--color-text-muted);
  font-weight: 700;
}
.value {
  font-weight: 900;
  font-size: 1.2rem;
}
.value-expense {
  color: var(--color-danger);
}
</style>
