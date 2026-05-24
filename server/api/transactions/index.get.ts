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

    const userId = payload.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        type: true,
        counterparty: true,
        description: true,
        date: true,
        accountId: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 50,
    });

    return transactions.map((trans) => {
      // Определяем тип по русскому названию для фронтенда
      const typeMap: Record<string, string> = {
        payment: "Оплата товаров и услуг",
        transfer: "Перевод",
        income: "Прочие поступления",
      };

      return {
        id: trans.id,
        amount: Number(trans.amount),
        type: typeMap[trans.type] || trans.type,
        counterparty: trans.counterparty,
        description: trans.description,
        date: new Date(trans.date).toLocaleDateString("ru-RU"),
        accountId: trans.accountId,
      };
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
