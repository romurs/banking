import { createError, deleteCookie, getCookie, readBody } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";

interface TransferPayload {
  amount?: number;
  comment?: string;
  fromAccountId?: number;
  recipient?: string;
}

const isHttpError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("statusCode" in error || "status" in error)
  );
};

const getUserName = (user: {
  email: string;
  firstName: string | null;
  lastName: string | null;
}) => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
};

const normalizeRecipientNumber = (recipient: string) => {
  return recipient.replace(/\D/g, "");
};

const resolveRecipientAccount = async (userId: number, recipient: string) => {
  const digits = normalizeRecipientNumber(recipient);

  if (!digits) {
    return null;
  }

  const accountByNumber = await prisma.account.findFirst({
    where: {
      accountNumber: digits,
      ownerUserId: {
        not: userId,
      },
      isActive: true,
    },
    select: {
      id: true,
      balance: true,
      accountNumber: true,
      cardLastFour: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  if (accountByNumber?.user) {
    return accountByNumber;
  }

  if (digits.length < 4) {
    return null;
  }

  const cardLastFour = digits.slice(-4);
  const cardMatches = await prisma.account.findMany({
    where: {
      cardLastFour,
      ownerUserId: {
        not: userId,
      },
      isActive: true,
    },
    select: {
      id: true,
      balance: true,
      accountNumber: true,
      cardLastFour: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });

  const userCardMatches = cardMatches.filter((account) => account.user);

  if (userCardMatches.length > 1) {
    throw createError({
      statusCode: 409,
      message: "Several cards match this number",
    });
  }

  return userCardMatches[0] || null;
};

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

    const body = ((await readBody(event)) || {}) as TransferPayload;
    const amount = Number(body.amount);
    const fromAccountId = Number(body.fromAccountId);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw createError({ statusCode: 400, message: "Invalid amount" });
    }

    if (!Number.isInteger(fromAccountId) || fromAccountId <= 0) {
      throw createError({ statusCode: 400, message: "Invalid source account" });
    }

    const senderAccount = await prisma.account.findFirst({
      where: {
        id: fromAccountId,
        ownerUserId: payload.userId,
        isActive: true,
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!senderAccount) {
      throw createError({ statusCode: 404, message: "Source account not found" });
    }

    if (Number(senderAccount.balance) < amount) {
      throw createError({ statusCode: 400, message: "Not enough money" });
    }

    const recipientAccount = await resolveRecipientAccount(
      payload.userId,
      body.recipient || "",
    );

    if (!recipientAccount?.user) {
      throw createError({ statusCode: 404, message: "Recipient not found" });
    }

    const senderUser = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!senderUser) {
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }

    const recipientUser = recipientAccount.user;
    const recipientName = getUserName(recipientUser);
    const senderName = getUserName(senderUser);
    const description = body.comment?.trim() || "Перевод клиенту банка";
    const date = new Date();

    const result = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: {
          id: senderAccount.id,
        },
        data: {
          balance: Number(senderAccount.balance) - amount,
        },
      });

      await tx.account.update({
        where: {
          id: recipientAccount.id,
        },
        data: {
          balance: Number(recipientAccount.balance) + amount,
        },
      });

      const outgoing = await tx.transaction.create({
        data: {
          ownerType: "INDIVIDUAL",
          ownerUserId: payload.userId,
          ownerLegalId: null,
          accountId: senderAccount.id,
          amount,
          type: "TRANSFER_OUT",
          counterparty: recipientName,
          description,
          date,
        },
        select: {
          id: true,
        },
      });

      await tx.transaction.create({
        data: {
          ownerType: "INDIVIDUAL",
          ownerUserId: recipientUser.id,
          ownerLegalId: null,
          accountId: recipientAccount.id,
          amount,
          type: "TRANSFER_IN",
          counterparty: senderName,
          description,
          date,
        },
      });

      return outgoing;
    });

    return {
      success: true,
      transactionId: result.id,
      recipientName,
      amount,
    };
  } catch (error) {
    if (isHttpError(error)) {
      throw error;
    }

    console.error("Transfer error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
