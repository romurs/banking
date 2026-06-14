<script setup lang="ts">
import QuickTransfers from "~/components/payments/QuickTransfers.vue";
import TransferForm from "~/components/payments/TransferForm.vue";
import type {
  PaymentAccount,
  RecentRecipient,
} from "~/components/payments/types";

useHead({
  title: "Переводы | Lumos Bank",
  meta: [{ name: "description", content: "Перевод клиенту банка" }],
});

const recipient = ref("");

const {
  data: accounts,
  pending,
  error,
  refresh,
} = await useFetch<PaymentAccount[]>("/api/accounts", {
  default: () => [],
});

const selectRecipient = (recentRecipient: RecentRecipient) => {
  recipient.value = recentRecipient.recipient || recentRecipient.cardLastFour || "";
};

const openTransaction = (transactionId: number) => {
  navigateTo(`/app/transaction/${transactionId}`);
};
</script>

<template>
  <div class="payments_page">
    <QuickTransfers selectable @select="selectRecipient" />

    <section v-if="pending" class="state_card">
      <p>Загрузка счетов...</p>
    </section>

    <section v-else-if="error" class="state_card">
      <p>Не удалось загрузить счета</p>
      <button type="button" @click="refresh">Повторить</button>
    </section>

    <section v-else-if="!accounts.length" class="state_card">
      <p>Для перевода нужен активный счёт</p>
    </section>

    <TransferForm
      v-else
      v-model:recipient="recipient"
      :accounts="accounts"
      @done="openTransaction"
    />
  </div>
</template>

<style scoped lang="scss">
.payments_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.state_card {
  align-items: center;
  background: var(--color-surface);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 180px;
  padding: 1.5rem;
  text-align: center;

  p {
    color: var(--color-text-muted);
    font-size: 1rem;
    font-weight: 700;
  }

  button {
    background: var(--color-primary);
    border: none;
    border-radius: 12px;
    color: var(--color-surface);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 700;
    margin-top: 1rem;
    min-height: 44px;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .payments_page {
    gap: 0.75rem;
    padding: 0 0.75rem;
  }
}
</style>
