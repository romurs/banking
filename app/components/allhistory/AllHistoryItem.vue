<script setup lang="ts">
import ArrowUp from "../main/history/ArrowUp.vue";
import ArrowDown from "../main/history/ArrowDown.vue";
import ShoppingCardFill from "../main/history/ShoppingCardFill.vue";
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
  return props.type === "Прочие поступления" ? "+" : "-";
});

const amountColor = computed(() => {
  return props.type === "Прочие поступления" ? "#0b8523" : "#e53935";
});

const financeStore = useFinanceStore();
</script>

<template>
  <NuxtLink :to="`/app/transaction/${props.transaction}`">
    <div class="history_item_allhistory">
      <div class="item_icon">
        <div v-if="props.type == 'Оплата товаров и услуг'" class="icon_wrapper">
          <ShoppingCardFill />
        </div>
        <div v-else-if="props.type == 'Перевод'" class="icon_wrapper">
          <ArrowUp />
        </div>
        <div
          v-else-if="props.type == 'Прочие поступления'"
          class="icon_wrapper"
        >
          <ArrowDown />
        </div>
      </div>

      <div class="item_content">
        <div class="content_header">
          <div class="name_and_type">
            <h4 class="transaction_name">{{ props.from }}</h4>
            <p class="transaction_type">{{ props.type }}</p>
          </div>
          <div class="amount_section">
            <p v-if="financeStore.showFinance" class="hidden_amount">*******</p>
            <p
              v-else
              class="transaction_amount"
              :style="{ color: amountColor }"
            >
              {{ amountSign }}{{ formattedMoney }} ₽
            </p>
          </div>
        </div>
        <div class="content_footer">
          <p class="transaction_date">{{ props.date }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.history_item_allhistory {
  display: flex;
  align-items: flex-start;
  padding: 1.25rem 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #fafafa;
    padding: 1.25rem 1rem;
    margin: 0 -1rem;
    border-radius: 10px;
  }

  &:last-child {
    border-bottom: none;
  }

  a {
    width: 100%;
  }
}

.item_icon {
  min-width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.icon_wrapper {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #d6e0ff, #e8d6f1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item_content {
  flex: 1;
  min-width: 0;
}

.content_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.name_and_type {
  flex: 1;
  min-width: 0;
}

.transaction_name {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction_type {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

.amount_section {
  text-align: right;
  white-space: nowrap;
}

.transaction_amount {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.hidden_amount {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: #999;
}

.content_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction_date {
  font-size: 0.85rem;
  color: #bbb;
  margin: 0;
}

@media (max-width: 480px) {
  .history_item_allhistory {
    padding: 1rem 0;

    &:hover {
      padding: 1rem 0.5rem;
      margin: 0 -0.5rem;
    }
  }

  .item_icon {
    margin-right: 0.75rem;
  }

  .icon_wrapper {
    width: 40px;
    height: 40px;
  }

  .transaction_name {
    font-size: 0.95rem;
  }

  .transaction_amount {
    font-size: 0.9rem;
  }
}
</style>
