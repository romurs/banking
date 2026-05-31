import { createError, deleteCookie, getCookie, getRouterParam } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";
import { getTransactionLabel } from "../../../utils/transaction-types";

const isHttpError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("statusCode" in error || "status" in error)
  );
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ru-RU").format(date);

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
    const accountId = Number(id);

    if (!id || !Number.isInteger(accountId) || accountId <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid account id",
      });
    }

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        ownerUserId: payload.userId,
      },
      select: {
        id: true,
        accountNumber: true,
        cardLastFour: true,
        balance: true,
        currency: true,
        type: true,
        isActive: true,
        transactions: {
          where: {
            ownerUserId: payload.userId,
          },
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            amount: true,
            type: true,
            counterparty: true,
            description: true,
            date: true,
            accountId: true,
          },
        },
      },
    });

    if (!account) {
      throw createError({
        statusCode: 404,
        statusMessage: "Account not found",
      });
    }

    return {
      id: account.id,
      accountNumberLastFour: account.accountNumber.slice(-4),
      cardLastFour: account.cardLastFour,
      balance: Number(account.balance),
      currency: account.currency,
      type: account.type,
      isActive: account.isActive,
      transactions: account.transactions.map((transaction) => ({
        id: transaction.id,
        amount: Number(transaction.amount),
        type: transaction.type,
        typeLabel: getTransactionLabel(transaction.type),
        counterparty: transaction.counterparty,
        description: transaction.description,
        date: formatDate(new Date(transaction.date)),
        accountId: transaction.accountId,
      })),
    };
  } catch (error) {
    if (isHttpError(error)) {
      throw error;
    }

    console.error("Error fetching account details:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
