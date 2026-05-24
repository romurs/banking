import { getCookie, deleteCookie } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";

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

    const { id } = getRouterParams(event);
    const userId = payload.userId;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: parseInt(id || "0"),
        userId,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        counterparty: true,
        date: true,
        account: {
          select: {
            id: true,
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

    const typeMap: Record<string, string> = {
      payment: "Оплата товаров и услуг",
      transfer: "Перевод",
      income: "Прочие поступления",
    };

    return {
      ...transaction,
      amount: Number(transaction.amount),
      type: typeMap[transaction.type] || transaction.type,
      date: new Date(transaction.date).toLocaleDateString("ru-RU"),
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
