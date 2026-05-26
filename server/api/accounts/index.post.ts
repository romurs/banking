import { getCookie, deleteCookie } from 'h3';
import { prisma } from '../../utils/db';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');
  if (!token) throw createError({ statusCode: 401, message: 'Not authenticated' });

  const payload = verifyToken(token);
  if (!payload?.userId || typeof payload.userId !== 'number') {
    deleteCookie(event, 'auth_token');
    throw createError({ statusCode: 401, message: 'Not authenticated' });
  }

  const body = await readBody(event);
  const { type, creditLimit } = body as { type?: string; creditLimit?: number };

  if (!type || (type !== 'DEBIT' && type !== 'CREDIT')) {
    throw createError({ statusCode: 400, message: 'Invalid account type' });
  }

  try {
    // generate account number and card last four
    const accountNumber = String(Date.now()) + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const cardLastFour = accountNumber.slice(-4);

    if (type === 'DEBIT') {
      const account = await prisma.account.create({
        data: {
          ownerType: 'INDIVIDUAL',
          ownerUserId: payload.userId,
          type: 'DEBIT',
          accountNumber,
          cardLastFour,
          balance: 100000,
          currency: 'RUB',
          isActive: true,
        },
      });

      // initial transaction for the starting balance
      await prisma.transaction.create({
        data: {
          ownerType: 'INDIVIDUAL',
          ownerUserId: payload.userId,
          ownerLegalId: null,
          accountId: account.id,
          amount: 100000,
          type: 'INCOME',
          counterparty: 'Начисление при открытии счета',
          description: 'Стартовый баланс',
        },
      });

      return account;
    }

    // CREDIT
    if (!creditLimit || typeof creditLimit !== 'number' || creditLimit <= 0) {
      throw createError({ statusCode: 400, message: 'Invalid credit limit' });
    }

    const creditAccount = await prisma.account.create({
      data: {
        ownerType: 'INDIVIDUAL',
        ownerUserId: payload.userId,
        type: 'CREDIT',
        accountNumber,
        cardLastFour,
        balance: creditLimit,
        currency: 'RUB',
        isActive: true,
        creditLimit: creditLimit,
        gracePeriodDays: 120,
        interestRate: 9.8,
        minPayment: null,
      },
    });

    return creditAccount;
  } catch (err) {
    console.error('Error creating account:', err);
    throw createError({ statusCode: 500, message: 'Error creating account' });
  }
});
