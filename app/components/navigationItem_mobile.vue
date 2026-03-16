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

@media (max-width: 1200px) {
  nav {
    width: 100%;
    min-height: 4rem;
    background-color: #fff;

    position: fixed;
    bottom: 0;

    display: flex;
    align-items: flex-start;
    flex-direction: row;
    justify-content: stretch;
    align-self: flex-start;

    visibility: visible;
  }
}
</style>
