// composables/useOperationDate.ts

export function parseOperationDate(date: string) {
  const [day, month, year] = date.split(".").map(Number);

  if (day && month && year) {
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatOperationDate(dateStr: string): string {
  if (!dateStr) return "";

  const operationDate = parseOperationDate(dateStr);
  if (!operationDate) return dateStr;

  const today = startOfDay(new Date());
  const targetDate = startOfDay(operationDate);
  const diffDays = Math.floor((today.getTime() - targetDate.getTime()) / 86_400_000);

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";

  const datePart = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(operationDate);

  const weekday = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
  })
    .format(operationDate)
    .replace(".", "");

  return `${datePart}, ${weekday}`;
}