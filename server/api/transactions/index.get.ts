import { prisma } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const userId = 1; // TODO: получить из JWT токена

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        type: true,
        counterparty: true,
        description: true,
        date: true,
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
