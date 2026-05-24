import { getCookie, deleteCookie } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
  
  const token = getCookie(event, "auth_token");

  if (!token) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  const payload = verifyToken(token);

  if (!payload?.userId || typeof payload.userId !== "number") {
    deleteCookie(event, "auth_token");
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка при получении счетов",
    });
  }
});
