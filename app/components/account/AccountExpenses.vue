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
    kind="expense"
    title="Расходы за последние 30 дней"
    empty-text="Расходов за последние 30 дней нет"
  />
</template>
