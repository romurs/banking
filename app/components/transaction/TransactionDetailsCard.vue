<script setup lang="ts">
import TransactionDetailRow from "./TransactionDetailRow.vue";
import type { TransactionDetail } from "./types";
import { useFinanceStore } from "~/stores/finance";
import { getTransactionLabel } from "~/../utils/transaction-types";

const props = defineProps<{
  transaction: TransactionDetail;
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

const details = computed(() => {
  const rows = [
    {
      label: "Баланс",
      value: financeStore.showFinance
        ? "*******"
        : formatMoney(props.transaction.account.balance),
    },
    {
      label: "Счёт списания",
      value: `Платёжный счёт •• ${props.transaction.account.accountNumberLastFour}`,
    },
    {
      label: "Способ списания",
      value: `МИР Lumos Card •• ${props.transaction.account.cardLastFour}`,
    },
    {
      label: "Дата и время",
      value: props.transaction.dateTime,
    },
    {
      label: "Тип операции",
      value:
        getTransactionLabel(props.transaction.rawType ?? props.transaction.type),
    },
  ];

  if (props.transaction.mccCode) {
    rows.splice(3, 0, {
      label: "MCC-код торговой точки",
      value: props.transaction.mccCode,
    });
  }

  if (
    props.transaction.description &&
    props.transaction.description !== props.transaction.type
  ) {
    rows.push({
      label: "Описание",
      value: props.transaction.description,
    });
  }

  return rows;
});
</script>

<template>
  <section class="details_card">
    <h2>Подробности</h2>

    <TransactionDetailRow
      v-for="row in details"
      :key="row.label"
      :label="row.label"
      :value="row.value"
    />
  </section>
</template>

<style scoped lang="scss">
.details_card {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
}

h2 {
  color: #262626;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.5rem;
}

@media (max-width: 480px) {
  .details_card {
    border-radius: 20px;
    padding: 1.25rem 1rem;
  }
}
</style>
