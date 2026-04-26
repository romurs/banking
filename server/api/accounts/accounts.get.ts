// server/api/accounts.get.ts
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Не авторизован'
    })
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: user.userId
      },
      orderBy: { createdAt: 'desc' }
    })

    return accounts
  } catch (error) {
    console.error('Error fetching accounts:', error)
    throw createError({
      statusCode: 500,
      message: 'Ошибка при получении счетов'
    })
  }
})