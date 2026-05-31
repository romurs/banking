<script setup lang="ts">
import type { AccountTransaction } from "./types";
import { parseOperationDate } from "~/composables/useOperationDate";
import {
  getTransactionLabel,
  isIncomeType,
} from "~/../utils/transaction-types";
import { useFinanceStore } from "~/stores/finance";

const props = defineProps<{
  transactions: AccountTransaction[];
  kind: "expense" | "income";
  title: string;
  emptyText: string;
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

const isWithinLast30Days = (date: string) => {
  const operationDate = parseOperationDate(date);

  if (!operationDate) {
    return false;
  }

  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - operationDate.getTime()) / 86_400_000,
  );

  return diffDays >= 0 && diffDays < 30;
};

const filteredTransactions = computed(() => {
  return props.transactions.filter((transaction) => {
    const isIncome = isIncomeType(transaction.type);

    return (
      isWithinLast30Days(transaction.date) &&
      Number(transaction.amount) > 0 &&
      (props.kind === "income" ? isIncome : !isIncome)
    );
  });
});

const totalAmount = computed(() => {
  return filteredTransactions.value.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0,
  );
});

const categories = computed(() => {
  const map = new Map<string, number>();

  filteredTransactions.value.forEach((transaction) => {
    const label = transaction.typeLabel || getTransactionLabel(transaction.type);
    map.set(label, (map.get(label) || 0) + Number(transaction.amount));
  });

  return Array.from(map.entries())
    .map(([label, amount]) => ({
      label,
      amount,
      percent: totalAmount.value ? (amount / totalAmount.value) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});
</script>

<template>
  <section class="turnover_card" :class="`turnover_card-${props.kind}`">
    <div class="turnover_head">
      <p>{{ props.title }}</p>
      <span>
        {{ financeStore.showFinance ? "*******" : formatMoney(totalAmount) }}
      </span>
    </div>

    <div v-if="categories.length" class="category_list">
      <div
        v-for="category in categories"
        :key="category.label"
        class="category_item"
      >
        <div class="category_text">
          <p>{{ category.label }}</p>
          <span>
            {{
              financeStore.showFinance ? "*******" : formatMoney(category.amount)
            }}
          </span>
        </div>
        <div class="category_track">
          <div
            class="category_bar"
            :style="{ width: `${category.percent}%` }"
          ></div>
        </div>
      </div>
    </div>

    <p v-else class="empty_text">{{ props.emptyText }}</p>
  </section>
</template>

<style scoped lang="scss">
.turnover_card {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
}

.turnover_head {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  p {
    color: #262626;
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1.25;
  }

  span {
    color: #262626;
    flex-shrink: 0;
    font-size: 1.05rem;
    font-weight: 700;
  }
}

.category_list {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.category_text {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  p {
    color: #262626;
    font-size: 0.95rem;
    font-weight: 700;
  }

  span {
    color: rgba(38, 38, 38, 0.56);
    flex-shrink: 0;
    font-size: 0.9rem;
    font-weight: 700;
  }
}

.category_track {
  background: #f1f1f1;
  border-radius: 999px;
  height: 8px;
  margin-top: 0.45rem;
  overflow: hidden;
}

.category_bar {
  background: #0b8523;
  border-radius: inherit;
  height: 100%;
  min-width: 8px;
}

.turnover_card-income {
  .category_bar {
    background: #21a038;
  }

  .turnover_head span {
    color: #0b8523;
  }
}

.empty_text {
  color: rgba(38, 38, 38, 0.56);
  font-size: 0.95rem;
  margin-top: 1rem;
}

@media (max-width: 480px) {
  .turnover_card {
    padding: 1.25rem 1rem;
  }
}
</style>
