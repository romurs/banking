<script setup lang="ts">
import AccountBackButton from "~/components/account/AccountBackButton.vue";
import AccountExpenses from "~/components/account/AccountExpenses.vue";
import AccountHero from "~/components/account/AccountHero.vue";
import AccountHistory from "~/components/account/AccountHistory.vue";
import AccountIncome from "~/components/account/AccountIncome.vue";
import AccountState from "~/components/account/AccountState.vue";
import type { AccountDetail } from "~/components/account/types";

const route = useRoute();

const accountId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id;
});

const {
  data: account,
  pending,
  error,
  refresh,
} = await useFetch<AccountDetail>(() => `/api/accounts/${accountId.value}`, {
  key: `account-${accountId.value}`,
});

const pageTitle = computed(() => {
  if (!account.value) {
    return "Детали счёта | Сбербанк Онлайн";
  }

  return `Счёт •• ${account.value.accountNumberLastFour} | Сбербанк Онлайн`;
});

const errorCopy = computed(() => {
  const statusCode = error.value?.statusCode;

  if (statusCode === 401) {
    return {
      title: "Нужно войти в аккаунт",
      description: "Сессия закончилась. Войдите снова, чтобы посмотреть счёт.",
    };
  }

  if (statusCode === 400 || statusCode === 404) {
    return {
      title: "Счёт не найден",
      description:
        "Такого счёта нет среди ваших продуктов, либо он принадлежит другому пользователю.",
    };
  }

  return {
    title: "Не удалось загрузить счёт",
    description: "Попробуйте обновить страницу или открыть счёт с главной.",
  };
});

useHead({
  title: pageTitle,
  meta: [{ name: "description", content: "Детали банковского счёта" }],
});
</script>

<template>
  <div class="account_page">
    <AccountBackButton />

    <AccountState
      v-if="pending"
      title="Загрузка счёта..."
      description="Получаем баланс, расходы и историю операций."
    />

    <AccountState
      v-else-if="error"
      :title="errorCopy.title"
      :description="errorCopy.description"
      can-retry
      @retry="refresh"
    />

    <template v-else-if="account">
      <AccountHero :account="account" />
      <AccountExpenses :transactions="account.transactions" />
      <AccountIncome :transactions="account.transactions" />
      <AccountHistory :transactions="account.transactions" />
    </template>

    <AccountState
      v-else
      title="Счёт не найден"
      description="Вернитесь на главную и выберите счёт заново."
    />
  </div>
</template>

<style scoped lang="scss">
.account_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

@media (max-width: 480px) {
  .account_page {
    gap: 0.75rem;
    padding: 0 0.75rem;
  }
}
</style>
