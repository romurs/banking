<script setup lang="ts">
import SmallArrowDownIcon from "./SmallArrowDownIcon.vue";
import { getTransactionLabel } from "~/../utils/transaction-types";

interface Account {
  id: number;
  accountNumber: string;
  cardLastFour: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

const props = defineProps<{
  selectedType: string;
  selectedAccount: string;
  amountFrom: string;
  amountTo: string;
  transactionTypes: { key: string; label: string }[];
  accounts: Account[];
}>();

const handleClickOutside = (event: MouseEvent) => {
  if (!filtersRef.value) return;

  const target = event.target as Node;

  if (!filtersRef.value.contains(target)) {
    openFilter.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const emit = defineEmits<{
  (
    event:
      | "update:selected-type"
      | "update:selected-account"
      | "update:amount-from"
      | "update:amount-to",
    value: string,
  ): void;
}>();

const openFilter = ref<"type" | "product" | "amount" | null>(null);

const activeMenuRef = ref<HTMLElement | null>(null);
const filtersRef = ref<HTMLElement | null>(null);

const positionMenu = (menuEl: HTMLElement, buttonEl: HTMLElement) => {
  const rect = buttonEl.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  if (rect.right + 260 > viewportWidth) {
    menuEl.style.left = "auto";
    menuEl.style.right = "0";
  } else {
    menuEl.style.left = "0";
    menuEl.style.right = "auto";
  }
};

const toggleFilter = (filter: "type" | "product" | "amount") => {
  if (openFilter.value === filter) {
    openFilter.value = null;
    return;
  }

  openFilter.value = filter;

  nextTick(() => {
    const menu = activeMenuRef.value;
    const button = document.querySelector(
      `[data-filter="${filter}"]`,
    ) as HTMLElement;

    if (menu && button) {
      positionMenu(menu, button);
    }
  });
};

const typeLabel = computed(() =>
  props.selectedType
    ? getTransactionLabel(props.selectedType)
    : "Что показывать",
);

const accountLabel = computed(() => {
  if (!props.selectedAccount) return "Все карты и счета";
  const account = props.accounts.find(
    (a) => a.id.toString() === props.selectedAccount,
  );
  return account
    ? `${account.cardLastFour} (${account.currency})`
    : "Выбрать счет";
});

const amountLabel = computed(() => {
  const from = props.amountFrom ? `От ${props.amountFrom}` : "";
  const to = props.amountTo ? `До ${props.amountTo}` : "";
  if (from && to) return `${from} - ${to} ₽`;
  if (from) return `${from} ₽`;
  if (to) return `${to} ₽`;
  return "Сумма";
});

const selectType = (type: string) => {
  emit("update:selected-type", type);
  openFilter.value = null;
};

const selectAccount = (accountId: string) => {
  emit("update:selected-account", accountId);
  openFilter.value = null;
};

const updateAmountFrom = (value: string) => {
  emit("update:amount-from", value);
};

const updateAmountTo = (value: string) => {
  emit("update:amount-to", value);
};

const clearAmount = () => {
  emit("update:amount-from", "");
  emit("update:amount-to", "");
  openFilter.value = null;
};
</script>

<template>
  <section ref="filtersRef" class="filters_bar" aria-label="Фильтры истории">
    <div class="filter_control">
      <button
        class="filter_chip"
        :class="{ active: selectedType }"
        type="button"
        data-filter="type"
        :aria-expanded="openFilter === 'type'"
        @click="toggleFilter('type')"
      >
        <span>{{ typeLabel }}</span>
        <SmallArrowDownIcon />
      </button>

      <div v-if="openFilter === 'type'" class="filter_menu">
        <button class="filter_menu_item" type="button" @click="selectType('')">
          Все операции
        </button>
        <button
          v-for="type in transactionTypes"
          :key="type.key"
          class="filter_menu_item"
          type="button"
          @click="selectType(type.key)"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <div class="filter_control">
      <button
        class="filter_chip"
        :class="{ active: selectedAccount }"
        type="button"
        data-filter="product"
        :aria-expanded="openFilter === 'product'"
        @click="toggleFilter('product')"
      >
        <span>{{ accountLabel }}</span>
        <SmallArrowDownIcon />
      </button>

      <div
        v-if="openFilter === 'product'"
        ref="activeMenuRef"
        class="filter_menu filter_menu-wide"
      >
        <button
          class="filter_menu_item"
          type="button"
          @click="selectAccount('')"
        >
          Все карты и счета
        </button>
        <button
          v-for="account in accounts"
          :key="account.id"
          class="filter_menu_item"
          type="button"
          @click="selectAccount(account.id.toString())"
        >
          {{ account.cardLastFour }} — 
          <span class="account_balance"
            >{{ account.balance.toLocaleString("ru-RU") }}
            {{ account.currency }}</span
          >
        </button>
      </div>
    </div>

    <div class="filter_control">
      <button
        class="filter_chip"
        :class="{ active: amountFrom || amountTo }"
        type="button"
        data-filter="amount"
        :aria-expanded="openFilter === 'amount'"
        @click="toggleFilter('amount')"
      >
        <span>{{ amountLabel }}</span>
        <div class="icon_wrapper">
          <SmallArrowDownIcon />
        </div>
      </button>

      <div
        v-if="openFilter === 'amount'"
        ref="activeMenuRef"
        class="filter_menu amount_menu"
      >
        <div class="amount_inputs">
          <div class="input_group">
            <label for="amount_from">От (₽)</label>
            <input
              :value="amountFrom"
              type="number"
              placeholder="0"
              min="0"
              @input="
                updateAmountFrom(($event.target as HTMLInputElement).value)
              "
            />
          </div>
          <div class="input_group">
            <label for="amount_to">До (₽)</label>
            <input
              :value="amountTo"
              type="number"
              placeholder="Неограниченно"
              min="0"
              @input="updateAmountTo(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <button
          class="filter_menu_item clear_btn"
          type="button"
          @click="clearAmount"
        >
          Сбросить
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.filters_bar {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
  position: relative;
}

.filters_bar::-webkit-scrollbar {
  display: none;
}

.filter_control {
  flex: 0 0 auto;
  position: relative;
}

.filter_chip {
  align-items: center;
  background: #fff;
  border: none;
  border-radius: 14px;
  color: #262626;
  cursor: pointer;
  display: flex;
  font-size: 0.95rem;
  font-weight: 500;
  gap: 0.35rem;
  height: 44px;
  padding: 0 0.85rem 0 1rem;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
  white-space: nowrap;
}

.filter_chip:hover,
.filter_chip.active {
  background: #f8fbf8;
  box-shadow: inset 0 0 0 1px rgba(11, 133, 35, 0.22);
  color: #0b8523;
}

.icon_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter_menu {
  position: absolute;
  top: 100%;
  left: 0; /* по умолчанию */
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  min-width: 210px;
  padding: 6px;
  z-index: 9999;
  transition: opacity 0.1s;
}

/* Для суммы делаем шире */
.amount_menu {
  min-width: 280px;
}

.amount_inputs {
  display: grid;
  gap: 0.75rem;
  padding: 0.5rem 0.25rem 0.75rem;
}

.input_group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input_group label {
  color: #616161;
  font-size: 0.8rem;
  font-weight: 600;
}

.amount_inputs input {
  background: #f7f9f7;
  border: 1px solid #d8e3d8;
  border-radius: 12px;
  color: #1f1f1f;
  font-size: 0.95rem;
  padding: 0.85rem 0.9rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.amount_inputs input:focus {
  border-color: #6aae68;
  box-shadow: 0 0 0 3px rgba(106, 174, 104, 0.14);
}

.clear_btn {
  margin: 0 0.25rem 0.35rem;
  border-radius: 12px;
  color: #0b8523;
}

.filter_menu-wide {
  min-width: 240px;
  max-height: 300px;
  overflow-y: auto;
}

.filter_menu_item {
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #262626;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.7rem 0.85rem;
  text-align: left;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.filter_menu_item:hover {
  background: #f1f1f1;
}

@media (max-width: 1200px) {
  .filters_bar {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 20;
    padding-right: 10px;
    padding-left: 10px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}
</style>
