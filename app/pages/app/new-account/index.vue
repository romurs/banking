<script setup lang="ts">
import BackButton from "~/components/newAccount/backButton.vue";

useHead({
  title: "Оформить новый счёт - Lumos Bank",
  meta: [{ name: "mainpage", content: "Управление считами онлайн" }],
});
</script>

<template>
  <div>
    <BackButton />
    <div class="newAccount">
      <div class="wrapper">
        <h1>Оформить</h1>
        <div class="title card">
          <h2>Карту</h2>
          <NewAccountItem
            title="Дебитовая"
            description="Оплачивайте покупки и услуги, получайте переводы"
            link="/app/new-account/debit"
          >
            <template #account_icon>
              <NuxtImg src="debit.png" alt="Дебитовая карта" />
            </template>
          </NewAccountItem>
          <NewAccountItem
            title="Кредитная"
            description="Пользуйтись деньгами банка и не платите проценты"
            link="/app/new-account/credit"
          >
            <template #account_icon>
              <NuxtImg src="credit.png" alt="Кредитная карта" />
            </template>
          </NewAccountItem>
        </div>
        <div class="title account">
          <h2>Счёт</h2>
          <NewAccountItem
            title="Платёжный счёт"
            description="Для переводов и платежей в Lumos Bank"
            link="/app/new-account/cta"
            :clickable="false"
          >
            <template #account_icon>
              <NuxtImg src="cta.png" alt="Платёжный счёт" />
            </template>
          </NewAccountItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.newAccount {
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.wrapper {
  padding: 2rem;
  // margin: 2rem;

  h1 {
    font-weight: 500;
  }
}

.title {
  padding-top: 0.6rem;
}

.account{
    // opacity: 0.4;
}
</style>
