<script setup lang="ts">
import CreditCardIcon from "./creditCardIcon.vue";

const props = defineProps<{
  lastFourNumber: string;
  cardMoney: string;
  accountData: string;
}>();

// title="Платёжный счёт 1104. Баланс 13 800,78. руб.. Привязана 1 карта."

const formattedMoney = computed(() => {
  const num = parseFloat(props.cardMoney); // Парсим строку в число (на случай десятичных)
  if (isNaN(num)) return props.cardMoney; // Если не число, возвращаем как есть
  return num.toLocaleString("ru-RU"); // Форматируем с пробелами для тысяч (русский локаль)
});

const title = computed(
  () => `Платёжный счёт ${props.accountData}. Баланс ${formattedMoney.value}.`,
);
const financeStore = useFinanceStore();
</script>

<template>
  <a class="account" :title="title" :aria-label="title" href="">
    <div class="account-container">
      <div class="account-head">
        <CreditCardIcon />
        <p class="last-four-number-card">{{ lastFourNumber }}</p>
      </div>
      <div class="card-date">
        <div class="money-data">
          <p v-if="financeStore.showFinance" class="hiden-money">*******</p>
          <p v-else class="money">{{ formattedMoney }}</p>
          <p class="currency">₽</p>
        </div>
        <div class="account-data">
          <p>Счёт **</p>
          <p class="account-data">{{ accountData }}</p>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped lang="scss">
.account {
  background-color: #fff;
  height: 7.5rem;
  width: 7.5rem;
  border-radius: 16px;
  margin-right: 0.8rem;
  flex-shrink: 0;
  padding: 1rem;
}
.account-container {
  height: 100%;
  // padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.last-four-number-card {
  margin: 0;
  font-size: small;
}

.money-data {
  display: flex;
}

.account-data {
  display: flex;
  font-size: small;
}
</style>
