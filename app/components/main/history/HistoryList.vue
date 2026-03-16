<script setup lang="ts">
import HistoryItem from "./HistoryItem.vue";
</script>

<template>
  <div class="history_list">
    <HistoryItem
      ammount="169.98"
      type="Оплата товаров и услуг"
      date="12.03.2026"
      from="Магнит"
      transaction="1"
    />
    <HistoryItem
      ammount="2000"
      type="Перевод"
      date="12.03.2026"
      from="Т.Банк Колесников А.В"
      transaction="2"
    />
    <HistoryItem
      ammount="200000"
      type="Прочие поступления"
      date="12.03.2026"
      from="ООО 'Ебашь Монтаж'"
      transaction="3"
    />
  </div>
</template>

<style scoped lang="scss">
.history_list {
  display: flex;
  flex-direction: column;
}
</style>
