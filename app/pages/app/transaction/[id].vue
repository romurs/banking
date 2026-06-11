<script setup lang="ts">
import BackButton from "~/components/newAccount/backButton.vue";
import TransactionDetailsCard from "~/components/transaction/TransactionDetailsCard.vue";
import TransactionHero from "~/components/transaction/TransactionHero.vue";
import TransactionState from "~/components/transaction/TransactionState.vue";
import type { TransactionDetail } from "~/components/transaction/types";

const route = useRoute();

const transactionId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id;
});

const {
  data: transaction,
  pending,
  error,
  refresh,
} = await useFetch<TransactionDetail>(
  () => `/api/transactions/${transactionId.value}`,
  {
    key: `transaction-${transactionId.value}`,
  },
);

const pageTitle = computed(() => {
  if (!transaction.value) {
    return "Детали операции | Lumos Bank";
  }

  return `${transaction.value.counterparty} | Детали операции`;
});

const errorCopy = computed(() => {
  const statusCode = error.value?.statusCode;

  if (statusCode === 401) {
    return {
      title: "Нужно войти в аккаунт",
      description: "Сессия закончилась. Войдите снова, чтобы посмотреть операцию.",
    };
  }

  if (statusCode === 400 || statusCode === 404) {
    return {
      title: "Операция не найдена",
      description:
        "Такой операции нет в вашей истории, либо она принадлежит другому пользователю.",
    };
  }

  return {
    title: "Не удалось загрузить операцию",
    description: "Попробуйте обновить страницу или открыть операцию из истории ещё раз.",
  };
});

useHead({
  title: pageTitle,
  meta: [{ name: "description", content: "Детали банковской операции" }],
});
</script>

<template>
  <div class="transaction_page">
    <BackButton />

    <TransactionState
      v-if="pending"
      title="Загрузка операции..."
      description="Получаем подробности транзакции."
    />

    <TransactionState
      v-else-if="error"
      :title="errorCopy.title"
      :description="errorCopy.description"
      can-retry
      @retry="refresh"
    />

    <template v-else-if="transaction">
      <TransactionHero :transaction="transaction" />
      <TransactionDetailsCard :transaction="transaction" />
    </template>

    <TransactionState
      v-else
      title="Операция не найдена"
      description="Попробуйте вернуться в историю и выбрать операцию заново."
    />
  </div>
</template>

<style scoped lang="scss">
.transaction_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

@media (max-width: 480px) {
  .transaction_page {
    gap: 0.75rem;
    padding: 0 0.75rem;
  }
}
</style>
