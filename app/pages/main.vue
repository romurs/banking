<script setup lang="ts">
import HistoryHead from "~/components/main/history/HistoryHead.vue";
import AccountsList from "~/components/main/wallet/accounts/accountsList.vue";
import AccountHead from "~/components/main/wallet/accounts/AccountHead.vue";
import HistoryList from "~/components/main/history/HistoryList.vue";

useHead({
  title: "Сбербанк Онлайн",
  meta: [{ name: "mainpage", content: "Управление считами онлайн" }],
});
</script>

<template>
  <div>
    <div class="wallet">
      <AccountHead />
      <AccountsList />
    </div>
    <div class="history">
      <HistoryHead />
      <HistoryList />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wallet {
  background: linear-gradient(135deg, #d6e0ff, #f6e4f1);
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
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 2rem;
  padding-top: 2rem;
}

@media (max-width: 480px) {
  .wallet {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 1rem;
  }
}
</style>
