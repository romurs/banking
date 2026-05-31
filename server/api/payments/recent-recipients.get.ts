import { createError, deleteCookie, getCookie } from "h3";
import { prisma } from "../../utils/db";
import { verifyToken } from "../../utils/jwt";

const isHttpError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("statusCode" in error || "status" in error)
  );
};

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const getUserName = (user: {
  email: string;
  firstName: string | null;
  lastName: string | null;
}) => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
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

    const currentUser = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!currentUser) {
      throw createError({ statusCode: 401, message: "Not authenticated" });
    }

    const senderName = getUserName(currentUser);

    const transfers = await prisma.transaction.findMany({
      where: {
        ownerUserId: payload.userId,
        type: "TRANSFER_OUT",
      },
      orderBy: {
        date: "desc",
      },
      take: 100,
      select: {
        id: true,
        amount: true,
        counterparty: true,
        date: true,
      },
    });

    const recipients = new Map<
      string,
      {
        name: string;
        initials: string;
        recipient: string;
        accountLastFour: string;
        cardLastFour: string | null;
        lastAmount: number;
        lastTransferDate: string;
        transfersCount: number;
      }
    >();

    for (const transfer of transfers) {
      const name = transfer.counterparty.trim();

      if (!name || recipients.has(name)) {
        const existing = recipients.get(name);
        if (existing) {
          existing.transfersCount += 1;
        }
        continue;
      }

      const pairedIncoming = await prisma.transaction.findFirst({
        where: {
          ownerUserId: {
            not: payload.userId,
          },
          type: "TRANSFER_IN",
          amount: transfer.amount,
          date: transfer.date,
          counterparty: senderName,
        },
        select: {
          account: {
            select: {
              accountNumber: true,
              cardLastFour: true,
            },
          },
        },
      });

      recipients.set(name, {
        name,
        initials: getInitials(name) || "П",
        recipient: pairedIncoming?.account.accountNumber || "",
        accountLastFour: pairedIncoming?.account.accountNumber.slice(-4) || "",
        cardLastFour: pairedIncoming?.account.cardLastFour || null,
        lastAmount: Number(transfer.amount),
        lastTransferDate: new Intl.DateTimeFormat("ru-RU").format(
          new Date(transfer.date),
        ),
        transfersCount: 1,
      });
    }

    return Array.from(recipients.values()).slice(0, 12);
  } catch (error) {
    if (isHttpError(error)) {
      throw error;
    }

    console.error("Error fetching recent transfer recipients:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
