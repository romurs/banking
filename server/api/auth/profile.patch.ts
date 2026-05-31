import bcrypt from "bcryptjs";
import { deleteCookie, getCookie, setCookie } from "h3";
import { prisma } from "../../utils/db";
import { generateToken, verifyToken } from "../../utils/jwt";

interface ProfileUpdateBody {
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  password?: unknown;
}

const normalizeText = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};

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

  const body = await readBody<ProfileUpdateBody>(event);
  const email = normalizeText(body.email).toLowerCase();
  const firstName = normalizeText(body.firstName);
  const lastName = normalizeText(body.lastName);
  const password = normalizeText(body.password);

  if (!email || !firstName || !lastName) {
    throw createError({
      statusCode: 400,
      message: "Email, имя и фамилия обязательны",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: "Введите корректный email" });
  }

  if (password && password.length < 6) {
    throw createError({
      statusCode: 400,
      message: "Пароль должен быть не короче 6 символов",
    });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { email: true, id: true },
  });

  if (!currentUser) {
    deleteCookie(event, "auth_token");
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  if (email !== currentUser.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== currentUser.id) {
      throw createError({
        statusCode: 409,
        message: "Пользователь с таким email уже существует",
      });
    }
  }

  const updateData: {
    email: string;
    firstName: string;
    hashedPassword?: string;
    lastName: string;
  } = {
    email,
    firstName,
    lastName,
  };

  if (password) {
    updateData.hashedPassword = await bcrypt.hash(password, 12);
  }

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: updateData,
    select: { email: true, firstName: true, id: true, lastName: true },
  });

  setCookie(event, "auth_token", generateToken({
    email: updatedUser.email,
    userId: updatedUser.id,
  }), {
    httpOnly: true,
    maxAge: 60 * 15,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    success: true,
    user: updatedUser,
  };
});
