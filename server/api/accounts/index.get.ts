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
