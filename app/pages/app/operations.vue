<script setup lang="ts">
import SmallArrowDownIcon from "~/components/allhistory/SmallArrowDownIcon.vue";
import HistoryItem from "~/components/main/history/HistoryItem.vue";
import EyeEmptyIcon from "~/components/main/wallet/eyeEmptyIcon.vue";
import EyeOffIcon from "~/components/main/wallet/eyeOffIcon.vue";
import KebabHorizontalIcon from "~/components/main/wallet/kebabHorizontalIcon.vue";
import BackButton from "~/components/newAccount/backButton.vue";
import { useFinanceStore } from "~/stores/finance";
import { formatOperationDate } from "~/composables/useOperationDate";

useHead({
  title: "История операций | Сбербанк Онлайн",
  meta: [{ name: "AllHistory", content: "История всех операций" }],
});

type FilterKey = "type" | "period" | "product" | "amount";

interface OperationTransaction {
  id: string | number;
  amount: number;
  type: string;
  date: string;
  counterparty: string;
  description?: string | null;
}

const selectedType = ref("");
const selectedPeriod = ref("");
const selectedAmount = ref("");
const openFilter = ref<FilterKey | null>(null);

const financeStore = useFinanceStore();
const { transactions, loading, error } = useTransactions();

const periodOptions = [
  { value: "", label: "За всё время" },
  { value: "today", label: "Сегодня" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
];

const amountOptions = [
  { value: "", label: "Любая сумма" },
  { value: "small", label: "До 1 000 ₽" },
  { value: "large", label: "От 1 000 ₽" },
];

const transactionList = computed<OperationTransaction[]>(() => {
  return transactions.value as OperationTransaction[];
});

const transactionTypes = computed(() => {
  const types = new Set(
    transactionList.value.map((transaction) => transaction.type),
  );
  return Array.from(types);
});

const periodLabel = computed(() => {
  return selectedPeriod.value
    ? periodOptions.find((option) => option.value === selectedPeriod.value)
        ?.label || "Период"
    : "Период";
});

const amountLabel = computed(() => {
  return selectedAmount.value
    ? amountOptions.find((option) => option.value === selectedAmount.value)
        ?.label || "Сумма"
    : "Сумма";
});

const typeLabel = computed(() => selectedType.value || "Что показывать");

const filteredTransactions = computed(() => {
  return transactionList.value.filter((transaction) => {
    const matchesType =
      !selectedType.value || transaction.type === selectedType.value;
    const matchesPeriod = isInsidePeriod(
      transaction.date,
      selectedPeriod.value,
    );
    const matchesAmount = isInsideAmount(
      transaction.amount,
      selectedAmount.value,
    );

    return matchesType && matchesPeriod && matchesAmount;
  });
});

const groupedTransactions = computed(() => {
  const groups = new Map<
    string,
    {
      label: string;
      total: number;
      transactions: OperationTransaction[];
    }
  >();

  filteredTransactions.value.forEach((transaction) => {
    if (!groups.has(transaction.date)) {
      groups.set(transaction.date, {
        label: formatOperationDate(transaction.date),
        total: 0,
        transactions: [],
      });
    }

    const group = groups.get(transaction.date);

    if (!group) {
      return;
    }

    group.transactions.push(transaction);
  });

  return Array.from(groups.entries()).map(([key, group]) => {
    const expenseTotal = group.transactions
      .filter((transaction) => !isIncome(transaction.type))
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const fallbackTotal = group.transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );

    return {
      key,
      ...group,
      total: expenseTotal || fallbackTotal,
    };
  });
});

const toggleFilter = (filter: FilterKey) => {
  openFilter.value = openFilter.value === filter ? null : filter;
};

const selectType = (type: string) => {
  selectedType.value = type;
  openFilter.value = null;
};

const selectPeriod = (period: string) => {
  selectedPeriod.value = period;
  openFilter.value = null;
};

const selectAmount = (amount: string) => {
  selectedAmount.value = amount;
  openFilter.value = null;
};

function isIncome(type: string) {
  return type.toLowerCase().includes("поступ");
}

function isInsideAmount(amount: number, amountFilter: string) {
  if (!amountFilter) {
    return true;
  }

  if (amountFilter === "small") {
    return amount < 1000;
  }

  return amount >= 1000;
}

