<script setup lang="ts">
import { formatMoney, formatSignedMoney } from "./utils";

const props = defineProps<{
  accounts: {
    id: number;
    label: string;
    income: number;
    expense: number;
    net: number;
  }[];
}>();
</script>

<template>
  <div class="col">
    <h2>Счета с наибольшими тратами</h2>
    <div v-if="props.accounts.length">
      <div
        v-for="acc in props.accounts.slice(0, 5)"
        :key="acc.id"
        class="acc_row"
      >
        <div class="acc_label">{{ acc.label }}</div>
        <div class="acc_amount">{{ formatMoney(acc.expense) }}</div>
        <div class="acc_net">{{ formatSignedMoney(acc.net) }}</div>
      </div>
    </div>
    <p v-else>Нет данных по счетам</p>
  </div>
</template>

<style scoped lang="scss">
.col {
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
}
.acc_row {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f1f1;
}
.acc_label {
  flex: 1;
}
.acc_amount {
  font-weight: 700;
}
.acc_net {
  color: rgba(38, 38, 38, 0.6);
}
</style>
