import { createError, deleteCookie, getCookie, getRouterParam } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";

const typeMap: Record<string, string> = {
  payment: "Оплата товаров и услуг",
  transfer: "Перевод",
  income: "Прочие поступления",
};

const mccMap: Record<string, string | null> = {
  payment: "5947",
  transfer: null,
  income: null,
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ru-RU").format(date);

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const isHttpError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("statusCode" in error || "status" in error)
  );
};

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");

    if (!token) {
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }

    const payload = verifyToken(token);

    if (!payload?.userId || typeof payload.userId !== "number") {
      deleteCookie(event, "auth_token");
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }

    const id = getRouterParam(event, "id");
    const transactionId = Number(id);

    if (!id || !Number.isInteger(transactionId) || transactionId <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid transaction id",
      });
    }

    const userId = payload.userId;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        counterparty: true,
        date: true,
        accountId: true,
        account: {
          select: {
            id: true,
            accountNumber: true,
            cardLastFour: true,
            balance: true,
            currency: true,
          },
        },
      },
    });

    if (!transaction) {
      throw createError({
        statusCode: 404,
        statusMessage: "Transaction not found",
      });
    }

    const operationDate = new Date(transaction.date);

    return {
      id: transaction.id,
      amount: Number(transaction.amount),
      rawType: transaction.type,
      type: typeMap[transaction.type] || transaction.type,
      description: transaction.description,
      counterparty: transaction.counterparty,
      accountId: transaction.accountId,
      date: formatDate(operationDate),
      dateTime: formatDateTime(operationDate),
      mccCode: mccMap[transaction.type] ?? null,
      account: {
        id: transaction.account.id,
        accountNumberLastFour: transaction.account.accountNumber.slice(-4),
        cardLastFour: transaction.account.cardLastFour,
        balance: Number(transaction.account.balance),
        currency: transaction.account.currency,
      },
    };
  } catch (error) {
    if (isHttpError(error)) {
      throw error;
    }

    console.error("Error fetching transaction:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
