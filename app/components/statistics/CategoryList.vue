<script setup lang="ts">
import { formatMoney } from "./utils";

const props = withDefaults(
  defineProps<{
    title: string;
    items?: { label: string; amount: number }[];
  }>(),
  {
    items: () => [] as { label: string; amount: number }[],
  },
);
</script>

<template>
  <div class="col">
    <h2>{{ props.title }}</h2>
    <div v-if="props.items.length">
      <div v-for="cat in props.items" :key="cat.label" class="cat_row">
        <div class="cat_label">{{ cat.label }}</div>
        <div class="cat_amount">{{ formatMoney(cat.amount) }}</div>
      </div>
    </div>
    <p v-else>Нет транзакций</p>
  </div>
</template>

<style scoped lang="scss">
.col {
  background: #fff;
  border-radius: 14px;
  padding: 1rem;

   h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
}
.cat_row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f1f1;
}
.cat_label {
  color: #262626;
}
.cat_amount {
  font-weight: 700;
}
</style>
