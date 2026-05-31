<script setup lang="ts">
import HistoryItem from "~/components/main/history/HistoryItem.vue";
import type { AccountTransaction } from "./types";

defineProps<{
  transactions: AccountTransaction[];
}>();
</script>

<template>
  <section class="account_history">
    <h2>История</h2>

    <div v-if="transactions.length" class="history_list">
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

    <p v-else class="empty_text">Операций по этому счёту пока нет</p>
  </section>
</template>

<style scoped lang="scss">
.account_history {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  padding: 1.25rem 0 0.5rem;
}

h2 {
  color: #262626;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  padding: 0 1.5rem 0.5rem;
}

.history_list {
  display: flex;
  flex-direction: column;
}

.empty_text {
  color: rgba(38, 38, 38, 0.56);
  font-size: 0.95rem;
  padding: 0.75rem 1.5rem 1rem;
}

@media (max-width: 480px) {
  h2,
  .empty_text {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
