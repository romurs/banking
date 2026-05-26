<script setup lang="ts">
import CreditCardIcon from "./creditCardIcon.vue";
import DebitCardIcon from "./debitCardIcon.vue";
import PlusCircle from "./plusCircle.vue";
import { useFinanceStore } from "~/stores/finance";

interface Props {
  lastFourNumber?: string;
  cardMoney: string;
  accountData: string;
  accountType?: string;
  id?: number;
}

const props = withDefaults(defineProps<Props>(), {
  accountType: "default",
});

const formattedMoney = computed(() => {
  const num = parseFloat(props.cardMoney); 
  if (isNaN(num)) return props.cardMoney; 
  return num.toLocaleString("ru-RU"); 
});
const lastfFourNumberOfAccount = computed(() => {
  return props.accountData.slice(-4);
});
const title = computed(
  () => `Платёжный счёт ${props.accountData}. Баланс ${formattedMoney.value}.`,
);
const financeStore = useFinanceStore();
</script>

<template>
  <NuxtLink
    class="account"
    :title="title"
    :aria-label="title"
    :to="
      props.accountType === 'new'
        ? 'new-account'
        : `/app/account/${props.id}`
    "
  >
    <div class="account-container">
      <div class="account-head">
        <CreditCardIcon v-if="props.accountType == 'CREDIT'" />
        <DebitCardIcon v-else-if="props.accountType == 'DEBIT'" />
        <PlusCircle
          v-else-if="props.accountType == 'new'"
          class="new-card-icon"
        />
        <p class="last-four-number-card">{{ lastFourNumber }}</p>
      </div>

      <div v-if="props.accountType == `CREDIT` || props.accountType == `DEBIT`" class="card-date">
        <div class="money-data">
          <p v-if="financeStore.showFinance" class="hiden-money">*******</p>
          <p v-else class="money">{{ formattedMoney }}</p>
          <p class="currency">₽</p>
        </div>
        <div class="account-data">
          <p>Счёт **</p>
          <p class="account-data">{{ lastfFourNumberOfAccount }}</p>
        </div>
      </div>

      <div v-if="props.accountType == `new`" class="card-date">
        <div class="money-data">
          <p class="money">{{ formattedMoney }}</p>
        </div>
        <div class="account-data">
          <p class="account-data">{{ accountData }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
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
  cursor: pointer;
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
