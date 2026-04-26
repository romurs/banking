<script setup lang="ts">
import HistoryItem from "./HistoryItem.vue";

// Используем composable для получения транзакций
const { transactions, loading, error } = useTransactions();
</script>

<template>
  <div v-if="loading" class="history_list">
    <p>Загрузка истории...</p>
  </div>
  <div v-else-if="error" class="history_list">
    <p class="error">Ошибка: {{ error }}</p>
  </div>
  <div v-else class="history_list">
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
.history_list {
  display: flex;
  flex-direction: column;
}

.error {
  color: #d32f2f;
  font-weight: 500;
  padding: 1rem;
}
</style>
