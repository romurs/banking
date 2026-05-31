<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed } from "vue";
import { useAccounts } from "~/composables/useAccounts";
import { useTransactions } from "~/composables/useTransactions";
import {
  getTransactionLabel,
  isIncomeType,
} from "~/../utils/transaction-types";

import SummaryCard from "~/components/statistics/SummaryCard.vue";
import CategoryList from "~/components/statistics/CategoryList.vue";
import TopAccounts from "~/components/statistics/TopAccounts.vue";

useHead({ title: "Статистика | Сбербанк Онлайн" });

const { accounts } = useAccounts();
const { transactions } = useTransactions();

const allTransactions = computed(() => transactions.value || []);

const incomeTx = computed(() =>
  allTransactions.value.filter(
    (t: any) => isIncomeType(t.type) && Number(t.amount) > 0,
  ),
);

const expenseTx = computed(() =>
  allTransactions.value.filter(
    (t: any) => !isIncomeType(t.type) && Number(t.amount) > 0,
  ),
);

const sumAmount = (arr: any[]) => arr.reduce((s, t) => s + Number(t.amount), 0);

const totalIncome = computed(() => sumAmount(incomeTx.value));
const totalExpense = computed(() => sumAmount(expenseTx.value));
const net = computed(() => totalIncome.value - totalExpense.value);

const aggregateByLabel = (arr: any[]) => {
  const map = new Map<string, number>();
  arr.forEach((t) => {
    const label = t.typeLabel || getTransactionLabel(t.type);
    map.set(label, (map.get(label) || 0) + Number(t.amount));
  });
  return Array.from(map.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
};

const incomeByCategory = computed(() => aggregateByLabel(incomeTx.value));
const expenseByCategory = computed(() => aggregateByLabel(expenseTx.value));

const accountsMap = computed(() => {
  const m = new Map<number, any>();
  (accounts.value || []).forEach((a: any) => m.set(a.id, a));
  return m;
});

const topAccounts = computed(() => {
  const map = new Map<number, { income: number; expense: number }>();

  allTransactions.value.forEach((t: any) => {
    const accId = Number(t.accountId);
    if (!map.has(accId)) map.set(accId, { income: 0, expense: 0 });
    const rec = map.get(accId)!;
    if (isIncomeType(t.type)) rec.income += Number(t.amount);
    else rec.expense += Number(t.amount);
  });

  return Array.from(map.entries())
    .map(([id, sums]) => ({
      id,
      label: accountsMap.value.get(id)
        ? `${accountsMap.value.get(id).accountNumber}`
        : `Счёт ${id}`,
      income: sums.income,
      expense: sums.expense,
      net: sums.income - sums.expense,
    }))
    .sort((a, b) => b.expense - a.expense);
});
</script>

<template>
  <div class="statistics_page">
    <h1>Статистика</h1>

    <SummaryCard :income="totalIncome" :expense="totalExpense" :net="net" />

    <section class="two_columns">
      <CategoryList title="Траты" :items="expenseByCategory" />
      <CategoryList title="Доходы" :items="incomeByCategory" />
    </section>

    <TopAccounts :accounts="topAccounts" />
  </div>
</template>

<style scoped lang="scss">
.statistics_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.two_columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.col {
  background: #fff;
  border-radius: 14px;
  padding: 1rem;

 
}

.cat_row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f1f1;
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

.trend_row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f1f1;
}
.trend_values {
  display: flex;
  gap: 1rem;
}
.trend_income {
  color: #0b8523;
  font-weight: 700;
}
.trend_expense {
  color: #d32f2f;
  font-weight: 700;
}

@media (max-width: 480px) {
  .two_columns {
    grid-template-columns: 1fr;
  }
}
</style>
