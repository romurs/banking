<script setup lang="ts">
import Account_detail from "~/components/newAccount/account_detail.vue";
import BackButton from "~/components/newAccount/backButton.vue";

useHead({
  title: "Дебитовые карты - Lumos Bank",
  meta: [{ name: "debitcard", content: "Оформить дебитовую карту" }],
});

const error = ref("");

const hendleCreateNewDebitCard = async () => {
  try {
    error.value = "";
    const res = await $fetch("/api/accounts", {
      method: "POST",
      body: { type: "DEBIT" },
    });

    // navigate to accounts or main page
    navigateTo("/app");
  } catch (err: any) {
    console.error("Create debit error", err);
    error.value = err.data?.message ?? err.message ?? "Ошибка оформления";
  }
};
</script>

<template>
  <div class="na_wrapper">
    <BackButton />
    <div class="na_header">
      <h1>Дебитовые карты</h1>
    </div>
    <div class="na_main">
      <div class="item picture">
        <div class="card-container">
          <NuxtImg src="lumos_debet.png" alt="Дебитовая карта" />
        </div>
      </div>
      <div class="item desc">
        <h2>Lumos Card</h2>
        <p>
          Получайте кешбэк в категориях на выбор с картой Lumos Bank, переводите
          деньги без комиссии и оплачивайте покупки через Lumos Pay
        </p>
        <div class="details">
          <Account_detail detail_title="От 0 ₽" detail_desc="обслуживание" />
          <Account_detail detail_title="До 10%" detail_desc="кэщбэк бонусами" />
        </div>
        <div class="order_new_card">
          <button class="order" @click="hendleCreateNewDebitCard">
            Оформить онлайн
          </button>
        </div>
      </div>
    </div>
    <div v-if="error" class="error_message">
      {{ error }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.na_main {
  display: flex;
  padding: 2rem;
  gap: 2rem;
  background-color: var(--color-surface);
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
}

@media (max-width: 1200px) {
  .na_main {
    display: block;
  }
}

.na_header {
  margin: 2rem;
}

.desc {
  h2,
  p {
    color: var(--color-text);
  }
}

.picture {
  flex-shrink: 0;
  width: 100%;
  max-width: 260px;
  display: flex;
  justify-content: center;
  align-self: center;
}

.card-container {
  width: 100%;
  max-width: 260px;
  aspect-ratio: 1.6 / 1;
  background-color: var(--color-app-bg);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-media);
}

.card-container :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.details {
  margin-top: 2rem;
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.order_new_card {
  margin-top: 3rem;
}

.order {
  border-radius: 16px;
  cursor: pointer;
  border: none;
  background-color: var(--color-primary);
  color: var(--color-surface);
  font-weight: 600;
  padding: 1rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.4;
  }
}

.error_message {
  color: var(--color-danger);
  font-size: 14px;
  margin-top: 1rem;
  padding: 12px;
  background-color: var(--color-danger-focus);
  border-radius: 8px;
  text-align: center;
}
</style>
