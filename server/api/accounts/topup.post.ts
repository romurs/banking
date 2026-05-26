import { getCookie, deleteCookie } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");
  if (!token)
    throw createError({ statusCode: 401, message: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload?.userId || typeof payload.userId !== "number") {
    deleteCookie(event, "auth_token");
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  const body = await readBody(event);
  const { accountId, amount } = body as { accountId?: number; amount?: number };

  if (!accountId || !amount || typeof amount !== "number" || amount <= 0) {
    throw createError({ statusCode: 400, message: "Invalid parameters" });
  }

  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });
    // generated Prisma client in this project exposes `userId` on accounts
    if (!account || account.userId !== payload.userId) {
      throw createError({ statusCode: 404, message: "Account not found" });
    }

    // If the schema doesn't include `type`, skip account type check.

    const newBalance = Number(account.balance) + amount;

    const updated = await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    await prisma.transaction.create({
      data: {
        accountId: accountId,
        amount: amount,
        type: "INCOME",
        counterparty: "Пополнение счёта",
        description: "Пополнение через приложение",
        // some generated clients use `userId` for the relation field
        userId: payload.userId,
      },
    });

    return updated;
  } catch (err) {
    console.error("Top-up error:", err);
    throw createError({ statusCode: 500, message: "Top-up failed" });
  }
});
