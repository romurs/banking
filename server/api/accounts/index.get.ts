import { prisma } from "../../utils/db";

export default defineEventHandler(async () => {
  try {
    const userId = 1; // TODO: получить из JWT токена

    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        accountNumber: true,
        cardLastFour: true,
        balance: true,
        currency: true,
        isActive: true,
      },
    });

    return accounts.map((acc) => ({
      id: acc.id,
      accountNumber: acc.accountNumber,
      cardLastFour: acc.cardLastFour,
      balance: Number(acc.balance),
      currency: acc.currency,
      isActive: acc.isActive,
    }));
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
