<script setup lang="ts">
import ArrowUp from "./ArrowUp.vue";
import ArrowDown from "./ArrowDown.vue";
import ShoppingCardFill from "./ShoppingCardFill.vue";
import { useFinanceStore } from "~/stores/finance";

const props = defineProps<{
  type: "Оплата товаров и услуг" | "Перевод" | "Прочие поступления";
  ammount: string;
  date: string;
  from: string;
  transaction?: string;
}>();

const formattedMoney = computed(() => {
  const num = parseFloat(props.ammount);
  if (isNaN(num)) return props.ammount;
  return num.toLocaleString("ru-RU");
});

const amountSign = computed(() => {
  return props.type === "Прочие поступления" ? "+" : "";
});

// Вычисляемый цвет для суммы
const amountColor = computed(() => {
  return props.type === "Прочие поступления" ? "#0b8523" : "inherit";
});

const financeStore = useFinanceStore();
</script>

<template>
  <NuxtLink :to="`transaction/${props.transaction}`">
    <div class="history_item">
      <div class="history_item_icon">
        <div v-if="props.type == 'Оплата товаров и услуг'">
          <ShoppingCardFill />
        </div>
        <div v-else-if="props.type == 'Перевод'"><ArrowUp /></div>
        <div v-else-if="props.type == 'Прочие поступления'"><ArrowDown /></div>
      </div>
      <div class="history_data">
        <div class="history_info">
          <div class="history_payname">{{ props.from }}</div>
          <p v-if="financeStore.showFinance" class="hiden-money">*******</p>
          <p v-else class="history_ammount" :style="{ color: amountColor }">
            {{ amountSign }}{{ formattedMoney }} ₽
          </p>
        </div>
        <div class="history_discription">
          <div class="history_date">{{ props.date }}</div>
          <div class="history_type">{{ props.type }}</div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.history_item {
  display: flex;
  width: 100%;
  min-height: 69px;
  align-items: center;
  cursor: pointer;

  transition: opacity 0.15s ease;
}

.history_item:hover {
  opacity: 0.4;
}

.history_payname {
  font-weight: 700;
  font-size: large;
}

.history_info {
  display: flex;
  justify-content: space-between;
}

.history_discription {
  color: #0000008c currentColor;
  display: flex;
  gap: 1rem;
  font-size: smaller;
}

.history_data {
  width: 100%;
}

.history_item_icon {
  margin-right: 1rem;
  align-items: center;
}
</style>
