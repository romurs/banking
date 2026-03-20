import { prisma } from "./server/utils/db";

async function main() {
  console.log("Starting seed...");

  // Создаем тестового пользователя
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "password123",
      firstName: "Иван",
      lastName: "Колесников",
    },
  });

  console.log(`Created user: ${user.email}`);

  // Создаем тестовые счета
  const account1 = await prisma.account.create({
    data: {
      userId: user.id,
      accountNumber: "40817810123456789012",
      cardLastFour: "1234",
      balance: 125640.56,
      currency: "RUB",
      isActive: true,
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      accountNumber: "40817810987654321098",
      cardLastFour: "5678",
      balance: 78910.01,
      currency: "RUB",
      isActive: true,
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      accountNumber: "40817810111213141516",
      cardLastFour: "4238",
      balance: 3437346.12,
      currency: "RUB",
      isActive: true,
    },
  });

  console.log(`Created ${3} accounts`);

  // Создаем тестовые транзакции
  const transactions = [
    {
      userId: user.id,
      accountId: account1.id,
      amount: 169.98,
      type: "payment",
      counterparty: "Магнит",
      description: "Оплата товаров и услуг",
      date: new Date("2026-03-12"),
    },
    {
      userId: user.id,
      accountId: account1.id,
      amount: 2000,
      type: "transfer",
      counterparty: "Т.Банк Колесников А.В",
      description: "Перевод",
      date: new Date("2026-03-12"),
    },
    {
      userId: user.id,
      accountId: account1.id,
      amount: 200000,
      type: "income",
      counterparty: "ООО 'Ебашь Монтаж'",
      description: "Прочие поступления",
      date: new Date("2026-03-12"),
    },
  ];

  for (const trans of transactions) {
    await prisma.transaction.create({
      data: trans,
    });
  }

  console.log(`Created ${transactions.length} transactions`);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
