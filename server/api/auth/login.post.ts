import { prisma } from '../../utils/db'
import { generateToken } from '../../utils/jwt'
import bcrypt from 'bcryptjs' 


export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    throw createError({ statusCode: 401, message: 'Неверный email или пароль' })
  }

  const token = generateToken({ userId: user.id, email: user.email })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15,
  })

  return { success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }
})