<script setup lang="ts">
import HomeIcon from "./navigation/homeIcon.vue";
import LoansIcon from "./navigation/loansIcon.vue";
import NavBtn from "./navigation/nav-btn.vue";
import PaymentsIcon from "./navigation/paymentsIcon.vue";
import SavingsIcon from "./navigation/savingsIcon.vue";
</script>

<template>
  <nav class="navigation">
    <NavBtn value="Главная" link="/main">
      <template #icon><HomeIcon /></template>
    </NavBtn>
    <NavBtn value="Накопления" link="/savings">
      <template #icon><SavingsIcon /></template>
    </NavBtn>
    <NavBtn value="Платежи" link="/payments">
      <template #icon><PaymentsIcon /></template>
    </NavBtn>
    <NavBtn value="Кредиты" link="/loans">
      <template #icon><LoansIcon /></template>
    </NavBtn>
  </nav>
</template>

<style scoped lang="scss">
nav {
  visibility: hidden;
  display: none;
}

@media (min-width: 1200px) {
  nav {
    visibility: visible;
    display: block;
    margin-top: 2rem;

    width: 100%;
    min-height: 4rem;
    background-color: #fff;

    position: static;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
}
</style>
