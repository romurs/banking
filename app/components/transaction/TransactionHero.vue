<script setup lang="ts">
import type { TransactionDetail } from "./types";
import { useFinanceStore } from "~/stores/finance";

const props = defineProps<{
  transaction: TransactionDetail;
}>();

const financeStore = useFinanceStore();

const isIncome = computed(() => {
  return (
    props.transaction.rawType === "income" ||
    props.transaction.type.toLowerCase().includes("поступ")
  );
});

const amountPrefix = computed(() => (isIncome.value ? "+" : ""));

const formatMoney = (amount: number) => {
  const numericAmount = Number(amount);
  const hasCents = !Number.isInteger(numericAmount);

  return `${numericAmount.toLocaleString("ru-RU", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })} ₽`;
};

const formattedAmount = computed(() => {
  if (financeStore.showFinance) {
    return "*******";
  }

  return `${amountPrefix.value}${formatMoney(props.transaction.amount)}`;
});

const saveCertificate = () => {
  window.print();
};
</script>

<template>
  <section class="transaction_hero">
    <div class="amount_group">
      <p class="transaction_amount" :class="{ income: isIncome }">
        {{ formattedAmount }}
      </p>
    </div>

    <p class="counterparty">{{ props.transaction.counterparty }}</p>

    <button class="save_button" type="button" @click="saveCertificate">
      Сохранить справку
    </button>
  </section>
</template>

<style scoped lang="scss">
.transaction_hero {
  align-items: center;
  background: var(--gradient-hero);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
}

.amount_group {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.6rem;
}

.transaction_amount {
  color: var(--color-text);
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.1;
}

.transaction_amount.income {
  color: var(--color-primary);
}

.bonus_line {
  align-items: center;
  color: var(--color-primary);
  display: flex;
  font-size: 0.95rem;
  font-weight: 700;
  gap: 0.35rem;
  margin-top: 0.45rem;
}

.bonus_mark {
  background: var(--color-primary);
  border-radius: 50%;
  display: inline-block;
  height: 14px;
  position: relative;
  width: 14px;

  &::after {
    background: var(--color-surface);
    border-radius: 50%;
    content: "";
    height: 5px;
    left: 4.5px;
    position: absolute;
    top: 4.5px;
    width: 5px;
  }
}

.counterparty {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  margin: 0.5rem auto 1.25rem;
  max-width: 520px;
}

.save_button {
  background: var(--color-surface);
  border: none;
  border-radius: 14px;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  min-height: 48px;
  padding: 0 1.25rem;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: var(--color-surface-hover);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 480px) {
  .transaction_hero {
    border-radius: 20px;
    padding: 1.75rem 1rem 1.25rem;
  }

  .transaction_amount {
    font-size: 2rem;
  }
}
</style>
