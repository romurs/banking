<script setup lang="ts">
import HistoryItem from "~/components/main/history/HistoryItem.vue";
import { useFinanceStore } from "~/stores/finance";

interface OperationTransaction {
  id: string | number;
  amount: number;
  type: string;
  date: string;
  counterparty: string;
  description?: string | null;
}

const props = defineProps<{
  groupedTransactions: Array<{
    key: string;
    label: string;
    total: number;
    transactions: OperationTransaction[];
  }>;
  loading: boolean;
  error: string | null;
}>();

const financeStore = useFinanceStore();

const formatMoney = (amount: number) => {
  const numericAmount = Number(amount);
  const hasCents = !Number.isInteger(numericAmount);

  return `${numericAmount.toLocaleString("ru-RU", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })} ₽`;
};
</script>

<template>
  <section class="operations_feed">
    <div v-if="props.loading" class="state_panel">
      <p>Загрузка операций...</p>
    </div>

    <div v-else-if="props.error" class="state_panel error_state">
      <p>Ошибка: {{ props.error }}</p>
    </div>

    <div v-else-if="props.groupedTransactions.length === 0" class="state_panel">
      <p>Операции не найдены</p>
    </div>

    <template v-else>
      <section
        v-for="group in props.groupedTransactions"
        :key="group.key"
        class="date_group"
      >
        <div class="date_header">
          <p>{{ group.label }}</p>
          <span>
            {{financeStore.showFinance ? "*******" : formatMoney(group.total) }}
          </span>
        </div>

        <div class="date_operations">
          <HistoryItem
            v-for="transaction in group.transactions"
            :key="transaction.id"
            :ammount="transaction.amount.toString()"
            :type="transaction.type"
            :from="transaction.counterparty"
            :transaction="transaction.id.toString()"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped lang="scss">
.operations_feed {
  background: none;
  border-radius: 20px;
  // overflow: hidden;
  padding: 0.5rem 0;
}

.state_panel {
  align-items: center;
  color: rgba(38, 38, 38, 0.58);
  display: flex;
  font-size: 1rem;
  justify-content: center;
  min-height: 260px;
  padding: 1.5rem;
  text-align: center;
}

.error_state {
  color: #d32f2f;
  font-weight: 600;
}

.date_group {
  padding: 1rem 0;
  background: #fff;
  border-radius: 20px;
  margin-top: 0.8rem;
  margin-right: 5px;
  margin-left: 5px;
}

.date_header {
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem 0.65rem;
}

.date_header p {
  color: #000;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.date_header span {
  opacity: 0.45;
  font-size: 0.9rem;
  font-weight: 700;
}

.date_operations {
  display: flex;
  flex-direction: column;
}

@media (max-width: 480px) {
  .operations_feed {
    border-radius: 20px;
  }

  .date_header,
  .date_operations {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>