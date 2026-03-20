import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event);
    const userId = 1; // TODO: получить из JWT токена

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
