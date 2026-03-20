import { prisma } from "../../utils/db";

export default defineEventHandler(async () => {
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
  });

  return accounts;
});
