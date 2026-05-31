<script setup lang="ts">
import type { PaymentAccount } from "./types";
import { useFinanceStore } from "~/stores/finance";

const props = defineProps<{
  accounts: PaymentAccount[];
  recipient: string;
}>();

const emit = defineEmits<{
  done: [transactionId: number];
  "update:recipient": [value: string];
}>();

const financeStore = useFinanceStore();

const selectedAccountId = ref("");
const amount = ref("");
const comment = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isSubmitting = ref(false);

watch(
  () => props.accounts,
  (accounts) => {
    if (!selectedAccountId.value && accounts.length) {
      selectedAccountId.value = accounts[0].id.toString();
    }
  },
  { immediate: true },
);

const formatMoney = (value: number) => {
  return `${Number(value).toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  })} ₽`;
};

const formatAmountInput = (value: string) => {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/\./g, ",")
    .replace(/[^\d,]/g, "");
  const hasDecimalSeparator = normalized.includes(",");
  const [integerPart = "", ...decimalParts] = normalized.split(",");
  const cleanedInteger = integerPart.replace(/^0+(?=\d)/, "");
  const groupedInteger = (
    cleanedInteger || (hasDecimalSeparator ? "0" : "")
  ).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const decimalPart = decimalParts.join("").slice(0, 2);

  return hasDecimalSeparator
    ? `${groupedInteger},${decimalPart}`
    : groupedInteger;
};

const parseAmountInput = (value: string) => {
  const parsedAmount = Number(value.replace(/\s/g, "").replace(",", "."));

  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

const handleAmountInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formattedValue = formatAmountInput(input.value);

  amount.value = formattedValue;
  input.value = formattedValue;
};

const selectedAccount = computed(() => {
  return props.accounts.find(
    (account) => account.id.toString() === selectedAccountId.value,
  );
});

const amountNumber = computed(() => parseAmountInput(amount.value));

const isAmountOverBalance = computed(() => {
  if (!selectedAccount.value || !amount.value) {
    return false;
  }

  return (
    Number.isFinite(amountNumber.value) &&
    amountNumber.value > Number(selectedAccount.value.balance)
  );
});

const amountErrorText = computed(() => {
  return isAmountOverBalance.value
    ? "Сумма больше доступного остатка"
    : "";
});

const recipientValue = computed({
  get: () => props.recipient,
  set: (value: string) => emit("update:recipient", value),
});

const submitTransfer = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (isAmountOverBalance.value) {
    errorMessage.value = amountErrorText.value;
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch<{
      success: boolean;
      transactionId: number;
      recipientName: string;
      amount: number;
    }>("/api/payments/transfer", {
      method: "POST",
      body: {
        amount: amountNumber.value,
        comment: comment.value,
        fromAccountId: Number(selectedAccountId.value),
        recipient: recipientValue.value,
      },
    });

    amount.value = "";
    comment.value = "";
    successMessage.value = `Перевод отправлен: ${response.recipientName}`;
    emit("done", response.transactionId);
  } catch (error) {
    const fetchError = error as {
      data?: { message?: string; statusMessage?: string };
      message?: string;
    };
    errorMessage.value =
      fetchError.data?.message ||
      fetchError.data?.statusMessage ||
      fetchError.message ||
      "Не удалось выполнить перевод";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form class="transfer_form" @submit.prevent="submitTransfer">
    <div class="form_head">
      <h1>Перевод клиенту банка</h1>
      <p>Введите номер счёта или карты получателя.</p>
    </div>

    <label class="field">
      <span>Списать со счёта</span>
      <select v-model="selectedAccountId" required>
        <option
          v-for="account in props.accounts"
          :key="account.id"
          :value="account.id.toString()"
        >
          Счёт •• {{ account.accountNumber.slice(-4) }}
          {{
            financeStore.showFinance ? "" : `· ${formatMoney(account.balance)}`
          }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Номер счёта или карты</span>
      <input
        v-model="recipientValue"
        inputmode="numeric"
        placeholder="Например, 408178... или 9012"
        required
      />
    </label>

    <label class="field">
      <span class="field_header">
        <span>Сумма</span>
        <span v-if="selectedAccount" class="balance_hint">
          Доступно:
          {{
            financeStore.showFinance
              ? "*******"
              : formatMoney(selectedAccount.balance)
          }}
        </span>
      </span>
      <input
        :value="amount"
        :class="{ invalid: isAmountOverBalance }"
        autocomplete="off"
        inputmode="decimal"
        pattern="[0-9\s,.]*"
        placeholder="0 ₽"
        required
        type="text"
        @input="handleAmountInput"
      />
      <span v-if="amountErrorText" class="field_error">
        {{ amountErrorText }}
      </span>
    </label>

    <label class="field">
      <span>Сообщение</span>
      <input v-model="comment" placeholder="Необязательно" />
    </label>

    <p v-if="errorMessage" class="form_message form_message-error">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="form_message form_message-success">
      {{ successMessage }}
    </p>

    <button
      class="submit_button"
      type="submit"
      :disabled="isSubmitting || isAmountOverBalance"
    >
      {{ isSubmitting ? "Переводим..." : "Перевести" }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.transfer_form {
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.form_head {
  h1 {
    color: #262626;
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
  }

  p {
    color: rgba(38, 38, 38, 0.58);
    font-size: 0.95rem;
    line-height: 1.35;
    margin-top: 0.45rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;

  span {
    color: rgba(38, 38, 38, 0.58);
    font-size: 0.86rem;
    font-weight: 700;
  }

  .field_header {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.75rem;
    justify-content: space-between;
  }

  input,
  select {
    background: #f7f9f7;
    border: 1px solid rgba(38, 38, 38, 0.08);
    border-radius: 14px;
    color: #262626;
    font-family: "Ubuntu", sans-serif;
    font-size: 1rem;
    min-height: 52px;
    outline: none;
    padding: 0 1rem;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;

    &:focus {
      border-color: #0b8523;
      box-shadow: 0 0 0 3px rgba(11, 133, 35, 0.12);
    }

    &.invalid {
      border-color: #d32f2f;
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.12);
    }

    &.invalid:focus {
      border-color: #d32f2f;
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.16);
    }
  }

  select {
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, #0b8523 50%),
      linear-gradient(135deg, #0b8523 50%, transparent 50%);
    background-position:
      calc(100% - 20px) 50%,
      calc(100% - 14px) 50%;
    background-repeat: no-repeat;
    background-size: 6px 6px;
    cursor: pointer;
    padding-right: 2.75rem;
  }

  select option {
    background: #fff;
    color: #262626;
    font-family: "Ubuntu", sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    padding: 0.75rem 1rem;
  }

  select option:checked {
    background: #e8f7ec;
    color: #0b8523;
  }
}

.balance_hint {
  color: rgba(38, 38, 38, 0.58);
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.field_error {
  color: #d32f2f !important;
  font-size: 0.82rem !important;
  font-weight: 700;
}

.form_message {
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.35;
  padding: 0.85rem 1rem;
}

.form_message-error {
  background: #fff5f6;
  color: #d32f2f;
}

.form_message-success {
  background: #e0ffe9;
  color: #0b8523;
}

.submit_button {
  background: #0b8523;
  border: none;
  border-radius: 14px;
  color: #fff;
  cursor: pointer;
  font-family: "Ubuntu", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  min-height: 52px;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:not(:disabled):hover {
    background: #21a038;
  }

  &:not(:disabled):active {
    transform: scale(0.99);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
}

@media (max-width: 480px) {
  .transfer_form {
    padding: 1.25rem 1rem;
  }
}
</style>
