import { prisma } from '../../utils/db'
import { generateToken } from '../../utils/jwt'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { email, password, firstName, lastName } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email и пароль обязательны' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 409, message: 'Пользователь уже существует' })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { email, hashedPassword, firstName, lastName },
    select: { id: true, email: true, firstName: true, lastName: true }
  })

  const token = generateToken({ userId: user.id, email: user.email })

  // Устанавливаем httpOnly cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 минут (как в твоём generateToken)
  })

  return { success: true, user }
})