<script setup lang="ts">
import ArrowUp from "./ArrowUp.vue";
import ArrowDown from "./ArrowDown.vue";
import ShoppingCardFill from "./ShoppingCardFill.vue";
import { useFinanceStore } from "~/stores/finance";
import { getTransactionLabel } from "~/../utils/transaction-types";

const props = defineProps<{
  type: "PAYMENT" | "TRANSFER" | "INCOME" | string;
  ammount: string;
  date?: string;
  from: string;
  transaction?: string;
}>();

const formattedDate = computed(() => {
  return props.date ? formatOperationDate(props.date) : "";
});

const formattedMoney = computed(() => {
  const num = parseFloat(props.ammount);
  if (isNaN(num)) return props.ammount;
  return num.toLocaleString("ru-RU");
});

const amountSign = computed(() => {
  return props.type === "INCOME" || props.type === "TRANSFER_IN" ? "+" : "";
});

// Вычисляемый цвет для суммы
const amountColor = computed(() => {
  return props.type === "INCOME" || props.type === "TRANSFER_IN"
    ? "#0b8523"
    : "inherit";
});

const financeStore = useFinanceStore();

const displayType = computed(() => getTransactionLabel(props.type));
</script>

<template>
  <NuxtLink :to="`/app/transaction/${props.transaction}`">
    <div class="history_item">
      <div class="history_item_icon">
        <div v-if="props.type == 'PAYMENT'">
          <ShoppingCardFill />
        </div>
        <div v-else-if="props.type == 'TRANSFER_OUT'"><ArrowUp /></div>
        <div v-else-if="props.type == 'INCOME' || props.type == 'TRANSFER_IN'">
          <ArrowDown />
        </div>
      </div>
      <div class="history_data">
        <div class="history_info">
          <p class="history_payname">{{ props.from }}</p>
          <p v-if="financeStore.showFinance" class="hiden-money">*******</p>
          <p v-else class="history_ammount" :style="{ color: amountColor }">
            {{ amountSign }}{{ formattedMoney }} ₽
          </p>
        </div>
        <div class="history_discription">
          <p v-if="props.date" class="history_date">{{ formattedDate }}</p>
          <p class="history_type">{{ displayType }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.history_item {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  padding: 0.85rem 1.5rem;
  align-items: flex-start;

  transition: opacity 0.15s ease;
}

.history_item:hover {
  opacity: 0.4;
}

.history_payname {
  font-weight: 700;
  font-size: large;
  text-align: right;
}

.history_ammount {
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.history_info {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.history_discription {
  opacity: 0.5;
  display: flex;
  gap: 1rem;
  font-size: smaller;
  align-items: center;
  gap: 0.75rem;
}

.history_data {
  width: 100%;
  min-width: 0;
}

.history_item_icon {
  margin-right: 1rem;
  align-items: center;
}

@media (max-width: 480px) {
  .history_payname {
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .history_ammount {
    font-size: 0.95rem;
    white-space: nowrap;
  }
  .hiden-money {
    font-size: 0.95rem;
    white-space: nowrap;
  }

  .history_discription {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .history_item {
    min-height: 60px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
@media (max-width: 1200px) {
}
</style>
