import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  return NextResponse.json({ ok: true, user })
}
