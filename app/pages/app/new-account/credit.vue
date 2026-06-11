<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import Account_detail from "~/components/newAccount/account_detail.vue";
import BackButton from "~/components/newAccount/backButton.vue";
import CreditLimitSection from "~/components/newAccount/CreditLimitSection.vue";

useHead({
  title: "Кредитные карты - Lumos Bank",
  meta: [{ name: "creditcard", content: "Оформить кредитную карту" }],
});

const error = ref("");
const creditLimit = ref(300000);

const hendleCreateNewCreditCard = async () => {
  try {
    error.value = "";
    await $fetch("/api/accounts", {
      method: "POST",
      body: { type: "CREDIT", creditLimit: creditLimit.value },
    });

    // navigate to accounts page or show success
    navigateTo("/app");
  } catch (err: any) {
    console.error("Create credit error", err);
    error.value = err.data?.message ?? err.message ?? "Ошибка оформления";
  }
};
</script>

<template>
  <div class="na_wrapper">
    <BackButton />
    <div class="na_header">
      <h1>Кредитные карты</h1>
    </div>
    <div class="na_main">
      <div class="item picture">
        <div class="card-container">
          <NuxtImg src="lumos_credit_mob.png" alt="Кредитная карта" />
        </div>
      </div>
      <div class="item desc">
        <h2>Кредитная Lumos Card</h2>
        <p>Решение за 2 минуты онлайн.</p>
        <div class="details">
          <Account_detail
            detail_title="0 ₽"
            detail_desc="обслуживания и уведомления"
          />
          <Account_detail detail_title="120 дней" detail_desc="без процентов" />
          <Account_detail detail_title="9.8%" detail_desc="процентная ставка" />
        </div>

        <CreditLimitSection @update:limit="(v) => (creditLimit = v)" />
        <div class="order_new_card">
          <button class="order" @click="hendleCreateNewCreditCard">
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
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
    color: rgb(51, 51, 51);
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
  background-color: #f1f1f1;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
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
  background-color: #148f2b;
  color: #fff;
  font-weight: 600;
  padding: 1rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.4;
  }
}

.error_message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 1rem;
  padding: 12px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 8px;
  text-align: center;
}
</style>
