<script setup lang="ts">
import HistoryFilters from "~/components/allhistory/HistoryFilters.vue";
import HistoryFeed from "~/components/allhistory/HistoryFeed.vue";
import BackButton from "~/components/newAccount/backButton.vue";
import OperationHeader from "~/components/newAccount/operationHeader.vue";
import { formatOperationDate } from "~/composables/useOperationDate";
import { getTransactionLabel } from "~/../utils/transaction-types";
import { useAccounts } from "~/composables/useAccounts";

useHead({
  title: "История операций | Сбербанк Онлайн",
  meta: [{ name: "AllHistory", content: "История всех операций" }],
});

interface OperationTransaction {
  id: string | number;
  amount: number;
  type: string;
  date: string;
  counterparty: string;
  description?: string | null;
  accountId?: number;
}

const selectedType = ref("");
const selectedAccount = ref("");
const amountFrom = ref("");
const amountTo = ref("");

const { transactions, loading, error } = useTransactions();
const { accounts } = useAccounts();

const setSelectedType = (value: string) => {
  selectedType.value = value;
};

const setSelectedAccount = (value: string) => {
  selectedAccount.value = value;
};

const setAmountFrom = (value: string) => {
  amountFrom.value = value;
};

const setAmountTo = (value: string) => {
  amountTo.value = value;
};

const transactionList = computed<OperationTransaction[]>(() => {
  return transactions.value as OperationTransaction[];
});

const transactionTypes = computed(() => {
  const types = new Set(
    transactionList.value.map((transaction) => transaction.type),
  );
  return Array.from(types).map((t) => ({
    key: t,
    label: getTransactionLabel(t),
  }));
});

const filteredTransactions = computed(() => {
  return transactionList.value.filter((transaction) => {
    const matchesType =
      !selectedType.value || transaction.type === selectedType.value;
    const matchesAccount =
      !selectedAccount.value ||
      transaction.accountId?.toString() === selectedAccount.value;
    const matchesAmountRange = isWithinAmountRange(
      transaction.amount,
      amountFrom.value,
      amountTo.value,
    );

    return matchesType && matchesAccount && matchesAmountRange;
  });
});

const groupedTransactions = computed(() => {
  const groups = new Map<
    string,
    {
      label: string;
      total: number;
      transactions: OperationTransaction[];
    }
  >();

  filteredTransactions.value.forEach((transaction) => {
    if (!groups.has(transaction.date)) {
      groups.set(transaction.date, {
        label: formatOperationDate(transaction.date),
        total: 0,
        transactions: [],
      });
    }

    const group = groups.get(transaction.date);

    if (!group) {
      return;
    }

    group.transactions.push(transaction);
  });

  return Array.from(groups.entries()).map(([key, group]) => {
    const expenseTotal = group.transactions
      .filter((transaction) => !isIncome(transaction.type))
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const fallbackTotal = group.transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );

    return {
      key,
      ...group,
      total: expenseTotal || fallbackTotal,
    };
  });
});

function isIncome(type: string) {
  const t = String(type).toUpperCase();
  return t === "INCOME" || t === "TRANSFER_IN";
}

function isWithinAmountRange(
  amount: number,
  fromStr: string,
  toStr: string,
): boolean {
  const from = fromStr ? parseFloat(fromStr) : null;
  const to = toStr ? parseFloat(toStr) : null;

  if (from !== null && amount < from) return false;
  if (to !== null && amount > to) return false;

  return true;
}
</script>

<template>
  <div class="operations_page">
    <BackButton />
    <OperationHeader />

    <HistoryFilters
      :selected-type="selectedType"
      :selected-account="selectedAccount"
      :amount-from="amountFrom"
      :amount-to="amountTo"
      :transaction-types="transactionTypes"
      :accounts="accounts"
      @update:selected-type="setSelectedType"
      @update:selected-account="setSelectedAccount"
      @update:amount-from="setAmountFrom"
      @update:amount-to="setAmountTo"
    />

    <HistoryFeed
      :grouped-transactions="groupedTransactions"
      :loading="loading"
      :error="error"
    />
  </div>
</template>

<style scoped lang="scss">
.operations_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

@media (max-width: 480px) {
  .operations_page {
    gap: 0.75rem;
  }

  .operations_header {
    border-radius: 0;
    padding: 1.25rem 1rem;

    h1 {
      font-size: 1.65rem;
    }
  }
}
</style>
