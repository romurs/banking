export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  payment: "Оплата товаров и услуг",
  transfer: "Перевод",
  transfer_in: "Входящий перевод",
  transfer_out: "Исходящий перевод",
  income: "Прочие поступления",
  refund: "Возврат",
  credit_payment: "Погашение кредита",
};

export const TRANSACTION_TYPE_KEYS = Object.keys(TRANSACTION_TYPE_LABELS);

export function normalizeTransactionType(
  type: string | null | undefined,
): string {
  if (!type) return "";
  const t = String(type).toUpperCase();

  if (t === "TRANSFER_IN") return "transfer_in";
  if (t === "TRANSFER_OUT") return "transfer_out";
  if (t.startsWith("TRANSFER")) return "transfer";
  if (t === "PAYMENT") return "payment";
  if (t === "INCOME") return "income";
  if (t === "REFUND") return "refund";
  if (t === "CREDIT_PAYMENT") return "credit_payment";

  // fallback: try lowercased raw value
  return String(type).toLowerCase();
}

export function getTransactionLabel(type: string | null | undefined): string {
  const key = normalizeTransactionType(type);
  return TRANSACTION_TYPE_LABELS[key] ?? type ?? "";
}

export function isIncomeType(type: string | null | undefined): boolean {
  const key = normalizeTransactionType(type);
  return key === "income" || key === "transfer_in";
}

export default {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_KEYS,
  normalizeTransactionType,
  getTransactionLabel,
  isIncomeType,
};
