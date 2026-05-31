export const formatMoney = (amount: number | undefined | null) => {
  const numericAmount = Number(amount || 0);
  const hasCents = !Number.isInteger(numericAmount);
  return `${numericAmount.toLocaleString("ru-RU", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })} ₽`;
};

export const formatSignedMoney = (amount: number | undefined | null) => {
  const n = Number(amount || 0);
  const sign = n > 0 ? "" : n < 0 ? "-" : "";
  return sign + formatMoney(Math.abs(n));
};

export const monthKeyToLabel = (key: string) => {
  const [y, m] = key.split("-");
  try {
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleString("ru-RU", { month: "short", year: "numeric" });
  } catch {
    return key;
  }
};
