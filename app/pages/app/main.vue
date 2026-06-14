<script setup lang="ts">
import HistoryHead from "~/components/main/history/HistoryHead.vue";
import AccountsList from "~/components/main/wallet/accounts/accountsList.vue";
import AccountHead from "~/components/main/wallet/accounts/AccountHead.vue";
import HistoryList from "~/components/main/history/HistoryList.vue";
import QuickTransfers from "~/components/payments/QuickTransfers.vue";

useHead({
  title: "Lumos Bank",
  meta: [{ name: "mainpage", content: "Управление считами онлайн" }],
});
</script>

<template>
  <div>
    <div class="wallet widjet">
      <AccountHead />
      <AccountsList />
    </div>
    <div class="history widjet">
      <HistoryHead />
      <HistoryList />
    </div>
    <QuickTransfers class="widjet" />
  </div>
</template>

<style scoped lang="scss">
.widjet{
  margin-bottom: 1rem;
}
.wallet {
  background: var(--gradient-hero);
  border-radius: 20px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 2rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 1.5rem;
  }
}

.history {
  border-radius: 20px;
  // padding-left: 1.5rem;
  // padding-right: 1.5rem;
  // padding-bottom: 1rem;
  // padding-top: 1rem;
  background-color: var(--color-surface);
}

@media (max-width: 480px) {
  .wallet {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 1rem;
    padding-right: 0.6rem;
    padding-left: 0.6rem;
  }
}
</style>
