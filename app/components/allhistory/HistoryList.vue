<script setup lang="ts">
import HistoryItem from "./HistoryItem.vue";

interface Transaction {
  id: string | number;
  amount: number;
  type: "Оплата товаров и услуг" | "Перевод" | "Прочие поступления";
  date: string;
  counterparty: string;
}

defineProps<{
  transactions: Transaction[];
}>();
</script>

<template>
  <div class="history_list_allhistory">
    <HistoryItem
      v-for="transaction in transactions"
      :key="transaction.id"
      :ammount="transaction.amount.toString()"
      :type="transaction.type"
      :date="transaction.date"
      :from="transaction.counterparty"
      :transaction="transaction.id.toString()"
    />
  </div>
</template>

<style scoped lang="scss">
.history_list_allhistory {
  display: flex;
  flex-direction: column;
}
</style>
