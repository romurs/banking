<script setup lang="ts">
import AccountTurnoverCard from "./AccountTurnoverCard.vue";
import type { AccountTransaction } from "./types";

defineProps<{
  transactions: AccountTransaction[];
}>();
</script>

<template>
  <AccountTurnoverCard
    :transactions="transactions"
    kind="income"
    title="Доходы за последние 30 дней"
    empty-text="Доходов за последние 30 дней нет"
  />
</template>
