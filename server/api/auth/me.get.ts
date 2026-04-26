import { deleteCookie, getCookie } from "h3";
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

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    deleteCookie(event, "auth_token");
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  return {
    user: {
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
    },
  };
});