function isInsidePeriod(date: string, period: string) {
  if (!period) {
    return true;
  }

  const operationDate = parseOperationDate(date);

  if (!operationDate) {
    return false;
  }

  const today = startOfDay(new Date());
  const targetDate = startOfDay(operationDate);
  const diffDays = Math.floor(
    (today.getTime() - targetDate.getTime()) / 86_400_000,
  );

  if (period === "today") {
    return diffDays === 0;
  }

  if (period === "week") {
    return diffDays >= 0 && diffDays < 7;
  }

  return diffDays >= 0 && diffDays < 31;
}

function formatMoney(amount: number) {
  const numericAmount = Number(amount);
  const hasCents = !Number.isInteger(numericAmount);

  return `${numericAmount.toLocaleString("ru-RU", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })} ₽`;
}

</script>

<template>
  <div class="operations_page">
    <BackButton />
    <header class="operations_header">
      <div>
        <h1>История</h1>
        <p>{{ filteredTransactions.length }} операций</p>
      </div>

      <div class="header_actions">
        <button
          class="icon_button"
          type="button"
          :aria-label="
            financeStore.showFinance ? 'Показать суммы' : 'Скрыть суммы'
          "
          @click="financeStore.toggleVisibility"
        >
          <EyeEmptyIcon v-if="financeStore.showFinance" />
          <EyeOffIcon v-else />
        </button>

        <button class="icon_button" type="button" aria-label="Опции">
          <KebabHorizontalIcon />
        </button>
      </div>
    </header>

    <section class="filters_bar" aria-label="Фильтры истории">
      <div class="filter_control">
        <button
          class="filter_chip"
          :class="{ active: selectedType }"
          type="button"
          :aria-expanded="openFilter === 'type'"
          @click="toggleFilter('type')"
        >
          <span>{{ typeLabel }}</span>
          <SmallArrowDownIcon />
        </button>

        <div v-if="openFilter === 'type'" class="filter_menu">
          <button
            class="filter_menu_item"
            type="button"
            @click="selectType('')"
          >
            Все операции
          </button>
          <button
            v-for="type in transactionTypes"
            :key="type"
            class="filter_menu_item"
            type="button"
            @click="selectType(type)"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <div class="filter_control">
        <button
          class="filter_chip"
          :class="{ active: selectedPeriod }"
          type="button"
          :aria-expanded="openFilter === 'period'"
          @click="toggleFilter('period')"
        >
          <span>{{ periodLabel }}</span>
          <SmallArrowDownIcon />
        </button>

        <div v-if="openFilter === 'period'" class="filter_menu">
          <button
            v-for="option in periodOptions"
            :key="option.value"
            class="filter_menu_item"
            type="button"
            @click="selectPeriod(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="filter_control">
        <button
          class="filter_chip"
          type="button"
          :aria-expanded="openFilter === 'product'"
          @click="toggleFilter('product')"
        >
          <span>Карта или счёт</span>
          <SmallArrowDownIcon />
        </button>

        <div
          v-if="openFilter === 'product'"
          class="filter_menu filter_menu-wide"
        >
          <button
            class="filter_menu_item"
            type="button"
            @click="openFilter = null"
          >
            Все карты и счета
          </button>
        </div>
      </div>

      <div class="filter_control">
        <button
          class="filter_chip"
          :class="{ active: selectedAmount }"
          type="button"
          :aria-expanded="openFilter === 'amount'"
          @click="toggleFilter('amount')"
        >
          <span>{{ amountLabel }}</span>
          <SmallArrowDownIcon />
        </button>

        <div v-if="openFilter === 'amount'" class="filter_menu">
          <button
            v-for="option in amountOptions"
            :key="option.value"
            class="filter_menu_item"
            type="button"
            @click="selectAmount(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="operations_feed">
      <div v-if="loading" class="state_panel">
        <p>Загрузка операций...</p>
      </div>

      <div v-else-if="error" class="state_panel error_state">
        <p>Ошибка: {{ error }}</p>
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="state_panel">
        <p>Операции не найдены</p>
      </div>

      <template v-else>
        <section
          v-for="group in groupedTransactions"
          :key="group.key"
          class="date_group"
        >
          <div class="date_header">
            <p>{{ group.label }}</p>
            <span>{{
              financeStore.showFinance ? "*******" : formatMoney(group.total)
            }}</span>
          </div>

          <div class="date_operations">
            <HistoryItem
              v-for="transaction in group.transactions"
              :key="transaction.id"
              :ammount="transaction.amount.toString()"
              :type="transaction.type"
              :from="transaction.counterparty"
              :transaction="transaction.id.toString()"
            />
          </div>
        </section>
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.operations_page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.operations_header {
  align-items: flex-start;
  background: linear-gradient(135deg, #d6e0ff, #f6e4f1);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;

  h1 {
    color: #262626;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }

  p {
    color: rgba(38, 38, 38, 0.58);
    font-size: 0.95rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
}

.header_actions {
  display: flex;
  gap: 0.5rem;
}

.icon_button {
  align-items: center;
  background: rgba(255, 255, 255, 0.52);
  border: none;
  border-radius: 12px;
  color: #262626;
  cursor: pointer;
  display: flex;
  height: 44px;
  justify-content: center;
  padding: 0;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
  width: 44px;

  svg {
    fill: currentColor;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.72);
  }

  &:active {
    transform: scale(0.98);
  }
}

.filters_bar {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

  &:hover,
  &.active {
    background: #f8fbf8;
    box-shadow: inset 0 0 0 1px rgba(11, 133, 35, 0.22);
    color: #0b8523;
  }
}

.filter_menu {
  background: #fff;
  border-radius: 14px;
  box-shadow:
    0 12px 24px rgba(38, 38, 38, 0.12),
    0 2px 8px rgba(38, 38, 38, 0.06);
  display: flex;
  flex-direction: column;
  left: 0;
  min-width: 210px;
  overflow: hidden;
  padding: 0.35rem;
  position: absolute;
  top: calc(100% + 0.5rem);
  z-index: 5;
}

.filter_menu-wide {
  min-width: 240px;
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

  &:hover {
    background: #f1f1f1;
  }
}

.operations_feed {
  background: none;
  border-radius: 20px;
  overflow: hidden;
  padding: 0.5rem 0;
}

.state_panel {
  align-items: center;
  color: rgba(38, 38, 38, 0.58);
  display: flex;
  font-size: 1rem;
  justify-content: center;
  min-height: 260px;
  padding: 1.5rem;
  text-align: center;
}

.error_state {
  color: #d32f2f;
  font-weight: 600;
}

.date_group {
  padding: 1rem 0;
  background: #fff;

  border-radius: 20px;
  margin-top: 0.8rem;
}

.date_header {
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem 0.65rem;

  p {
    color: #000;
    font-size: 1rem;
    font-weight: 700;
  }

  span {
    opacity: 0.45;
    font-size: 0.9rem;
    font-weight: 700;
  }
}

.date_operations {
  display: flex;
  flex-direction: column;
}

.operation_row {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  transition: background-color 0.15s ease;

  &:hover {
    background: #fafafa;
  }
}

.operation_content {
  flex: 1;
  min-width: 0;
}

.reward_line {
  align-items: center;
  color: #0b8523;
  display: flex;
  font-size: 0.78rem;
  font-weight: 700;
  gap: 0.25rem;
  min-height: 18px;
}

.reward_mark {
  background: #0b8523;
  border-radius: 50%;
  display: inline-block;
  height: 12px;
  position: relative;
  width: 12px;

  &::after {
    background: #fff;
    border-radius: 50%;
    content: "";
    height: 4px;
    left: 4px;
    position: absolute;
    top: 4px;
    width: 4px;
  }
}

.operation_main {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.operation_name {
  color: #262626;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operation_amount {
  color: #262626;
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: right;
  white-space: nowrap;
}

.operation_amount-income {
  color: #0b8523;
}

.operation_meta {
  align-items: center;
  color: rgba(38, 38, 38, 0.52);
  display: flex;
  font-size: 0.85rem;
  gap: 0.75rem;
  line-height: 1.35;
  margin-top: 0.25rem;
  min-width: 0;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .operations_page {
    gap: 0.75rem;
  }

  .operations_header {
    border-radius: 0 0 20px 20px;
    padding: 1.25rem 1rem;

    h1 {
      font-size: 1.65rem;
    }
  }

  .filters_bar {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .operations_feed {
    border-radius: 20px;
  }

  .date_header,
  .operation_row {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .operation_row {
    gap: 0.75rem;
  }

  .operation_icon {
    flex-basis: 44px;
    height: 44px;
    width: 44px;
  }

  .operation_main {
    gap: 0.75rem;
  }

  .operation_name,
  .operation_amount {
    font-size: 0.95rem;
  }
}
</style>
