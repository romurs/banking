<script setup lang="ts">
import type { AccountDetail } from "./types";
import { useFinanceStore } from "~/stores/finance";

const props = defineProps<{
  account: AccountDetail;
}>();

const financeStore = useFinanceStore();

const accountTitle = computed(() => {
  return props.account.type === "CREDIT" ? "Кредитный счёт" : "Платёжный счёт";
});

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
  <section class="account_hero">
    <div class="account_identity">
      <div>
        <p class="account_title">{{ accountTitle }}</p>
        <p class="account_number">
          •• {{ props.account.accountNumberLastFour }}
        </p>
      </div>

      <button class="delete_button" type="button">Удалить</button>
    </div>

    <p class="account_balance">
      {{
        financeStore.showFinance
          ? "*******"
          : formatMoney(props.account.balance)
      }}
    </p>

    <p v-if="props.account.cardLastFour" class="card_line">
      МИР Lumos Card <span>•• {{ props.account.cardLastFour }}</span>
    </p>

    <div class="account_actions">
      <NuxtLink class="action_button" to="">Перевести</NuxtLink>
      <NuxtLink class="action_button" to="">Пополнить</NuxtLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.account_hero {
  background: linear-gradient(135deg, #d6e0ff, #f6e4f1);
  border-radius: 20px;
  padding: 1.5rem;
}

.account_identity {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.account_title {
  color: #262626;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}

.account_number {
  color: rgba(38, 38, 38, 0.58);
  font-size: 1.05rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.delete_button {
  background: #fff;
  border: none;
  border-radius: 12px;
  color: #d32f2f;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  min-height: 40px;
  padding: 0 0.9rem;

  &:hover {
    background: #f7caca;
    opacity: 0.6;
  }
}

.account_balance {
  color: #262626;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  margin-top: 1.35rem;
}

.card_line {
  color: rgba(38, 38, 38, 0.66);
  font-size: 0.95rem;
  font-weight: 700;
  margin-top: 0.5rem;

  span {
    margin-left: 0.35rem;
  }
}

.account_actions {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1.35rem;
}

.action_button {
  align-items: center;
  background: #fff;
  border-radius: 14px;
  color: #000000;
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  justify-content: center;
  min-height: 48px;
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    background: #f8fbf8;
    box-shadow: inset 0 0 0 1px rgba(11, 133, 35, 0.22);
    color: #0b8523;
  }
}

@media (max-width: 480px) {
  .account_hero {
    padding: 1.25rem 1rem;
  }

  .account_balance {
    font-size: 1.8rem;
  }
}
</style>
